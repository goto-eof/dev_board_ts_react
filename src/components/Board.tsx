import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  SimpleGrid,
  Center,
  Stack,
  useColorModeValue,
  Text,
  Icon,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import Item from './Item';
import { ItemI } from '../core/ItemI';

interface StatsCardProps {
  title: string;
  id: number;
  deleteColumn: (id: number) => void;
}
interface Item {}
export default function Board(props: StatsCardProps) {
  const [items, setItems] = useState<Array<ItemI> | undefined>();

  useEffect(() => {
    GenericService.getByParentId<Item>('item', props.id).then((items: any) =>
      setItems(items.data as Array<ItemI>)
    );
  }, []);

  const deleteItem = (id: number) => {
    GenericService.delete('item', id).then((result: any) => {
      console.log(result);
      if (!result.isError) {
        setItems(items?.filter((item: any) => item.id !== id));
      }
    });
  };

  return (
    <Center py={6}>
      <Box w={'300px'} bg={'white.100'} boxShadow={'xl'} rounded={'md'}>
        <Stack
          textAlign={'center'}
          p={6}
          color={useColorModeValue('gray.800', 'white')}
          align={'center'}
        >
          <Text
            fontSize={'xl'}
            fontWeight={500}
            bg={useColorModeValue('gray.50', 'gray.900')}
            p={2}
            px={3}
            color={'green.500'}
            rounded={'full'}
            w={'full'}
          >
            <Icon as={EditIcon} mr={2} />
            {props.title}{' '}
            <Menu>
              {() => (
                <>
                  <MenuButton>
                    <Icon as={ChevronDownIcon} />
                  </MenuButton>
                  <MenuList>
                    {/* <MenuItem onClick={() => alert('test')}>Edit</MenuItem> */}
                    <MenuItem
                      onClick={() => {
                        props.deleteColumn(props.id || -1);
                      }}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </Text>
          <Stack direction={'row'} align={'center'} justify={'center'}>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={1}>
              {items?.map((itm) => (
                <Item
                  deleteItem={deleteItem}
                  item={itm}
                  key={(itm as ItemI).id}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </Stack>

        <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={10}>
          <Link to={'/new-item/' + props.id}>
            <Button
              mt={0}
              w={'full'}
              bg={'green.400'}
              color={'white'}
              rounded={'xl'}
              boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
              _hover={{
                bg: 'green.500',
              }}
              _focus={{
                bg: 'green.500',
              }}
            >
              + New item
            </Button>
          </Link>
        </Box>
      </Box>
    </Center>
  );
}
