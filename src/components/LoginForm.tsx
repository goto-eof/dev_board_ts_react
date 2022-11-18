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
import { useNavigate } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import Result from '../core/ResultI';
import { ColumnResponseI } from '../core/ColumnResponseI';
import { LoginRequestI } from '../core/LoginRequestI';

export default function LoginForm() {
  const [states, setStates] = useState({
    username: 'admin',
    password: 'password',
    error: new Map<string, boolean>(),
    isInvalid: false,
    columns: Array<ColumnResponseI>(),
  });

  const navigate = useNavigate();

  useEffect(() => {}, []);

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
    GenericService.create<LoginRequestI>('user/login', {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value,
    }).then((response: Result<LoginRequestI>) => {
      // if (response.success) {
      navigate('/board');
      // }
    });
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>Login</Heading>
        <form onSubmit={save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <FormLabel>username</FormLabel>
            <Input
              type="text"
              value={states.username}
              name="username"
              onChange={handleInputChange}
            />
            <Errors fieldName={'username'} />

            <FormLabel>password</FormLabel>
            <Input
              type="password"
              value={states.password}
              name="password"
              onChange={handleInputChange}
            />
            <Errors fieldName={'password'} />

            <Button type="submit" mt={3} w={'100%'} colorScheme="green">
              Save
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Center>
  );
}
