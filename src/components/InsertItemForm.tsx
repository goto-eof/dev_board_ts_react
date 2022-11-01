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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import Result from '../core/ResultI';
import { ColumnResponseI } from '../core/ColumnResponseI';
import { ItemIR } from '../core/ItemRequestI';
import { ItemIUpdateRequest } from '../core/ItemUpdateRequestI';

export default function InsertItemForm() {
  const { boardId, itemId } = useParams();

  const [states, setStates] = useState({
    itemName: '',
    type: '',
    itemStatus: '',
    code: '',
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
        >('column');
        const fields = itemId
          ? await GenericService.get<Result<ItemIR>>('item', Number(itemId))
          : null;
        setStates({
          ...states,
          itemName: fields ? fields.result.name : '',
          type: fields ? fields.result.t_type : '',
          itemStatus: fields ? fields.result.status : '',
          code: fields ? fields.result.code : '',
          description: fields ? fields.result.description : '',
          defaultBoard: boardId || '',
          columns: columns.result,
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
    GenericService.create<ItemIR>('item', {
      name: e.target.elements.itemName.value,
      t_type: e.target.elements.type.value,
      code: e.target.elements.code.value,
      column_id: Number(boardId),
      order: 0,
      description: e.target.elements.description.value,
      status: e.target.elements.itemStatus.value,
    }).then((response: Result<ItemIR>) => {
      navigate('/board');
    });
  };

  const update = (e: any) => {
    e.preventDefault();
    if (itemId) {
      GenericService.update<ItemIUpdateRequest, ItemIR>(
        'item',
        Number(itemId),
        {
          name: e.target.elements.itemName.value,
          t_type: e.target.elements.type.value,
          code: e.target.elements.code.value,
          column_id: Number(e.target.elements.defaultBoard.value),
          description: e.target.elements.description.value,
          status: e.target.elements.itemStatus.value,
        }
      ).then((response) => {
        navigate('/board');
      });
    }
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>Task/Bug/Feature</Heading>
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
            />
            <Errors fieldName={'name'} />

            <FormLabel>Type</FormLabel>
            <Input
              type="text"
              value={states.type}
              name="type"
              onChange={handleInputChange}
            />
            <Errors fieldName="type" />

            <FormLabel>Code</FormLabel>
            <Input
              type="text"
              name="code"
              value={states.code}
              onChange={handleInputChange}
            />
            <Errors fieldName="code" />

            <FormLabel>Status</FormLabel>
            <Select placeholder="Select option" name="itemStatus">
              <option value="0">To do</option>
              <option value="1">Done</option>
            </Select>
            <Errors fieldName="status" />

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
