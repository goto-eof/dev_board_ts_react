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
  Grid,
  GridItem,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ColumnI from '../core/ColumnI';
import { ItemRequestI } from '../core/ItemI';
import { UserResponseI } from '../core/UserResponseI';
import InsertItemForm from './form/InsertItemForm';
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
  const [creationDate, setCreationDate] = useState<string>();
  useEffect(() => {
    const assignee = users.filter((user) => user.id === item.assignee_id)[0];
    setAssignee(assignee);
    if (item.created_at) {
      const dateString = new Date(item.created_at).toISOString().slice(0, 10);
      setCreationDate(dateString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tryMoveItem = (boardIdTo: number) => {
    moveItem(item.id, Number(item.column_id), boardIdTo);
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
      <Card maxW="md" boxShadow={'md'} h={'175px'} mb={2}>
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
                    .filter((board) => board.column.id !== columnId)
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
                    <MenuItem
                      onClick={(e) => {
                        changePriority(key);
                      }}
                      key={key}
                    >
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
        <CardBody cursor="pointer" _hover={{ color: 'gray' }} onClick={onOpen}>
          <Text p={2} align={'left'} overflow="hidden" fontSize="sm">
            {item.description.length > 60
              ? item.description.substring(0, 60) + '...'
              : item.description}
          </Text>
        </CardBody>

        <CardFooter cursor={'pointer'}>
          <VStack>
            <Box
              onClick={onOpen}
              textAlign={'right'}
              fontSize={'sm'}
              as={'div'}
              w={'100%'}
              h={'22px'}
            >
              <Badge borderRadius={'5%'} bg={'gray.100'}>
                {item.estimated_time}
              </Badge>{' '}
              <Badge borderRadius={'5%'} bg={'gray.100'}>
                {' '}
                {creationDate}
              </Badge>
            </Box>
            <Grid
              h={'22px'}
              templateColumns="repeat(3, 1fr)"
              as={'div'}
              w={'100%'}
              gap={6}
            >
              <GridItem textAlign={'center'}>
                {
                  <Box
                    onClick={(e) => {
                      e.preventDefault();
                      if (canMoveUp(item.id || -1)) moveUp(item.id);
                    }}
                    display="inline"
                    cursor={'pointer'}
                  >
                    <Icon
                      as={ArrowUpIcon}
                      color={canMoveUp(item.id || -1) ? 'blue.400' : 'gray.200'}
                      _hover={{
                        color: canMoveUp(item.id || -1)
                          ? 'green.400'
                          : 'gray.200',
                      }}
                    />
                  </Box>
                }
              </GridItem>
              <GridItem>
                <Badge borderRadius={'5%'} bg={'gray.100'} fontSize={'sm'}>
                  {assignee && assignee?.username}
                </Badge>
              </GridItem>
              <GridItem textAlign={'center'}>
                {
                  <Box
                    onClick={(e) => {
                      e.preventDefault();
                      if (canMoveDown(item.id || -1)) moveDown(item.id);
                    }}
                    display="inline"
                    cursor={'pointer'}
                  >
                    <Icon
                      as={ArrowDownIcon}
                      color={
                        canMoveDown(item.id || -1) ? 'blue.400' : 'gray.200'
                      }
                      _hover={{
                        color: canMoveDown(item.id || -1)
                          ? 'green.400'
                          : 'gray.200',
                      }}
                    />
                  </Box>
                }
              </GridItem>
            </Grid>
          </VStack>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size={'5xl'}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>Edit Issue</ModalHeader>
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

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
