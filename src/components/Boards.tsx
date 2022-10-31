import { Box, HStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import GenericService from '../service/GenerciService';
import Board from './Board';
import { Column } from '../core/Column';

interface ColumnsProps {}

export const Columns: FC<ColumnsProps> = () => {
  const [columns, setColumns] = useState<Array<Column> | undefined>();

  useEffect(() => {
    GenericService.getAll<Column>('column').then((columns) =>
      setColumns(columns.data)
    );
  }, []);
  return (
    <div className="Columns">
      <Boards columns={columns} />
    </div>
  );
};

interface BoardProps {
  columns?: Array<Column>;
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
          <Board id={item.id} key={item.id} title={item.name} />
        ))}
        {!props.columns && <h3>Unable to reach server</h3>}
      </HStack>
    </Box>
  );
}

export default Columns;
