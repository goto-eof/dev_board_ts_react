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
import GenericService from '../../service/GenerciService';
import Result from '../../core/ResultI';
import { ColumnResponseI } from '../../core/ColumnResponseI';
import { LoginRequestI } from '../../core/LoginRequestI';
import { JwtI } from '../../core/JwtI';
import { UserResponseI } from '../../core/UserResponseI';

interface LoginFormProps {
  toggleChangedLocalStorage: () => void;
}
export default function LoginForm({
  toggleChangedLocalStorage,
}: LoginFormProps) {
  const [states, setStates] = useState({
    username: '',
    password: '',
    error: new Map<string, boolean>(),
    isInvalid: false,
    columns: Array<ColumnResponseI>(),
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

  const login = (e: any) => {
    e.preventDefault();
    GenericService.createDifResponse<LoginRequestI, JwtI>('user/login', {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value,
    }).then((response: Result<JwtI>) => {
      if (response.success) {
        localStorage.setItem('token', response.result.jwt);
        GenericService.get<Result<UserResponseI>>('user/get_user').then(
          (response) => {
            if (response.success) {
              localStorage.setItem('user', JSON.stringify(response.result));
              toggleChangedLocalStorage();
              navigate('/');
            }
          }
        );
      }
    });
  };

  return (
    <Center>
      <VStack w="full" width={'50%'} bg={'gray.50'} p={0} borderRadius={'3%'}>
        <Heading
          p={4}
          w={'100%'}
          textAlign={'center'}
        >
          Login
        </Heading>
        <form onSubmit={login} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'} p={4}>
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
              Sign in
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Center>
  );
}
