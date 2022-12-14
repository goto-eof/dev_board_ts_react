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
  MenuDivider,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import GenericService from '../service/GenerciService';
import Item from './Item';
import { DeleteResultI } from '../core/DeleteResultI';
import { ItemRequestI } from '../core/ItemI';
import SwapRequestI from '../core/SwapRequestI';
import ResultI from '../core/ResultI';
import ColumnI from '../core/ColumnI';
import { UserResponseI } from '../core/UserResponseI';

interface ColumnProps {
  title: string;
  description: string;
  id: number;
  boardId: string | undefined;
  columnId: number;
  items: Array<ItemRequestI>;
  _showLeftArrow: boolean;
  _showRightArrow: boolean;
  boards?: Array<ColumnI>;
  deleteColumn: (id: number) => void;
  moveLeft: (id: number) => void;
  moveRight: (id: number) => void;
  setItems: (boardId: number, items: Array<ItemRequestI>) => void;
  goToEdit: (boardId: number) => void;
  updateBoardItems: (boardId: number, items: Array<ItemRequestI>) => void;
  updateItem: (item: ItemRequestI) => void;
  moveItem: (
    itemId: number | undefined | null,
    boardIdFrom: number,
    boardIdTo: number
  ) => void;
  users: Array<UserResponseI>;
}
export default function Column(props: ColumnProps) {
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
    <Center py={6} as="div">
      <Box w={'260px'} bg={'black.50'} boxShadow={'xl'} rounded={'md'} p={1}>
        <Stack
          textAlign={'center'}
          color={useColorModeValue('gray.800', 'black.50')}
          align={'center'}
          p={0}
        >
          <Box
            as={HStack}
            borderRadius={'5%'}
            boxShadow={'base'}
            width={'full'}
            justify={'space-between'}
            pl={2}
            pr={2}
          >
            {
              <Box
                py={3}
                p={0}
                as="button"
                m={0}
                onClick={() => props._showLeftArrow && props.moveLeft(props.id)}
              >
                <Icon
                  as={ArrowLeftIcon}
                  color={props._showLeftArrow ? 'gray.700' : 'gray.200'}
                  _hover={{ color: 'green.200' }}
                />
              </Box>
            }
            <Flex
              // border={'1px solid lightgray'}
              // rounded={'full'}
              borderRadius={'md'}
              _hover={{ bg: 'green.100' }}
              py={1}
              px={3}
            >
              <Menu>
                {() => (
                  <>
                    <MenuButton>
                      <Text
                        fontSize={'xl'}
                        fontWeight={500}
                        color={'black.100'}
                        rounded={'full'}
                        px={2}
                        w={'full'}
                      >
                        <Icon as={EditIcon} mr={2} />
                        {props.title}
                      </Text>
                      <Text fontSize={'sm'}>
                        {' ('}
                        {props.items.length}
                        {')'}
                      </Text>
                      <Icon color={'black.100'} as={ChevronDownIcon} />
                    </MenuButton>
                    <MenuList>
                      <>
                        <MenuItem
                          onClick={() => props.goToEdit(props.id || -1)}
                        >
                          Edit
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                          onClick={() => {
                            props.deleteColumn(props.id || -1);
                          }}
                        >
                          Delete
                        </MenuItem>
                      </>
                    </MenuList>
                  </>
                )}
              </Menu>
            </Flex>

            {
              <Box
                py={3}
                px={1}
                as="button"
                onClick={() =>
                  props._showRightArrow && props.moveRight(props.id)
                }
              >
                <Icon
                  _hover={{ color: 'green.200' }}
                  as={ArrowRightIcon}
                  color={props._showRightArrow ? 'gray.700' : 'gray.200'}
                />
              </Box>
            }
          </Box>

          <Box display={'block'} w={'full'}>
            <Text
              fontSize={'md'}
              color={'gray.400'}
              rounded={'full'}
              px={2}
              py={2}
              w={'full'}
            >
              {props.description}
            </Text>
          </Box>
          {props && props.items && props.items.length > 3 && (
            <Box w={'100%'} px={1} py={1}>
              <Link to={'/new-item/' + props.boardId + '/' + props.id}>
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
                  boardId={props.boardId}
                  columnId={props.columnId}
                  deleteItem={deleteItem}
                  item={itm}
                  key={(itm as ItemRequestI).id}
                  moveDown={moveDown}
                  moveUp={moveUp}
                  canMoveUp={canMoveUp}
                  canMoveDown={canMoveDown}
                  boards={props.boards}
                  moveItem={props.moveItem}
                  users={props.users}
                  updateItem={props.updateItem}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </Stack>

        <Box bg={useColorModeValue('gray.50', 'gray.900')} px={1} py={1}>
          <Link to={'/new-item/' + props.boardId + '/' + props.id}>
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
