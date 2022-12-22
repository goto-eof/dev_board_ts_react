import {
  Box,
  Button,
  Grid,
  GridItem,
  Text,
  HStack,
  Icon,
  Input,
  Skeleton,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Popover,
  Select,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Column from './Column';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Result from '../core/ResultI';
import { DeleteResultI } from '../core/DeleteResultI';
import { ItemRequestI } from '../core/ItemI';
import ColumnI from '../core/Column';
import SwapRequestI from '../core/SwapRequestI';
import ResultI from '../core/ResultI';
import ColumnsWithItemsI from '../core/ColumnsWithItemsI';
import { ItemUpdateRequestI } from '../core/ItemUpdateRequestI';
import { ArrowBackIcon, InfoIcon } from '@chakra-ui/icons';
import SharedWithResponseI from '../core/SharedWithResponseI';
import { UserResponseI } from '../core/UserResponseI';
import { NodeWithTypeArguments } from 'typescript';
import { insertHistoryMessage } from '../core/MessageService';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = (props: ColumnsProps) => {
  const [columnsState, setColumnsState] = useState({
    columns: new Array<ColumnI>(),
    filteredColumns: new Array<ColumnI>(),
  });

  const [sortBy, setSortBy] = useState<number>(1);
  const [ascendingOrder, setAscendingOrder] = useState<number>(1);
  const [sharedWith, setSharedWith] = useState<SharedWithResponseI>();
  const [dashboardTitle, setDashboardTitle] = useState<string>();
  let navigate = useNavigate();
  const [filter, setFilter] = useState<string>('');
  const [users, setUsers] = useState<Array<UserResponseI>>();
  const { boardId } = useParams();
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

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

        updateColumnsUi(boards);

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
            columnsState.columns?.filter(
              (column: any) => column.column.id !== id
            ) || [];
          newBoards = recomputeArrows(newBoards);
          // newHandleInputChangeFilter(newBoards);
          updateColumnsUi(newBoards);
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
    columnsState.columns?.forEach((column) => {
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
    let newColumns = [...(columnsState.columns || [])];
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

    setColumnsState({
      ...columnsState,
      columns: newColumns,
      filteredColumns: newHandleInputChangeFilter(newColumns),
    });
  };

  const recomputeArrows = (newBoards: Array<ColumnI>) => {
    if (newBoards.length > 0) {
      newBoards[0].column._showLeftArrow = false;
      newBoards[newBoards.length - 1].column._showRigthArrow = false;
    }
    return newBoards;
  };

  const moveLeft = (id: number) => {
    swapColumnUiAnBe(id, -1);
  };
  const moveRight = (id: number) => {
    swapColumnUiAnBe(id, 1);
  };

  const setItems = (boardId: number, items: Array<ItemRequestI>) => {
    let newBoards = new Array<ColumnI>();
    columnsState.columns?.forEach((board: ColumnI) => {
      if (board.column.id === boardId) {
        let newBoard = { ...board, items: items };
        newBoards = columnsState.columns.map((board) =>
          board.column.id === boardId ? newBoard : board
        );
      }
    });

    // newHandleInputChangeFilter(newBoards);
    updateColumnsUi(newBoards);
  };

  const handleInputChangeFilter = (filterNewValue: string) => {
    setFilter(filterNewValue);
  };

  const handleInputChangeFilterOld = (
    filterIn?: string | null,
    newColumns?: Array<ColumnI>
  ) => {
    if (
      ((filterIn != filter && filterIn !== undefined) ||
        (filterIn && filterIn.length > 0)) &&
      (newColumns || columnsState.columns)
    ) {
      let filteredColumns: Array<ColumnI> = [];
      (newColumns || columnsState.columns || []).forEach((column) => {
        filteredColumns.push({
          column: { ...column.column },
          items: [...column.items].filter(
            (item) =>
              item.name.indexOf(filterIn || '') > -1 ||
              item.description.indexOf(filterIn || '') > -1
          ),
        });
      });

      // setFilteredColumns(filteredColumns);
      setColumnsState({
        ...columnsState,
        filteredColumns: [...filteredColumns],
      });
    } else {
      let filteredColumns: Array<ColumnI> = [];
      columnsState.columns?.forEach((column) => {
        filteredColumns.push({
          column: { ...column.column },
          items: [...column.items],
        });
      });
      console.log(filteredColumns, columnsState.columns);
      setColumnsState({
        ...columnsState,
        filteredColumns: [...filteredColumns],
      });
    }
    if (filterIn != filter) {
      setFilter(filterIn || '');
    }
  };

  const newHandleInputChangeFilter = (
    newColumns?: Array<ColumnI>,
    filterIn?: string
  ) => {
    const processedFilter =
      (filterIn && filterIn.length) ||
      (filterIn === undefined && filter && filter.length);
    if (processedFilter) {
      console.log('processed filter', processedFilter);
      let filteredColumns: Array<ColumnI> = [];
      (newColumns || columnsState.columns || []).forEach((column) => {
        filteredColumns.push({
          column: { ...column.column },
          items: [...column.items].filter(
            (item) =>
              item.name.indexOf(filterIn || filter || '') > -1 ||
              item.description.indexOf(filterIn || filter || '') > -1
          ),
        });
      });
      return filteredColumns;
    } else {
      let filteredColumns: Array<ColumnI> = [];
      (newColumns || columnsState.columns).forEach((column) => {
        filteredColumns.push({
          column: { ...column.column },
          items: [...column.items],
        });
      });
      console.log(filteredColumns, columnsState.columns);
      return filteredColumns;
    }
  };

  const searchBox = () => {
    return (
      <>
        <Input
          placeholder="filter"
          value={filter}
          onChange={(e: any) => {
            setFilter(e.target.value);
            updateColumnsUi(columnsState.columns, e.target.value);
          }}
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

  const swapColumnUiAnBe = (idA: number, lorr: number) => {
    if (columnsState.columns) {
      let columnsFinal = [...columnsState.columns];
      for (let i = 0; i < columnsState.columns.length; i++) {
        if (columnsState.columns[i].column?.id === idA) {
          columnsFinal = swapUI(i, i + lorr, columnsFinal);
          if (
            !(
              i < 0 ||
              i >= columnsState.columns.length ||
              i + lorr < 0 ||
              i + lorr >= columnsState.columns.length
            )
          ) {
            let idB = columnsState.columns[i + lorr].column.id;
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

                // newHandleInputChangeFilter(columnsFinal);
                updateColumnsUi(columnsFinal);
              }
            });
          }
          break;
        }
      }
    }
  };

  const updateItem = (oldItem: ItemRequestI) => {
    if (oldItem.id) {
      GenericService.update<ItemUpdateRequestI, ItemRequestI>(
        'item',
        oldItem.id,
        oldItem
      ).then((result: any) => {
        if (result.success) {
          let newItem: ItemRequestI = result.result;
          console.log('[saved]', newItem);

          if (result.result.id) {
            insertHistoryMessage(result.result.id, 'issue updated');
          }
          let oldColumnId: number = -1;
          let newColumns: Array<ColumnI> = new Array<ColumnI>();
          columnsState.columns.forEach((column: ColumnI) => {
            let items = new Array<ItemRequestI>();
            for (let i = 0; i < column.items.length; i++) {
              let oldItemArr = column.items[i];
              if (oldItemArr.id === newItem.id) {
                items.push(newItem);
                oldColumnId = oldItemArr.column_id;
                console.log('[replaced]', items[i]);
              } else {
                items.push(oldItemArr);
              }
            }
            newColumns.push({
              ...column,
              column: { ...column.column },
              items: [...items],
            });
          });
          if (oldColumnId !== newItem.column_id) {
            moveItemUI(oldColumnId, newItem.column_id, newItem.id);
          } else {
            updateColumnsUi(newColumns);
          } // setForceUpdate(!forceUpdate);
          console.log('[After state set]', columnsState.columns);
        }
      });
    }
  };

  const updateColumnsUi = (newColumns: Array<ColumnI>, filter?: string) => {
    let filteredColumns = newHandleInputChangeFilter(newColumns, filter);
    console.log(filteredColumns);
    setColumnsState({
      ...columnsState,
      filteredColumns: filteredColumns,
      columns: newColumns,
    });
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

  const changeSortOrder = (e: any) => {
    const sortOrder = e.target.value;
    console.log(sortOrder);
    setAscendingOrder(sortOrder);
    sortByValueAndUpdateUi(sortBy, sortOrder);
  };

  const sortByValue = (e: any) => {
    const sortByValueIn = Number(e.target.value);
    setSortBy(sortByValueIn);
    console.log(sortByValueIn);
    sortByValueAndUpdateUi(sortByValueIn);
  };

  const sortByValueAndUpdateUi = (
    sortByValueIn: number,
    sortOrderIn?: number
  ) => {
    const sortOrder = sortOrderIn || ascendingOrder;
    const newFilteredColumns: Array<ColumnI> = [];
    columnsState.filteredColumns.forEach((column: ColumnI) => {
      const newItems = itemsSorter(column.items, sortByValueIn, sortOrder);

      const newColumn: ColumnI = {
        column: { ...column.column },
        items: newItems,
      };

      newFilteredColumns.push(newColumn);
    });

    setColumnsState({ ...columnsState, filteredColumns: newFilteredColumns });
  };

  const itemsSorter = (
    arr: Array<ItemRequestI>,
    sortType: number,
    sortOrder: number
  ) => {
    console.log(sortOrder);
    // manual
    if (sortType === 1) {
      return [...arr].sort((a: ItemRequestI, b: ItemRequestI) =>
        a.order < b.order
          ? -1 * sortOrder
          : a.order > b.order
          ? 1 * sortOrder
          : 0
      );
    }
    // priorty
    else if (sortType === 2) {
      return [...arr].sort((a: ItemRequestI, b: ItemRequestI) =>
        a.priority < b.priority
          ? -1 * sortOrder
          : a.priority > b.priority
          ? 1 * sortOrder
          : 0
      );
    }
    // date
    else if (sortType === 3) {
      return [...arr].sort((a: ItemRequestI, b: ItemRequestI) => {
        if (a.created_at && b.created_at) {
          return a.created_at < b.created_at
            ? -1 * sortOrder
            : a.created_at > b.created_at
            ? 1 * sortOrder
            : 0;
        }
        return 0;
      });
    }
    // alphabetical
    else if (sortType === 4) {
      return [...arr].sort((a: ItemRequestI, b: ItemRequestI) =>
        a.name < b.name ? -1 * sortOrder : a.name > b.name ? 1 * sortOrder : 0
      );
    }
    // by id
    else if (sortType === 5) {
      const result = [...arr].sort((a: ItemRequestI, b: ItemRequestI) => {
        if (a.id && b.id) {
          return a.id < b.id ? -1 * sortOrder : a.id > b.id ? 1 * sortOrder : 0;
        }
        return 0;
      });
      return result;
    }

    return arr;
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
        <GridItem colStart={1} colEnd={2}>
          <Select
            onChange={sortByValue}
            value={sortBy}
            name="sortBy"
            placeholder="Sort by"
          >
            <option value="1">Manual</option>
            <option value="2">Priority</option>
            <option value="3">Date</option>
            <option value="4">Alphabetical</option>
            <option value="5">ID</option>
          </Select>
        </GridItem>
        <GridItem colStart={2} colEnd={3}>
          <Select
            onChange={changeSortOrder}
            value={ascendingOrder}
            name="ascendingOrder"
            placeholder="Order type"
          >
            <option value="1">Ascending</option>
            <option value="-1">Descending</option>
          </Select>
        </GridItem>
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
          columns={columnsState.columns}
          filteredColumns={columnsState.filteredColumns}
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
        isLoaded={!!props && !!props.columns}
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
function componentDidUpdate(
  prevProps: any,
  any: any,
  prevState: any,
  any1: any
) {
  throw new Error('Function not implemented.');
}
