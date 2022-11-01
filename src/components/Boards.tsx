import { Box, Button, HStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Board from './Board';
import { Link } from 'react-router-dom';
import Result from '../core/ResultI';
import { ColumnI } from '../core/ColumnResponseI';
import { DeleteResultI } from '../core/DeleteResultI';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = () => {
  const [columns, setColumns] = useState<Array<ColumnI> | undefined>();

  useEffect(() => {
    GenericService.getAll<Result<Array<ColumnI>>>('column').then((columns) => {
      let result = columns.result;
      result.forEach((column, index) => (column.order = index));
      setColumns(result);
    });
  }, []);

  const deleteColumn = (id: number) => {
    GenericService.delete<DeleteResultI>('column', id).then(
      (result: DeleteResultI) => {
        console.log(result);
        if (result.success) {
          setColumns(columns?.filter((column: any) => column.id !== id));
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

  const swapUiAnBe = (idA: number, lorr: number) => {
    if (columns) {
      let columnsFinal = [...columns];
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].id === idA) {
          columnsFinal = swapUI(i, i + lorr, columnsFinal);
          if (
            !(
              i < 0 ||
              i >= columns.length ||
              i + lorr < 0 ||
              i + lorr >= columns.length
            )
          ) {
            GenericService.swap<boolean>(
              'column',
              idA,
              columns[i + lorr].id
            ).then((result) => {
              setColumns(columnsFinal);
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
    columns: Array<ColumnI>
  ) => {
    console.log('swapping', indexOfA, indexOfB, columns);
    if (
      indexOfA < 0 ||
      indexOfA >= columns.length ||
      indexOfB < 0 ||
      indexOfB >= columns.length
    ) {
      return columns;
    }

    columns[indexOfA].order = indexOfB;
    columns[indexOfB].order = indexOfA;
    const temp = columns[indexOfA];
    columns[indexOfA] = columns[indexOfB];
    columns[indexOfB] = temp;

    return columns;
  };

  return (
    <div className="Columns">
      <Boards
        moveLeft={moveLeft}
        moveRight={moveRight}
        deleteColumn={deleteColumn}
        columns={columns}
      />
    </div>
  );
};

interface BoardProps {
  columns?: Array<ColumnI>;
  deleteColumn: (id: number) => void;
  moveLeft: (id: number) => void;
  moveRight: (id: number) => void;
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
            id={item.id || -1}
            key={item.order}
            title={item.name}
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
