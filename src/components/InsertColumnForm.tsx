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
import { DashboardUpdateI } from '../core/DashboardUpdateI';
import ResultI from '../core/ResultI';
import { ColumnResponseI } from '../core/ColumnResponseI';

export default function InsertColumnForm() {
  const [states, setStates] = useState({
    boardName: '',
    order: -1,
    error: new Map<string, boolean>(),
    isInvalid: false,
  });

  const { columnId, boardId } = useParams();

  const navigate = useNavigate();

  const handleInputChange = (e: any) => {
    setStates({
      ...states,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (columnId) {
      GenericService.get<ResultI<ColumnResponseI>>(
        'column',
        Number(columnId)
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
    return states.error.get(field);
  };

  const validate = () => {
    let map = new Map<string, boolean>(states.error);
    let isValid = true;
    if (!states.boardName) {
      isValid = false;
    }
    map.set('boardName', !isValid);

    setStates({ ...states, error: map, isInvalid: !isValid });
    return isValid;
  };

  const save = (e: any) => {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {
      GenericService.create<DashboardUpdateI>('column/' + boardId, {
        name: e.target.elements.boardName.value,
        order: states.order,
      }).then((response) => {
        if (response.success) {
          navigate('/board/' + boardId);
        }
      });
    }
  };

  const update = (e: any) => {
    e.preventDefault();

    GenericService.update<DashboardUpdateI, ColumnResponseI>(
      'column',
      Number(columnId),
      {
        name: e.target.elements.boardName.value,
        order: states.order,
      }
    ).then((response) => {
      if (response.success) {
        navigate('/board/' + boardId);
      }
    });
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>Board</Heading>
        <form onSubmit={columnId ? update : save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <FormLabel>Id</FormLabel>
            <Input
              formNoValidate
              borderColor={'gray.800'}
              _invalid={{ border: 'gray.400' }}
              readOnly={true}
              type="text"
              value={columnId}
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
