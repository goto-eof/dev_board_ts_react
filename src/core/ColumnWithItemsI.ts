import { ColumnResponseI } from './ColumnResponseI';
import { ItemRequestI } from './ItemI';

export default interface ColumnWithItemsI {
  column: ColumnResponseI;
  items: Array<ItemRequestI>;
}
