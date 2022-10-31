import { Box, Button, HStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Board from './Board';
import { Column } from '../core/Column';
import { Link, useNavigate } from 'react-router-dom';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = () => {
  const [columns, setColumns] = useState<Array<Column> | undefined>();

  useEffect(() => {
    GenericService.getAll<Column>('column').then((columns) =>
      setColumns(columns.data)
    );
  }, []);

  const deleteColumn = (id: number) => {
    GenericService.delete('column', id).then((result: any) => {
      console.log(result);
      if (!result.isError) {
        setColumns(columns?.filter((column: any) => column.id !== id));
      }
    });
  };

  return (
    <div className="Columns">
      <Boards deleteColumn={deleteColumn} columns={columns} />
    </div>
  );
};

interface BoardProps {
  columns?: Array<Column>;
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
            id={item.id}
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
