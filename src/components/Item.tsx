import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import {
  Badge,
  Text,
  Icon,
  MenuList,
  Menu,
  MenuItem,
  MenuButton,
  GridItem,
  Grid,
  Box,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ItemRequestI } from '../core/ItemRequestI';

interface ItemProps {
  item: ItemRequestI;
  deleteItem: (id: number) => void;
  moveUp: (id?: number) => void;
  moveDown: (id?: number) => void;
}

export default function Item({
  item,
  deleteItem,
  moveUp,
  moveDown,
}: ItemProps) {
  let navigate = useNavigate();

  const goToEdit = (id: number) => {
    navigate('/edit-item/boardid/' + item.column_id + '/itemid/' + id);
  };

  return (
    <Grid
      templateColumns="repeat(6, 1fr)"
      templateRows="repeat(2, 1fr)"
      gap={0}
      minW={'100%'}
      width={'100%'}
      boxShadow={'lg'}
      bg="white"
      p={4}
      borderRadius="5%"
    >
      <GridItem w="100%" colSpan={5} h="10">
        <Text
          align={'left'}
          height={'38px'}
          overflow={'hidden'}
          fontWeight={600}
          fontSize={'sm'}
        >
          <Icon
            as={ArrowRightIcon}
            fontSize={'10'}
            color={'green.400'}
            mr={2}
          />
          <Badge ml="1" colorScheme="green" mr={2}>
            {item.id}
          </Badge>
          {item.name.length > 35
            ? item.name.substring(0, 35) + '...'
            : item.name}
        </Text>
      </GridItem>
      <GridItem colSpan={1} w="100%" h="10">
        <Menu>
          {() => (
            <>
              <MenuButton
                color={'gray.800'}
                fontWeight={900}
                _hover={{ color: 'green.400' }}
              >
                <Icon as={ChevronDownIcon} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => goToEdit(item.id || -1)}>
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    deleteItem(item.id || -1);
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      </GridItem>
      <GridItem colSpan={6}>
        <Text align={'left'} overflow="hidden" fontSize="sm">
          {item.description.length > 60
            ? item.description.substring(0, 60) + '...'
            : item.description}
        </Text>
      </GridItem>
      <HStack w={'210px'} justifyContent="right">
        <Box onClick={() => moveDown(item.id)}>
          <Icon
            as={ArrowDownIcon}
            color={'gray.800'}
            _hover={{ color: 'green.400' }}
          />
        </Box>
        <Box onClick={() => moveUp(item.id)}>
          <Icon as={ArrowUpIcon} _hover={{ color: 'green.400' }} />
        </Box>
      </HStack>
    </Grid>
  );
}
