import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  EditIcon,
} from '@chakra-ui/icons';
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
  HStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import Item from './Item';
import Result from '../core/ResultI';
import { DeleteResultI } from '../core/DeleteResultI';
import { ItemIR } from '../core/ItemRequestI';

interface StatsCardProps {
  title: string;
  id: number;
  deleteColumn: (id: number) => void;
  moveLeft: (id: number) => void;
  moveRight: (id: number) => void;
}
interface Item {}
export default function Board(props: StatsCardProps) {
  const [items, setItems] = useState<Array<ItemIR> | undefined>();

  useEffect(
    () => {
      GenericService.getByParentId<Result<Array<ItemIR>>>(
        'item',
        props.id
      ).then((items: Result<Array<ItemIR>>) => setItems(items.result));
    },
    // TODO:
    // we should avoid another api call after board position is changed, but
    // for now we will make 2 api calls for every move of the board
    [props.id]
  );

  const deleteItem = (id: number) => {
    GenericService.delete<DeleteResultI>('item', id).then(
      (result: DeleteResultI) => {
        if (result.success) {
          setItems(items?.filter((item: any) => item.id !== id));
        }
      }
    );
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
          <HStack>
            <Box as="button" onClick={() => props.moveLeft(props.id)}>
              <Icon
                as={ArrowLeftIcon}
                color={'gray.400'}
                _hover={{ color: 'green.200' }}
              />
            </Box>
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
            </Text>
            <Menu>
              {() => (
                <>
                  <MenuButton>
                    <Icon as={ChevronDownIcon} />
                  </MenuButton>
                  <MenuList>
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
            <Box as="button" onClick={() => props.moveRight(props.id)}>
              <Icon
                _hover={{ color: 'green.200' }}
                as={ArrowRightIcon}
                color={'gray.400'}
              />
            </Box>
          </HStack>
          <Stack direction={'row'} align={'center'} justify={'center'}>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={1}>
              {items?.map((itm) => (
                <Item
                  deleteItem={deleteItem}
                  item={itm}
                  key={(itm as ItemIR).id}
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
