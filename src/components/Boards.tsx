import { Box, Button, HStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Board from './Board';
import { Link } from 'react-router-dom';
import Result from '../core/ResultI';
import { ColumnResponseI } from '../core/ColumnResponseI';
import { DeleteResultI } from '../core/DeleteResultI';
import { ItemRequestI } from '../core/ItemRequestI';
import BoardI from '../core/BoardI';
import SwapRequestI from '../core/SwapRequestI';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = () => {
  const [boards, setBoards] = useState<Array<BoardI> | undefined>();

  useEffect(() => {
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
            console.log('BOARDS', board);
            boards.push(board);
          });
          setBoards(boards);
        });
      }
    );
  }, []);

  const deleteColumn = (id: number) => {
    GenericService.delete<DeleteResultI>('column', id).then(
      (result: DeleteResultI) => {
        console.log(result);
        if (result.success) {
          setBoards(boards?.filter((column: any) => column.board.id !== id));
        }
      }
    );
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
            GenericService.swap<SwapRequestI, boolean>('column', {
              id_a: idA,
              id_b: idB,
            }).then((result) => {
              if (columnsFinal) {
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
              }

              setBoards(columnsFinal);
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
        columns={boards}
      />
    </div>
  );
};

interface BoardProps {
  columns?: Array<BoardI>;
  deleteColumn: (id: number) => void;
  moveLeft: (id: number) => void;
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
              bg={'green.400'}
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
