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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import { ColumnUpdateI } from '../core/ColumnUpdateI';
import ResultI from '../core/ResultI';
import { ColumnResponseI } from '../core/ColumnResponseI';

export default function InsertColumnForm() {
  const [states, setStates] = useState({
    boardName: '',
    order: -1,
    error: new Map<string, boolean>(),
    isInvalid: false,
  });

  const { boardId } = useParams();

  const navigate = useNavigate();

  const handleInputChange = (e: any) => {
    setStates({
      ...states,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (boardId) {
      GenericService.get<ResultI<ColumnResponseI>>(
        'column',
        Number(boardId)
      ).then((result) => {
        setStates({
          ...states,
          boardName: result.result.name,
          order: result.result.order,
        });
      });
    }
  }, []);

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
      name: e.target.elements.boardName.value,
      order: states.order,
    }).then((response) => {
      navigate('/board');
    });
  };

  const update = (e: any) => {
    e.preventDefault();

    GenericService.update<ColumnUpdateI, ColumnResponseI>(
      'column',
      Number(boardId),
      {
        name: e.target.elements.boardName.value,
        order: states.order,
      }
    ).then((response) => {
      navigate('/board');
    });
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>Board</Heading>
        <form onSubmit={boardId ? update : save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <FormLabel>Id</FormLabel>
            <Input
              readOnly={true}
              type="text"
              value={boardId}
              bg={'gray.200'}
              name="id"
              onChange={handleInputChange}
              autoFocus
            />
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={states.boardName}
              name="boardName"
              onChange={handleInputChange}
              autoFocus
            />
            <Errors fieldName={'boardName'} />

            <Button type="submit" mt={3} w={'100%'} colorScheme="green">
              Save
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Center>
  );
}
