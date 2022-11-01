import { ColumnResponseI } from './ColumnResponseI';
import { ItemIR } from './ItemRequestI';

export default interface BoardI {
  board: ColumnResponseI;
  items: Array<ItemIR>;
}
