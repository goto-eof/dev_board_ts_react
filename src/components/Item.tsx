import { ArrowRightIcon, ChevronDownIcon } from '@chakra-ui/icons';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ItemIR } from '../core/ItemIR';

interface ItemProps {
  item: ItemIR;
  deleteItem: (id: number) => void;
}

export default function Item({ item, deleteItem }: ItemProps) {
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
        <Text align={'left'} fontWeight={600} fontSize={'sm'}>
          <Icon
            as={ArrowRightIcon}
            fontSize={'10'}
            color={'green.400'}
            mr={2}
          />
          <Badge ml="1" colorScheme="green" mr={2}>
            {item.id}
          </Badge>
          {item.name}
        </Text>
      </GridItem>
      <GridItem colSpan={1} w="100%" h="10">
        <Menu>
          {() => (
            <>
              <MenuButton>
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
        <Text align={'left'} fontSize="sm">
          {item.description}
        </Text>
      </GridItem>
    </Grid>
  );
}
