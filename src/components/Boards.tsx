import { Box, Button, HStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Board from './Board';
import { Link, useNavigate } from 'react-router-dom';
import Result from '../core/ResultI';
import { ColumnResponseI } from '../core/ColumnResponseI';
import { DeleteResultI } from '../core/DeleteResultI';
import { ItemRequestI } from '../core/ItemRequestI';
import BoardI from '../core/BoardI';
import SwapRequestI from '../core/SwapRequestI';
import ResultI from '../core/ResultI';
import ColumnsWithItemsI from '../core/ColumnsWithItemsI';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = () => {
  const [boards, setBoards] = useState<Array<BoardI> | undefined>();
  let navigate = useNavigate();

  useEffect(() => {
    if (process.env.REACT_APP_ENABLE_MULTIPLE_CALL == 'true') {
      multipleCalls();
    } else {
      oneCall();
    }
  }, []);

  const oneCall = () => {
    GenericService.getAll<Result<ColumnsWithItemsI>>('column/plus-items').then(
      (result: Result<ColumnsWithItemsI>) => {
        if (result.success) {
          let boards = new Array<BoardI>();
          result.result.columns.forEach((boardWrapper, index) => {
            let board: BoardI = {
              board: {
                ...boardWrapper.column,
                _showLeftArrow: index !== 0,
                _showRigthArrow: index !== result.result.columns.length - 1,
              },
              items: boardWrapper.items,
            };
            boards.push(board);
          });
          setBoards(boards);
        }
      }
    );
  };

  const multipleCalls = () => {
    GenericService.getAll<Result<Array<ColumnResponseI>>>('column').then(
      (columns) => {
        let result = columns.result;
        let boards = new Array<BoardI>();
        let calls = new Array<Promise<Result<Array<ItemRequestI>>>>();
        result.forEach((column) => {
          calls.push(
            GenericService.getByParentId<Result<Array<ItemRequestI>>>(
              'item',
              column.id
            )
          );
        });

        Promise.all(calls).then((arr) => {
          result.forEach((column, index) => {
            let board: BoardI = {
              board: {
                ...column,
                _showLeftArrow: index !== 0,
                _showRigthArrow: index !== result.length - 1,
              },
              items: arr[index].result,
            };
            boards.push(board);
          });
          setBoards(boards);
        });
      }
    );
  };

  const deleteColumn = (id: number) => {
    GenericService.delete<DeleteResultI>('column', id).then(
      (result: DeleteResultI) => {
        if (result.success) {
          let newBoards =
            boards?.filter((column: any) => column.board.id !== id) || [];
          newBoards = recomputeArrows(newBoards);
          setBoards(newBoards);
        }
      }
    );
  };

  const recomputeArrows = (newBoards: Array<BoardI>) => {
    if (newBoards.length > 0) {
      newBoards[0].board._showLeftArrow = false;
      newBoards[newBoards.length - 1].board._showRigthArrow = false;
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
    let newBoards = new Array<BoardI>();
    boards?.forEach((board: BoardI) => {
      if (board.board.id === boardId) {
        let newBoard = { ...board, items: items };
        newBoards = boards.map((board) =>
          board.board.id === boardId ? newBoard : board
        );
      }
    });
    setBoards(newBoards);
  };

  const goToEdit = (boardId: number) => {
    navigate('/edit-board/' + boardId);
  };

  const swapUiAnBe = (idA: number, lorr: number) => {
    if (boards) {
      let columnsFinal = [...boards];
      for (let i = 0; i < boards.length; i++) {
        if (boards[i].board?.id === idA) {
          columnsFinal = swapUI(i, i + lorr, columnsFinal);
          if (
            !(
              i < 0 ||
              i >= boards.length ||
              i + lorr < 0 ||
              i + lorr >= boards.length
            )
          ) {
            let idB = boards[i + lorr].board.id;
            GenericService.swap<SwapRequestI, ResultI<boolean>>('column', {
              id_a: idA,
              id_b: idB,
            }).then((result) => {
              if (columnsFinal && result.success) {
                if (columnsFinal.length > 0) {
                  let boardA = columnsFinal.filter(
                    (column) => column.board.id === idA
                  )[0];
                  boardA.board._showLeftArrow =
                    columnsFinal[0].board.id !== idA;
                  boardA.board._showRigthArrow =
                    columnsFinal.length > 1 &&
                    columnsFinal[columnsFinal.length - 1].board.id !== idA;

                  let boardB = columnsFinal.filter(
                    (column) => column.board.id === idB
                  )[0];
                  boardB.board._showLeftArrow =
                    columnsFinal[0].board.id !== idB;
                  boardB.board._showRigthArrow =
                    columnsFinal.length > 1 &&
                    columnsFinal[columnsFinal.length - 1].board.id !== idB;
                }
                setBoards(columnsFinal);
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
    boards: Array<BoardI>
  ) => {
    if (
      indexOfA < 0 ||
      indexOfA >= boards.length ||
      indexOfB < 0 ||
      indexOfB >= boards.length
    ) {
      return boards;
    }
    let orderA = boards[indexOfA].board.order;
    let orderB = boards[indexOfB].board.order;
    boards[indexOfA].board.order = orderB;
    boards[indexOfB].board.order = orderA;
    const temp = boards[indexOfA];
    boards[indexOfA] = boards[indexOfB];
    boards[indexOfB] = temp;

    return boards;
  };

  return (
    <div className="Columns">
      <Boards
        moveLeft={moveLeft}
        moveRight={moveRight}
        deleteColumn={deleteColumn}
        setItems={setItems}
        goToEdit={goToEdit}
        columns={boards}
      />
    </div>
  );
};

interface BoardProps {
  columns?: Array<BoardI>;
  deleteColumn: (id: number) => void;
  moveLeft: (id: number) => void;
  goToEdit: (boardId: number) => void;
  moveRight: (id: number) => void;
  setItems: (boardId: number, items: Array<ItemRequestI>) => void;
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
            id={item.board.id || -1}
            key={item.board.order}
            title={item.board.name}
            _showLeftArrow={item.board._showLeftArrow}
            _showRightArrow={item.board._showRigthArrow}
            items={item.items}
          />
        ))}
        {!props.columns && <h3>Unable to reach server</h3>}
        {props.columns && (
          <Link to={'/new-board'}>
            <Button
              bg={'red.400'}
              _hover={{
                bg: 'red.300',
              }}
              transform={'rotate(90deg)'}
              color={'white'}
              mt={'36px'}
            >
              + Board
            </Button>
          </Link>
        )}
      </HStack>
    </Box>
  );
}

export default Columns;
