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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ItemRequestI } from '../core/ItemRequestI';
import { ViewItem } from './ViewItem';

interface ItemProps {
  boardId: string | undefined;
  item: ItemRequestI;
  deleteItem: (id: number) => void;
  moveUp: (id?: number) => void;
  moveDown: (id?: number) => void;
  canMoveUp: (id: number) => boolean;
  canMoveDown: (id: number) => boolean;
}

export default function Item({
  boardId,
  item,
  deleteItem,
  moveUp,
  moveDown,
  canMoveUp,
  canMoveDown,
}: ItemProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let navigate = useNavigate();

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
      <ViewItem isOpen={isOpen} onClose={onClose} item={item} />
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
                _hover={{ bg: 'green.400' }}
                _expanded={{ bg: 'green.400' }}
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
                    : item.name}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => goToEdit(item.id || -1)}>
                  Edit
                </MenuItem>
                <MenuDivider />
                <MenuItem
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
        <CardBody cursor="pointer" onClick={onOpen}>
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
