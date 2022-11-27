import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  HStack,
  SimpleGrid,
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
    <SimpleGrid columns={{ base: 1, md: 3, lg: 6 }} p={0} spacing={10} pt={30}>
      {boards.map((item: any) => {
        return (
          <Item
            item={item}
            key={item.id}
            clickHandlerGoToDashboard={goToBoard}
            clickHandlerDeleteDashboard={deleteDashboard}
            clickHandlerGoToUpdate={goToUpdate}
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
}

function Item({
  item,
  clickHandlerGoToDashboard,
  clickHandlerDeleteDashboard,
  clickHandlerGoToUpdate,
}: ItemPropsI) {
  return (
    <Box
      maxW={'400  px'}
      w={'full'}
      boxShadow={'2xl'}
      rounded={'md'}
      p={6}
      overflow={'hidden'}
    >
      <Stack>
        <Stack
          onClick={(e) => {
            clickHandlerGoToDashboard(item.id);
          }}
        >
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          ></Text>
          <Heading fontSize={'2xl'} fontFamily={'body'}>
            {item.name}
          </Heading>
          <Text color={'gray.500'}>{item.description}</Text>
        </Stack>
        <Button
          onClick={() => {
            clickHandlerGoToDashboard(item.id);
          }}
          bg={'green.400'}
          _hover={{
            bg: 'green.300',
          }}
          color={'white'}
          mt={'36px'}
        >
          View
        </Button>
        <Button
          onClick={(e) => {
            clickHandlerDeleteDashboard(item.id);
          }}
          bg={'red.400'}
          _hover={{
            bg: 'red.300',
          }}
          color={'white'}
          mt={'36px'}
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            clickHandlerGoToUpdate(item.id);
          }}
          bg={'blue.400'}
          _hover={{
            bg: 'blue.300',
          }}
          color={'white'}
          mt={'36px'}
        >
          Update
        </Button>
      </Stack>
    </Box>
  );
}
