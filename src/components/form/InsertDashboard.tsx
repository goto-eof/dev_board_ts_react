import {
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
  Heading,
  Button,
  Textarea,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericService from '../../service/GenerciService';
import { DashboardUpdateI } from '../../core/DashboardUpdateI';
import ResultI from '../../core/ResultI';
import { DashboardResponseI } from '../../core/DashboardResponseI';
import { ArrowBackIcon } from '@chakra-ui/icons';

export default function InsertColumnForm() {
  const [states, setStates] = useState({
    boardName: '',
    boardDescription: '',
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
      GenericService.getById<ResultI<DashboardResponseI>>(
        'board',
        Number(boardId)
      ).then((result: any) => {
        console.log(result, boardId);
        setStates({
          ...states,
          boardName: result.result.name,
          boardDescription: result.result.description,
          order: result.result.order,
        });
      });
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      GenericService.create<DashboardUpdateI>('board', {
        name: e.target.elements.boardName.value,
        description: e.target.elements.boardDescription.value,
        order: states.order,
      }).then((response) => {
        if (response.success) {
          navigate('/');
        }
      });
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const update = (e: any) => {
    e.preventDefault();

    GenericService.update<DashboardUpdateI, DashboardResponseI>(
      'board',
      Number(boardId),
      {
        name: e.target.elements.boardName.value,
        description: e.target.elements.boardDescription.value,
        order: states.order,
      }
    ).then((response) => {
      if (response.success) {
        navigate('/');
      }
    });
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
          Dashboard
        </Heading>
        <form onSubmit={boardId ? update : save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <FormLabel>Id</FormLabel>
            <Input
              formNoValidate
              borderColor={'gray.800'}
              _invalid={{ border: 'gray.400' }}
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

            <FormLabel>Description</FormLabel>
            <Textarea
              value={states.boardDescription}
              name="boardDescription"
              onChange={handleInputChange}
            />
            <Errors fieldName={'boardDescription'} />

            <Button type="submit" mt={3} w={'100%'} colorScheme="green">
              Save
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Center>
  );
}
