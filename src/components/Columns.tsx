import { Box, Button, Center, Heading, HStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Board from './Column';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Result from '../core/ResultI';
import { DeleteResultI } from '../core/DeleteResultI';
import { ItemRequestI } from '../core/ItemRequestI';
import ColumnI from '../core/Column';
import SwapRequestI from '../core/SwapRequestI';
import ResultI from '../core/ResultI';
import ColumnsWithItemsI from '../core/ColumnsWithItemsI';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = () => {
  const [columns, setColumns] = useState<Array<ColumnI> | undefined>();

  const [dashboardTitle, setDashboardTitle] = useState<string>();
  let navigate = useNavigate();

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
        setDashboardTitle(result.result.board.name);
      }
    });
  };

  const deleteColumn = (id: number) => {
    GenericService.delete<DeleteResultI>('column', id).then(
      (result: DeleteResultI) => {
        if (result.success) {
          console.log(columns);
          let newBoards =
            columns?.filter((column: any) => column.column.id !== id) || [];
          newBoards = recomputeArrows(newBoards);
          setColumns(newBoards);
        }
      }
    );
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
  };

  const goToEdit = (columnId: number) => {
    navigate('/edit-column/' + boardId + '/' + columnId);
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
              }
            });
          }
          break;
        }
      }
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
    <div className="Columns">
      <Center>
        <Heading
          color={'green.400'}
          borderBottomRightRadius="25%"
          borderBottomLeftRadius="25%"
          textShadow={'1px 1px lightgray'}
          p={5}
          boxShadow={'md'}
        >
          {dashboardTitle}
        </Heading>
      </Center>
      <Boards
        moveLeft={moveLeft}
        moveRight={moveRight}
        deleteColumn={deleteColumn}
        setItems={setItems}
        goToEdit={goToEdit}
        columns={columns}
        boardId={boardId}
      />
    </div>
  );
};

interface BoardProps {
  columns?: Array<ColumnI>;
  deleteColumn: (id: number) => void;
  moveLeft: (id: number) => void;
  goToEdit: (boardId: number) => void;
  moveRight: (id: number) => void;
  setItems: (boardId: number, items: Array<ItemRequestI>) => void;
  boardId: string | undefined;
}

function Boards(props: BoardProps) {
  return (
    <Box mx={'auto'} pt={0}>
      <HStack
        spacing={{ base: 5, lg: 2 }}
        alignItems={'start'}
        overflowX="scroll"
        overflowY={'scroll'}
        align="flex-start"
        h={'80vh'}
      >
        {props.columns?.map((item) => (
          <Board
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
          />
        ))}
        {/* {!props.columns && <h3>Unable to reach server</h3>} */}
        {props.columns && (
          <Link to={'/new-column/' + props.boardId}>
            <Button
              bg={'red.400'}
              _hover={{
                bg: 'red.300',
              }}
              transform={'rotate(90deg)'}
              color={'green.100'}
              mt={'36px'}
            >
              + Column
            </Button>
          </Link>
        )}
      </HStack>
    </Box>
  );
}

export default Columns;
