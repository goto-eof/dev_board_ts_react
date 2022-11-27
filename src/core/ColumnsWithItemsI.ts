import { BoardResponseI } from './BoardResponseI';
import ColumnWithItemsI from './ColumnWithItemsI';

export default interface ColumnsWithItemsI {
  board: BoardResponseI;
  columns: Array<ColumnWithItemsI>;
}
