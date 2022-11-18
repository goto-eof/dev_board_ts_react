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
  Flex,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import Item from './Item';
import { DeleteResultI } from '../core/DeleteResultI';
import { ItemRequestI } from '../core/ItemRequestI';
import SwapRequestI from '../core/SwapRequestI';
import ResultI from '../core/ResultI';

interface StatsCardProps {
  title: string;
  id: number;
  items: Array<ItemRequestI>;
  _showLeftArrow: boolean;
  _showRightArrow: boolean;
  deleteColumn: (id: number) => void;
  moveLeft: (id: number) => void;
  moveRight: (id: number) => void;
  setItems: (boardId: number, items: Array<ItemRequestI>) => void;
  goToEdit: (boardId: number) => void;
  updateBoardItems: (boardId: number, items: Array<ItemRequestI>) => void;
}
export default function Board(props: StatsCardProps) {
  const deleteItem = (id: number) => {
    GenericService.delete<DeleteResultI>('item', id).then(
      (result: DeleteResultI) => {
        if (result.success) {
          props.setItems(
            props.id,
            props.items.filter((item: any) => item.id !== id)
          );
        }
      }
    );
  };

  const moveUp = (id?: number) => {
    if (!id) {
      return;
    }
    swap(id, -1);
  };

  const swap = (id: number, direction: number) => {
    let idB = calculateIdB(props.items, id, direction);
    let swapRequest: SwapRequestI = {
      id_a: id,
      id_b: idB,
    };
    GenericService.swap<SwapRequestI, ResultI<boolean>>(
      'item',
      swapRequest
    ).then((result) => {
      console.log(result);
      if (result.success) {
        let newItems = swapList(props.items, id, idB);
        props.updateBoardItems(props.id, newItems);
      }
    });
  };

  const canMoveDown = (id: number) => {
    let item = props.items.filter((item) => item.id === id)[0];
    return props.items.indexOf(item) !== props.items.length - 1;
  };

  const canMoveUp = (id: number) => {
    let item = props.items.filter((item) => item.id === id)[0];
    return props.items.indexOf(item) !== 0;
  };

  const calculateIdB = (
    list: Array<ItemRequestI>,
    idA: number,
    direction: number
  ): number => {
    let indexA = list.indexOf(list.filter((item) => item.id === idA)[0]);
    if (!list[indexA + direction]) {
      return -1;
    }
    return list[indexA + direction].id || -1;
  };

  function swapList(
    items: Array<ItemRequestI>,
    idA: number,
    idB: number
  ): Array<ItemRequestI> {
    let list = [...items];
    let a = list.filter((item) => item.id === idA)[0];
    let b = list.filter((item) => item.id === idB)[0];
    let orderA = a.order;
    a.order = b.order;
    b.order = orderA;

    items[items.indexOf(a)] = b;
    items[items.indexOf(b)] = a;

    return sort(list);
  }

  const moveDown = (id?: number) => {
    if (!id) {
      return;
    }
    swap(id, 1);
  };

  const sort = (items: Array<ItemRequestI>): Array<ItemRequestI> => {
    items.sort((a, b) => a.order - b.order);
    return items;
  };

  return (
    <Center py={6}>
      <Box w={'300px'} bg={'white'} boxShadow={'xl'} rounded={'md'}>
        <Stack
          textAlign={'center'}
          p={6}
          pb={2}
          color={useColorModeValue('gray.800', 'white')}
          align={'center'}
        >
          <HStack>
            {props._showLeftArrow && (
              <Box as="button" onClick={() => props.moveLeft(props.id)}>
                <Icon
                  as={ArrowLeftIcon}
                  color={'gray.400'}
                  _hover={{ color: 'green.200' }}
                />
              </Box>
            )}
            <Flex
              bg={'white.100'}
              border={'1px solid lightgray'}
              rounded={'full'}
              _hover={{ bg: 'green.100' }}
              py={1}
              px={3}
            >
              <Text
                fontSize={'xl'}
                fontWeight={500}
                color={'gray.700'}
                rounded={'full'}
                px={2}
                w={'full'}
              >
                <Icon as={EditIcon} mr={2} />
                {props.title}{' '}
              </Text>
              <Menu>
                {() => (
                  <>
                    <MenuButton>
                      <Icon color={'gray.700'} as={ChevronDownIcon} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => props.goToEdit(props.id || -1)}>
                        Edit
                      </MenuItem>
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
            </Flex>

            {props._showRightArrow && (
              <Box as="button" onClick={() => props.moveRight(props.id)}>
                <Icon
                  _hover={{ color: 'green.200' }}
                  as={ArrowRightIcon}
                  color={'gray.400'}
                />
              </Box>
            )}
          </HStack>
          {props && props.items && props.items.length > 3 && (
            <Box bg={'white'} w={'100%'} px={1} py={1}>
              <Link to={'/new-item/' + props.id}>
                <Button
                  mt={0}
                  w={'full'}
                  bg={'blue.400'}
                  color={'white'}
                  rounded={'xl'}
                  _hover={{
                    bg: 'blue.300',
                  }}
                  _focus={{
                    bg: 'blue.500',
                  }}
                >
                  + New item
                </Button>
              </Link>
            </Box>
          )}
          <Stack direction={'row'} align={'center'} justify={'center'}>
            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={1}>
              {props.items.map((itm) => (
                <Item
                  deleteItem={deleteItem}
                  item={itm}
                  key={(itm as ItemRequestI).id}
                  moveDown={moveDown}
                  moveUp={moveUp}
                  canMoveUp={canMoveUp}
                  canMoveDown={canMoveDown}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </Stack>

        <Box bg={useColorModeValue('gray.50', 'gray.900')} px={1} py={1}>
          <Link to={'/new-item/' + props.id}>
            <Button
              mt={0}
              w={'full'}
              bg={'blue.400'}
              color={'white'}
              rounded={'xl'}
              _hover={{
                bg: 'blue.300',
              }}
              _focus={{
                bg: 'blue.500',
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
