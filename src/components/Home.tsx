import { Button, Center, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function () {
  return (
    <Center height={'80vh'}>
      <VStack>
        <Link to="/dashboards">
          <Button bg={'green.500'} _hover={{ bg: 'green.400' }} color={'white'}>
            Go to dashboard
          </Button>
        </Link>
      </VStack>
    </Center>
  );
}
