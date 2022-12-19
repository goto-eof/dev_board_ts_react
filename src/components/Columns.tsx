import {
  Box,
  Button,
  FormLabel,
  Grid,
  GridItem,
  Text,
  HStack,
  Icon,
  Input,
  Skeleton,
  VStack,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Popover,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Column from './Column';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Result from '../core/ResultI';
import { DeleteResultI } from '../core/DeleteResultI';
import { ItemRequestI } from '../core/ItemRequestI';
import ColumnI from '../core/Column';
import SwapRequestI from '../core/SwapRequestI';
import ResultI from '../core/ResultI';
import ColumnsWithItemsI from '../core/ColumnsWithItemsI';
import { ItemUpdateRequestI } from '../core/ItemUpdateRequestI';
import { ArrowBackIcon, InfoIcon } from '@chakra-ui/icons';
import SharedWithResponseI from '../core/SharedWithResponseI';
import { UserResponseI } from '../core/UserResponseI';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = (props: ColumnsProps) => {
  const [columns, setColumns] = useState<Array<ColumnI> | []>();
  const [filteredColumns, setFilteredColumns] = useState<Array<ColumnI> | []>();
  const [sharedWith, setSharedWith] = useState<SharedWithResponseI>();
  const [dashboardTitle, setDashboardTitle] = useState<string>();
  let navigate = useNavigate();
  const [filter, setFilter] = useState<string>('');
  const [users, setUsers] = useState<Array<UserResponseI>>();
  const { boardId } = useParams();

  useEffect(() => {
    oneCall();
  }, []);

  const oneCall = () => {
    GenericService.getAll<Result<ColumnsWithItemsI>>(
      boardId ? 'board/get_board_with_all_data/' + boardId : 'column/plus-items'
    ).then((result: Result<ColumnsWithItemsI>) => {
      if (result.success) {
        let boards = new Array<ColumnI>();
        result.result.columns.forEach((boardWrapper, index) => {
          let board: ColumnI = {
            column: {
              ...boardWrapper.column,
              _showLeftArrow: index !== 0,
              _showRigthArrow: index !== result.result.columns.length - 1,
            },
            items: boardWrapper.items,
          };
          boards.push(board);
        });
        setColumns(boards);
        setFilteredColumns([...boards]);
        setDashboardTitle(result.result.board.name);
        updateSharedWith();
      }
    });
  };

  useEffect(() => {
    retrieveUsers();
  }, []);

  const updateSharedWith = () => {
    GenericService.get<Result<SharedWithResponseI>>(
      'board/shared_with/' + boardId
    ).then((data: Result<SharedWithResponseI>) => {
      setSharedWith(data.result);
    });
  };

  const retrieveUsers = () => {
    GenericService.get<Result<Array<UserResponseI>>>(
      'board/board_users/' + boardId
    ).then((result: Result<Array<UserResponseI>>) => {
      setUsers(result.result);
    });
  };

  const deleteColumn = (id: number) => {
    GenericService.delete<DeleteResultI>('column', id).then(
      (result: DeleteResultI) => {
        if (result.success) {
          let newBoards =
            columns?.filter((column: any) => column.column.id !== id) || [];
          newBoards = recomputeArrows(newBoards);
          setColumns(newBoards);
          handleInputChangeFilter(null, newBoards);
        }
      }
    );
  };

  const moveItem = (
    itemId: number | undefined | null,
    boardIdFrom: number,
    boardIdTo: number
  ) => {
    if (!itemId) {
      return;
    }
    columns?.forEach((column) => {
      if (column.column.id === boardIdFrom) {
        let item = column.items.filter((item) => item.id === itemId)[0];
        GenericService.update<ItemUpdateRequestI, ItemRequestI>(
          'item',
          itemId,
          {
            ...item,
            column_id: boardIdTo,
          }
        ).then((response: Result<ItemRequestI>) => {
          if (response.success) {
            moveItemUI(boardIdFrom, boardIdTo, response.result.id);
          }
        });
      }
    });
  };

  const moveItemUI = (
    boardIdFrom: number,
    boardIdTo: number,
    itemId?: number
  ): void => {
    if (!itemId) {
      return;
    }
    let newColumns = [...(columns || [])];
    // searching item
    let item: ItemRequestI | null = null;
    newColumns?.forEach((column) => {
      if (column.column.id === boardIdFrom) {
        let items = column.items;
        item = items.filter((item) => item.id === itemId)[0];
      }
    });
    // adding item
    newColumns?.forEach((column) => {
      if (column.column.id === boardIdTo && item) {
        let newItems = [...column.items];
        item.column_id = boardIdTo;
        newItems.push(item);
        column.items = newItems;
      }
    });
    // removing item
    newColumns?.forEach((column) => {
      if (column.column.id === boardIdFrom) {
        let items = column.items;
        items = items.filter((item) => item.id !== itemId);
        column.items = items;
      }
    });

    setColumns(newColumns);
    handleInputChangeFilter(null, newColumns);
  };

  const recomputeArrows = (newBoards: Array<ColumnI>) => {
    if (newBoards.length > 0) {
      newBoards[0].column._showLeftArrow = false;
      newBoards[newBoards.length - 1].column._showRigthArrow = false;
    }
    return newBoards;
  };

  const moveLeft = (id: number) => {
    swapUiAnBe(id, -1);
  };
  const moveRight = (id: number) => {
    swapUiAnBe(id, 1);
  };

  const setItems = (boardId: number, items: Array<ItemRequestI>) => {
    let newBoards = new Array<ColumnI>();
    columns?.forEach((board: ColumnI) => {
      if (board.column.id === boardId) {
        let newBoard = { ...board, items: items };
        newBoards = columns.map((board) =>
          board.column.id === boardId ? newBoard : board
        );
      }
    });
    setColumns(newBoards);
    handleInputChangeFilter(null, newBoards);
  };

  const handleInputChangeFilter = (
    filterIn?: string | null,
    newColumns?: Array<ColumnI>
  ) => {
    if (
      ((filterIn != filter && filterIn !== undefined) ||
        (filterIn && filterIn.length > 0)) &&
      (newColumns || columns)
    ) {
      let filteredColumns: Array<ColumnI> = [];
      (newColumns || columns || []).forEach((column) => {
        filteredColumns.push({
          column: { ...column.column },
          items: [...column.items].filter(
            (item) =>
              item.name.indexOf(filterIn || '') > -1 ||
              item.description.indexOf(filterIn || '') > -1
          ),
        });
      });

      setFilteredColumns(filteredColumns);
    } else {
      let filteredColumns: Array<ColumnI> = [];
      columns?.forEach((column) => {
        filteredColumns.push({
          column: { ...column.column },
          items: [...column.items],
        });
      });
      console.log(filteredColumns, columns);
      setFilteredColumns(filteredColumns);
    }
    if (filterIn != filter) {
      setFilter(filterIn || '');
    }
  };

  const searchBox = () => {
    return (
      <>
        <Input
          placeholder="filter"
          value={filter}
          onChange={(e) => handleInputChangeFilter(e.target.value)}
        />
      </>
    );
  };

  const goToEdit = (columnId: number) => {
    navigate('/edit-column/' + boardId + '/' + columnId);
  };

  const goBack = () => {
    navigate('/');
  };

  const swapUiAnBe = (idA: number, lorr: number) => {
    if (columns) {
      let columnsFinal = [...columns];
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].column?.id === idA) {
          columnsFinal = swapUI(i, i + lorr, columnsFinal);
          if (
            !(
              i < 0 ||
              i >= columns.length ||
              i + lorr < 0 ||
              i + lorr >= columns.length
            )
          ) {
            let idB = columns[i + lorr].column.id;
            GenericService.swap<SwapRequestI, ResultI<boolean>>('column', {
              id_a: idA,
              id_b: idB,
            }).then((result) => {
              if (columnsFinal && result.success) {
                if (columnsFinal.length > 0) {
                  let boardA = columnsFinal.filter(
                    (column) => column.column.id === idA
                  )[0];
                  boardA.column._showLeftArrow =
                    columnsFinal[0].column.id !== idA;
                  boardA.column._showRigthArrow =
                    columnsFinal.length > 1 &&
                    columnsFinal[columnsFinal.length - 1].column.id !== idA;

                  let boardB = columnsFinal.filter(
                    (column) => column.column.id === idB
                  )[0];
                  boardB.column._showLeftArrow =
                    columnsFinal[0].column.id !== idB;
                  boardB.column._showRigthArrow =
                    columnsFinal.length > 1 &&
                    columnsFinal[columnsFinal.length - 1].column.id !== idB;
                }
                setColumns(columnsFinal);
                handleInputChangeFilter(null, columnsFinal);
              }
            });
          }
          break;
        }
      }
    }
  };

  const updateItem = (item: ItemRequestI) => {
    if (item.id) {
      GenericService.update<ItemUpdateRequestI, ItemRequestI>(
        'item',
        item.id,
        item
      ).then((result: any) => {
        if (result.success) {
          let newBoards;
          columns?.forEach((board: ColumnI) => {
            if (board.column.id === item.column_id) {
              let newBoard = { ...board, items: [...board.items] };
              newBoards = columns.map((board) =>
                board.column.id === item.column_id ? newBoard : board
              );
            }
          });
          setColumns(newBoards);
        }
      });
    }
  };

  const swapUI = (
    indexOfA: number,
    indexOfB: number,
    boards: Array<ColumnI>
  ) => {
    if (
      indexOfA < 0 ||
      indexOfA >= boards.length ||
      indexOfB < 0 ||
      indexOfB >= boards.length
    ) {
      return boards;
    }
    let orderA = boards[indexOfA].column.order;
    let orderB = boards[indexOfB].column.order;
    boards[indexOfA].column.order = orderB;
    boards[indexOfB].column.order = orderA;
    const temp = boards[indexOfA];
    boards[indexOfA] = boards[indexOfB];
    boards[indexOfB] = temp;

    return boards;
  };

  return (
    <Box className="Columns">
      <Grid
        as={Box}
        templateColumns="repeat(5, 1fr)"
        gap={4}
        boxShadow={'md'}
        height={'44px'}
      >
        <GridItem colSpan={1} colStart={3} colEnd={4} h="10" pb={6}>
          <Text
            as={'span'}
            fontWeight={'bold'}
            fontSize={'2xl'}
            color={'green.400'}
          >
            <Icon
              onClick={() => goBack()}
              fontSize={'2xl'}
              as={ArrowBackIcon}
              color={'gray.400'}
              _hover={{ color: 'green.200' }}
            />
            {dashboardTitle}{' '}
            <Popover>
              <PopoverTrigger>
                <Button>
                  {' '}
                  <Icon
                    // onClick={() => goBack()}
                    fontSize={'2xl'}
                    as={InfoIcon}
                    color={'gray.400'}
                    _hover={{ color: 'green.200' }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                  <Text
                    as={'span'}
                    color={'gray'}
                    fontWeight={'normal'}
                    fontSize={'md'}
                  >
                    Board information
                  </Text>
                </PopoverHeader>
                <PopoverBody>
                  {' '}
                  <Text
                    as={'span'}
                    color={'gray'}
                    fontWeight={'normal'}
                    fontSize={'md'}
                  >
                    Owners:{' '}
                    {sharedWith &&
                      sharedWith.users &&
                      sharedWith.users.map((user) => {
                        return (
                          <Text as={'span'} key={user.username}>
                            [{user.username}]{' '}
                          </Text>
                        );
                      })}
                  </Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Text>
        </GridItem>
        <GridItem colSpan={1} h="10"></GridItem>

        <GridItem colStart={5} colEnd={6} h="10">
          {searchBox()}
        </GridItem>
      </Grid>
      <Box position={'relative'} mt={8}>
        <Boards
          moveLeft={moveLeft}
          moveRight={moveRight}
          deleteColumn={deleteColumn}
          setItems={setItems}
          goToEdit={goToEdit}
          columns={columns}
          filteredColumns={filteredColumns}
          boardId={boardId}
          moveItem={moveItem}
          users={users || []}
          updateItem={(item) => updateItem(item)}
        />
      </Box>
    </Box>
  );
};

interface BoardProps {
  columns?: Array<ColumnI>;
  filteredColumns?: Array<ColumnI>;
  deleteColumn: (id: number) => void;
  moveLeft: (id: number) => void;
  goToEdit: (boardId: number) => void;
  moveRight: (id: number) => void;
  setItems: (boardId: number, items: Array<ItemRequestI>) => void;
  boardId: string | undefined;
  updateItem: (item: ItemRequestI) => void;
  moveItem: (
    itemId: number | undefined | null,
    boardIdFrom: number,
    boardIdTo: number
  ) => void;
  users: Array<UserResponseI>;
}

function Boards(props: BoardProps) {
  return (
    <Box mx={'auto'} pt={0} mt={0}>
      <Skeleton
        spacing={{ base: 5, lg: 2 }}
        as={HStack}
        alignItems={'start'}
        overflowX="scroll"
        overflowY={'scroll'}
        align="flex-start"
        h={'83vh'}
        w="full"
        isLoaded={!!props.columns}
        fadeDuration={1}
      >
        {props.filteredColumns?.map((item) => (
          <Column
            moveLeft={props.moveLeft}
            moveRight={props.moveRight}
            deleteColumn={props.deleteColumn}
            updateBoardItems={props.setItems}
            goToEdit={props.goToEdit}
            setItems={props.setItems}
            id={item.column.id || -1}
            key={item.column.order}
            title={item.column.name}
            description={item.column.description}
            _showLeftArrow={item.column._showLeftArrow}
            _showRightArrow={item.column._showRigthArrow}
            items={item.items}
            boardId={props.boardId}
            columnId={item.column.id}
            boards={props.columns}
            moveItem={props.moveItem}
            users={props.users}
            updateItem={props.updateItem}
          />
        ))}
        {props.columns && (
          <Link to={'/new-column/' + props.boardId}>
            <Button
              bg={'red.400'}
              _hover={{
                bg: 'red.300',
              }}
              transform={'rotate(90deg)'}
              color={'white'}
              mt={'36px'}
            >
              + Column
            </Button>
          </Link>
        )}
      </Skeleton>
    </Box>
  );
}

export default Columns;
