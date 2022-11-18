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
import { RegisterRequestI } from '../core/RegisterRequestI';

export default function RegistrationForm() {
  const [states, setStates] = useState({
    username: '',
    password: '',
    repeatPassword: '',
    email: '',
    firstName: '',
    lastName: '',
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
    GenericService.create<RegisterRequestI>('user/register', {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value,
      email: e.target.elements.email.value,
      first_name: e.target.elements.firstName.value,
      last_name: e.target.elements.lastName.value,
    }).then((response: Result<RegisterRequestI>) => {
      // if (response.success) {
      navigate('/board');
      // }
    });
  };

  return (
    <Center>
      <VStack w="full" width={'50%'}>
        <Heading>Registration</Heading>
        <form onSubmit={save} style={{ width: '100%' }}>
          <FormControl isInvalid={states.isInvalid} w={'100%'}>
            <FormLabel>firstname</FormLabel>
            <Input
              type="text"
              value={states.firstName}
              name="firstName"
              onChange={handleInputChange}
            />
            <Errors fieldName={'firstName'} />

            <FormLabel>lastname</FormLabel>
            <Input
              type="text"
              value={states.lastName}
              name="lastName"
              onChange={handleInputChange}
            />
            <Errors fieldName={'lastName'} />

            <FormLabel>username</FormLabel>
            <Input
              type="text"
              value={states.username}
              name="username"
              onChange={handleInputChange}
            />
            <Errors fieldName={'username'} />

            <FormLabel>email</FormLabel>
            <Input
              type="text"
              value={states.email}
              name="email"
              onChange={handleInputChange}
            />
            <Errors fieldName={'email'} />

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
