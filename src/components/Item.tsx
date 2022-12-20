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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ColumnI from '../core/Column';
import { ItemRequestI } from '../core/ItemRequestI';
import { UserResponseI } from '../core/UserResponseI';
import InsertItemForm from './InsertItemForm';
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
  updateItem: (item: ItemRequestI) => void;
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
  updateItem,
  boards,
  users,
}: ItemProps) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
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

  const changePriority = (priority: string) => {
    let p = Number(priority);
    if (item.id) {
      item.priority = p;

      updateItem(item);
    }
  };

  const issueType = (issueType: number | undefined) => {
    switch (issueType) {
      case 1:
        return 'T';
      case 2:
        return 'B';
      case 3:
        return 'F';
      case 4:
        return 'I';
      case 5:
        return 'E';
      default:
        return 'U';
    }
  };

  const calculateIssueTypeColor = (issueType: number | undefined) => {
    switch (issueType) {
      case 1:
        return 'gray';
      case 2:
        return 'red';
      case 3:
        return 'blue';
      case 4:
        return 'purple';
      case 5:
        return 'pink';
      default:
        return 'white';
    }
  };

  const calculatePriorityColor = (priority: number | undefined) => {
    switch (priority) {
      case 1:
        return 'red';
      case 2:
        return 'purple';
      case 3:
        return 'green';
      case 4:
        return 'yellow';
      case 5:
        return 'gray';
      default:
        return 'white';
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateItemForm = (item: ItemRequestI) => {
    updateItem(item);
  };

  return (
    <>
      {/* <ViewItem isOpen={isOpen} onClose={onClose} item={item} users={users} /> */}
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
                  <Badge ml="1" colorScheme="green" mr={0}>
                    {item.id}
                  </Badge>
                  <Badge
                    ml="1"
                    colorScheme={calculateIssueTypeColor(item.issue_type)}
                    mr={0}
                  >
                    {issueType(item.issue_type)}
                  </Badge>{' '}
                  <Badge
                    ml="1"
                    colorScheme={calculatePriorityColor(item.priority)}
                    mr={2}
                  >
                    p{item.priority}
                  </Badge>
                  {item.name.length > 35
                    ? item.name.substring(0, 35) + '...'
                    : item.name}{' '}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuItem key={'edit-new'} onClick={onOpen}>
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
                {[
                  ...new Map([
                    ['1', 'Highest'],
                    ['2', 'Hight'],
                    ['3', 'Medium'],
                    ['4', 'Low'],
                    ['5', 'Lowest'],
                  ]).entries(),
                ].map(([key, value]) => {
                  return (
                    <MenuItem onClick={() => changePriority(key)} key={key}>
                      {value}
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

      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InsertItemForm
              boardIdPr={Number(boardId)}
              columnIdPr={'' + columnId}
              itemIdPr={item.id}
              updateItem={updateItemForm}
              onClose={onClose}
            />
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
