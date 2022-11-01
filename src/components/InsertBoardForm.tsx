import {
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
  Heading,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import { ColumnResponseI } from '../core/ColumnResponseI';
import { ColumnUpdateI } from '../core/ColumnUpdateI';

export default function InsertColumnForm() {
  const [states, setStates] = useState({
    name: '',
    error: new Map<string, boolean>(),
    isInvalid: false,
  });

  const navigate = useNavigate();

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

    GenericService.create<ColumnUpdateI>('column', {
      name: e.target.elements.name.value,
      order: -1,
    }).then((response) => {
      navigate('/board');
    });
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>Board</Heading>
        <form onSubmit={save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={states.name}
              name="name"
              onChange={handleInputChange}
              autoFocus
            />
            <Errors fieldName={'name'} />

            <Button type="submit" mt={3} w={'100%'} colorScheme="green">
              Save
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Center>
  );
}
