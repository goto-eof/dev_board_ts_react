import { Box, Button, HStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Board from './Board';
import { Link } from 'react-router-dom';
import Result from '../core/ItemI';
import { ColumnI } from '../core/ColumnI';
import { DeleteResultI } from '../core/DeleteResultI';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = () => {
  const [columns, setColumns] = useState<Array<ColumnI> | undefined>();

  useEffect(() => {
    GenericService.getAll<Result<Array<ColumnI>>>('column').then((columns) =>
      setColumns(columns.result)
    );
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

  return (
    <div className="Columns">
      <Boards deleteColumn={deleteColumn} columns={columns} />
    </div>
  );
};

interface BoardProps {
  columns?: Array<ColumnI>;
  deleteColumn: (id: number) => void;
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
            deleteColumn={props.deleteColumn}
            id={item.id || -1}
            key={item.id}
            title={item.name}
          />
        ))}
        {!props.columns && <h3>Unable to reach server</h3>}
        {props.columns && (
          <Link to={'/new-board'}>
            <Button bg={'green.400'} color={'white'}>
              + Board
            </Button>
          </Link>
        )}
      </HStack>
    </Box>
  );
}

export default Columns;
