import { Card, CardBody, CardFooter, CardHeader } from '@chakra-ui/card';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  Badge,
  Text,
  Flex,
  Icon,
  MenuList,
  Menu,
  MenuItem,
  MenuButton,
  Box,
  useDisclosure,
  MenuDivider,
  useStatStyles,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ColumnI from '../core/Column';
import { ItemRequestI } from '../core/ItemRequestI';
import { UserResponseI } from '../core/UserResponseI';
import { ViewItem } from './ViewItem';
interface ItemProps {
  boards?: Array<ColumnI>;
  boardId: string | undefined;
  columnId: number;
  item: ItemRequestI;
  deleteItem: (id: number) => void;
  moveUp: (id?: number) => void;
  moveDown: (id?: number) => void;
  canMoveUp: (id: number) => boolean;
  canMoveDown: (id: number) => boolean;
  moveItem: (
    itemId: number | undefined | null,
    boardIdFrom: number,
    boardIdTo: number
  ) => void;
  users: Array<UserResponseI>;
}

export default function Item({
  boardId,
  columnId,
  item,
  deleteItem,
  moveUp,
  moveDown,
  canMoveUp,
  canMoveDown,
  moveItem,
  boards,
  users,
}: ItemProps) {
  console.log('BOARD IS: ', boardId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [assignee, setAssignee] = useState<UserResponseI>();

  useEffect(() => {
    const assignee = users.filter((user) => user.id === item.assignee_id)[0];
    setAssignee(assignee);
  }, []);

  let navigate = useNavigate();

  const tryMoveItem = (boardIdTo: number) => {
    moveItem(item.id, Number(item.column_id), boardIdTo);
  };

  const goToEdit = (id: number) => {
    navigate(
      '/edit-item/boardId/' +
        boardId +
        '/columnId/' +
        item.column_id +
        '/itemid/' +
        id
    );
  };

  return (
    <>
      <ViewItem isOpen={isOpen} onClose={onClose} item={item} users={users} />
      <Card maxW="md" boxShadow={'md'} mb={2}>
        <CardHeader>
          <Flex>
            <Menu>
              <MenuButton
                width={'100%'}
                px={4}
                py={2}
                transition="all 0.2s"
                borderRadius="md"
                borderWidth="1px"
                _hover={{ bg: 'green.100' }}
                _expanded={{ bg: 'green.100' }}
                _focus={{ boxShadow: 'outline' }}
              >
                <Text
                  align={'left'}
                  overflow={'hidden'}
                  fontWeight={600}
                  fontSize={'sm'}
                >
                  <ChevronDownIcon />
                  <Badge ml="1" colorScheme="green" mr={2}>
                    {item.id}
                  </Badge>
                  {item.name.length > 35
                    ? item.name.substring(0, 35) + '...'
                    : item.name}{' '}
                  {'('}p.{item.priority}
                  {')'}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuItem key={'edit'} onClick={() => goToEdit(item.id || -1)}>
                  Edit
                </MenuItem>
                <MenuDivider />
                {boards &&
                  boards.length > 0 &&
                  boards
                    .filter((board) => board.column.id != columnId)
                    .map((board) => {
                      return board.column.id !== item.column_id ? (
                        <MenuItem
                          key={board.column.id}
                          onClick={() => tryMoveItem(board.column.id)}
                        >
                          Move to {board.column.name}
                        </MenuItem>
                      ) : (
                        <MenuItem key={board.column.id}>
                          Move to {board.column.name}
                        </MenuItem>
                      );
                    })}
                <MenuDivider />
                <MenuItem
                  key={'delete'}
                  onClick={() => {
                    deleteItem(item.id || -1);
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </CardHeader>
        <CardBody cursor="pointer" onClick={onOpen} _hover={{ color: 'gray' }}>
          <Text p={2} align={'left'} overflow="hidden" fontSize="sm">
            {item.description.length > 60
              ? item.description.substring(0, 60) + '...'
              : item.description}
          </Text>
        </CardBody>

        <CardFooter
          justify="space-between"
          flexWrap="wrap"
          p={2}
          sx={{
            '& > button': {
              minW: '136px',
            },
          }}
        >
          {canMoveUp(item.id || -1) && (
            <Box
              onClick={() => moveUp(item.id)}
              display="inline"
              cursor={'pointer'}
            >
              <Icon
                as={ArrowUpIcon}
                color={'blue.400'}
                _hover={{ color: 'green.400' }}
              />
            </Box>
          )}
          {assignee && 'Assignee: ' + assignee?.username}
          {canMoveDown(item.id || -1) && (
            <Box
              onClick={() => moveDown(item.id)}
              display="inline"
              cursor={'pointer'}
            >
              <Icon
                as={ArrowDownIcon}
                color={'blue.400'}
                _hover={{ color: 'green.400' }}
              />
            </Box>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
