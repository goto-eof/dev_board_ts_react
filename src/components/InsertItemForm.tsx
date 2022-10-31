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
import { Column } from '../core/Column';
import { ItemI } from '../core/ItemI';

export default function InsertItemForm() {
  const { boardId } = useParams();

  const [states, setStates] = useState({
    name: '',
    type: '',
    status: '',
    code: '',
    description: '',
    defaultBoard: '',
    error: new Map<string, boolean>(),
    isInvalid: false,
    columns: Array<Column>(),
  });

  const navigate = useNavigate();

  useEffect(() => {
    GenericService.getAll<Column>('column').then((columns) => {
      setStates({
        ...states,
        defaultBoard: boardId || '',
        columns: columns.data,
      });
    });
  }, []);

  const handleInputChange = (e: any) => {
    console.log(e.target.value);
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
    console.log(e.target);

    GenericService.create<ItemI>('item', {
      name: e.target.elements.name.value,
      t_type: e.target.elements.type.value,
      code: e.target.elements.code.value,
      column_id: Number(boardId),
      description: e.target.elements.description.value,
      status: e.target.elements.status.value,
    }).then((response) => {
      console.log(response);
    });
    navigate('/board');
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>Task/Bug/Feature</Heading>
        <form onSubmit={save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={states.name}
              name="name"
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
            <Select placeholder="Select option" name="status">
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
                  let itm = item as Column;
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
