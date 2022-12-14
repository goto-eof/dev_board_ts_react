import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
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
  Heading,
  Center,
  Skeleton,
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
    <>
      <Center>
        <Heading
          color={'green.400'}
          borderBottomRightRadius="25%"
          borderBottomLeftRadius="25%"
          textShadow={'1px 1px lightgray'}
          p={5}
          boxShadow={'md'}
        >
          Projects
        </Heading>
      </Center>
      <Skeleton
        as={SimpleGrid}
        columns={{ base: 1, md: 3, lg: 5 }}
        p={0}
        spacing={2}
        pt={30}
        isLoaded={!!boards}
        fadeDuration={3}
      >
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
        {boards.length >= 0 && (
          <Link to={'/new-dashboard'}>
            <Button
              bg={'red.400'}
              _hover={{
                bg: 'red.300',
              }}
              transform={'rotate(90deg)'}
              color={'white'}
              mt={'56px'}
            >
              + Dashboard
            </Button>
          </Link>
        )}
      </Skeleton>
    </>
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
      cursor={'pointer'}
      w={'full'}
      boxShadow={'md'}
      rounded={'md'}
      p={2}
      overflow={'hidden'}
    >
      <HStack>
        <Flex
          width={'full'}
          bg={'black.50'}
          _hover={{ bg: 'green.100' }}
          borderRadius="5px"
          boxShadow={'base'}
          py={1}
          px={3}
        >
          <Menu>
            {() => (
              <>
                <MenuButton alignContent={'center'} w={'full'}>
                  {' '}
                  <Text
                    textAlign={'center'}
                    fontSize={'xl'}
                    fontWeight={500}
                    color={'black.700'}
                    rounded={'full'}
                    px={2}
                    w={'full'}
                  >
                    <Icon as={EditIcon} mr={2} />
                    {item.name}
                  </Text>
                  <Icon color={'black.700'} as={ChevronDownIcon} />
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
        _hover={{ color: 'gray' }}
        color={'black.900'}
        onClick={() => {
          clickHandlerGoToDashboard(item.id);
        }}
      >
        <Box borderRadius={'10%'} p={4} minHeight={'200px'}>
          <Text align={'left'}>{item.description}</Text>
        </Box>
        <Button
          bg={'green.400'}
          color={'white'}
          w={'100%'}
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
