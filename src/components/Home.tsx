import { Box, Button, Center, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function () {
  return (
    <Center height={'80vh'}>
      <VStack>
        <Link to="/login">
          <Button bg={'red.500'} _hover={{ bg: 'red.400' }} color={'white'}>
            Login
          </Button>
        </Link>

        <Link to="/register">
          <Button bg={'red.500'} _hover={{ bg: 'red.400' }} color={'white'}>
            Sign in
          </Button>
        </Link>
        <Link to="/board">
          <Button bg={'green.500'} _hover={{ bg: 'green.400' }} color={'white'}>
            Go to dashboard
          </Button>
        </Link>
      </VStack>
    </Center>
  );
}
