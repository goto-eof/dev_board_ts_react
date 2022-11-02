import { Center, Link, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Center p={4}>
      <Text color={'gray.500'}>
        <Link href="https://www.andre-i.dev">Andrei Dodu</Link>, 2022
      </Text>
    </Center>
  );
}
