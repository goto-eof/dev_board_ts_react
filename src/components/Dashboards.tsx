import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  HStack,
  SimpleGrid,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  Center,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BoardResponseI } from '../core/BoardResponseI';
import Result from '../core/ResultI';
import GenericService from '../service/GenerciService';

export default function Dashboard() {
  const [boards, setBoards] = useState<Array<BoardResponseI>>([]);
  let navigate = useNavigate();

  const loadBoards = () => {
    GenericService.getAll<Result<Array<BoardResponseI>>>('board/all').then(
      (result: Result<Array<BoardResponseI>>) => {
        if (result.success) {
          console.log(result);
          setBoards(result.result);
        }
      }
    );
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const goToBoard = (dashboardId: number) => {
    navigate('/board/' + dashboardId);
  };

  const goToShare = (dashboardId: number) => {
    navigate('/board/share/' + dashboardId);
  };
  const goToUpdate = (dashboardId: number) => {
    navigate('/edit-dashboard/' + dashboardId);
  };

  const deleteDashboard = (dashboardId: number) => {
    GenericService.delete<Result<boolean>>('board', dashboardId).then(
      (result: Result<boolean>) => {
        if (result.success) {
          let newDashboards =
            boards?.filter((board: any) => board.id !== dashboardId) || [];
          setBoards(newDashboards);
        }
      }
    );
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} p={0} spacing={10} pt={30}>
      {boards.map((item: any) => {
        return (
          <Item
            item={item}
            key={item.id}
            clickHandlerGoToDashboard={goToBoard}
            clickHandlerDeleteDashboard={deleteDashboard}
            clickHandlerGoToUpdate={goToUpdate}
            clickHandlerGoToShare={goToShare}
          />
        );
      })}
      <Link to={'/new-dashboard'}>
        <Button
          bg={'red.400'}
          _hover={{
            bg: 'red.300',
          }}
          transform={'rotate(90deg)'}
          color={'white'}
          mt={'36px'}
        >
          + Dashboard
        </Button>
      </Link>
    </SimpleGrid>
  );
}

interface ItemPropsI {
  item: BoardResponseI;
  clickHandlerGoToDashboard: (dashboardId: number) => void;
  clickHandlerDeleteDashboard: (dashboardId: number) => void;
  clickHandlerGoToUpdate: (dashboardId: number) => void;
  clickHandlerGoToShare: (dashboardId: number) => void;
}

function Item({
  item,
  clickHandlerGoToDashboard,
  clickHandlerDeleteDashboard,
  clickHandlerGoToUpdate,
  clickHandlerGoToShare,
}: ItemPropsI) {
  return (
    <Box
      maxW={'400px'}
      w={'full'}
      boxShadow={'2xl'}
      rounded={'md'}
      p={6}
      overflow={'hidden'}
    >
      <HStack>
        <Flex
          width={'full'}
          bg={'white.100'}
          border={'1px solid lightgray'}
          _hover={{ bg: 'green.100' }}
          py={1}
          px={3}
        >
          <Box
            width={'full'}
            display={'block'}
            onClick={() => {
              clickHandlerGoToDashboard(item.id);
            }}
          >
            <Text
              textAlign={'center'}
              fontSize={'xl'}
              fontWeight={500}
              color={'gray.700'}
              rounded={'full'}
              px={2}
              w={'full'}
            >
              <Icon as={EditIcon} mr={2} />
              {item.name}
            </Text>
          </Box>

          <Menu>
            {() => (
              <>
                <MenuButton>
                  <Icon color={'gray.700'} as={ChevronDownIcon} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => clickHandlerGoToUpdate(item.id)}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => clickHandlerGoToShare(item.id)}>
                    Share
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      clickHandlerDeleteDashboard(item.id);
                    }}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
      </HStack>
      <VStack
        onClick={() => {
          clickHandlerGoToDashboard(item.id);
        }}
      >
        <Text align={'center'}>{item.description}</Text>
        <Button
          bg={'green.400'}
          color={'white'}
          _hover={{ bg: 'green.300' }}
          onClick={() => {
            clickHandlerGoToDashboard(item.id);
          }}
        >
          View
        </Button>
      </VStack>
    </Box>
  );
}
