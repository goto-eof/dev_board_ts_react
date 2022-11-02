import { ColumnResponseI } from './ColumnResponseI';
import { ItemRequestI } from './ItemRequestI';

export default interface ColumnWithItemsI {
  column: ColumnResponseI;
  items: Array<ItemRequestI>;
}
