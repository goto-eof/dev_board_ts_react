import {
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Button,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import Result from '../core/ResultI';
import { ColumnResponseI } from '../core/ColumnResponseI';
import { ItemRequestI } from '../core/ItemRequestI';
import { ItemUpdateRequestI } from '../core/ItemUpdateRequestI';
import { ArrowBackIcon } from '@chakra-ui/icons';

export default function InsertItemForm() {
  const { boardId, columnId, itemId } = useParams();

  const [states, setStates] = useState({
    itemName: '',
    environment: '',
    itemPriority: '',
    code: '',
    order: 0,
    description: '',
    defaultBoard: '',
    error: new Map<string, boolean>(),
    isInvalid: false,
    columns: Array<ColumnResponseI>(),
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const columns = await GenericService.getAll<
          Result<Array<ColumnResponseI>>
        >('column/all');
        const fields = itemId
          ? await GenericService.getById<Result<ItemRequestI>>(
              'item',
              Number(itemId)
            )
          : null;
        setStates({
          ...states,
          itemName: fields ? fields.result.name : '',
          environment: fields ? fields.result.environment : '',
          itemPriority: fields ? '' + fields.result.priority : '',
          code: fields ? fields.result.code : '',
          description: fields ? fields.result.description : '',
          defaultBoard: columnId || '',
          columns: columns.result,
          order: fields ? fields.result.order : 0,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, []);

  const handleInputChange = (e: any) => {
    setStates({
      ...states,
      [e.target.name]: e.target.value,
    });
  };

  interface ErrorsProps {
    fieldName: string;
  }
  function Errors({ fieldName }: ErrorsProps) {
    return states.isInvalid && hasError(fieldName) ? (
      <FormHelperText>Invalid {fieldName}</FormHelperText>
    ) : (
      <></>
    );
  }

  const hasError = (field: string) => {
    return !!states.error.get(field);
  };

  const save = (e: any) => {
    e.preventDefault();
    GenericService.create<ItemRequestI>('item', {
      name: e.target.elements.itemName.value,
      environment: e.target.elements.environment.value,
      code: e.target.elements.code.value,
      column_id: Number(e.target.elements.defaultBoard.value),
      order: states.order,
      description: e.target.elements.description.value,
      priority: Number(e.target.elements.itemPriority.value),
    }).then((response: Result<ItemRequestI>) => {
      if (response.success) {
        navigate('/board/' + boardId);
      }
    });
  };

  const goBack = () => {
    navigate('/board/' + boardId);
  };

  const update = (e: any) => {
    e.preventDefault();
    if (itemId) {
      GenericService.update<ItemUpdateRequestI, ItemRequestI>(
        'item',
        Number(itemId),
        {
          name: e.target.elements.itemName.value,
          environment: e.target.elements.environment.value,
          code: e.target.elements.code.value,
          column_id: Number(e.target.elements.defaultBoard.value),
          description: e.target.elements.description.value,
          priority: Number(e.target.elements.itemPriority.value),
          order: states.order,
        }
      ).then((response) => {
        if (response.success) {
          navigate('/board/' + boardId);
        }
      });
    }
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>
          <Icon
            fontSize={'2xl'}
            as={ArrowBackIcon}
            color={'gray.400'}
            _hover={{ color: 'green.200' }}
            onClick={goBack}
          />
          Task/Bug/Feature
        </Heading>
        <form onSubmit={itemId ? update : save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <FormLabel>Id</FormLabel>
            <Input
              type="text"
              value={itemId || ''}
              name="id"
              readOnly={true}
              bg={'gray.100'}
            />
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={states.itemName}
              name="itemName"
              onChange={handleInputChange}
              autoFocus
            />
            <Errors fieldName={'name'} />

            <FormLabel>Environment</FormLabel>
            <Input
              type="text"
              value={states.environment}
              name="environment"
              onChange={handleInputChange}
            />
            <Errors fieldName="environment" />

            <FormLabel>Code</FormLabel>
            <Input
              type="text"
              name="code"
              value={states.code}
              onChange={handleInputChange}
            />
            <Errors fieldName="code" />

            <FormLabel>Priority</FormLabel>
            <Select
              placeholder="Select option"
              name="itemPriority"
              value={states.itemPriority}
              onChange={handleInputChange}
            >
              <option value="1">Highest</option>
              <option value="2">Hight</option>
              <option value="3">Medium</option>
              <option value="4">Low</option>
              <option value="5">Lowest</option>
            </Select>
            <Errors fieldName="itemPriority" />

            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={states.description}
              placeholder="Here is a sample placeholder"
              onChange={handleInputChange}
            />
            <Errors fieldName="description" />

            <FormLabel>Board</FormLabel>
            <Select
              placeholder="Select option"
              name="defaultBoard"
              value={states.defaultBoard}
              onChange={handleInputChange}
            >
              {states.columns &&
                states.columns.map((item: any) => {
                  let itm = item as ColumnResponseI;
                  return (
                    <option value={itm.id} key={itm.id}>
                      {itm.name}
                    </option>
                  );
                })}
            </Select>
            <Errors fieldName="board" />

            <Button type="submit" mt={3} w={'100%'} colorScheme="green">
              Save
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Center>
  );
}
