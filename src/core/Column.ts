import { ColumnResponseI } from './ColumnResponseI';
import { ItemRequestI } from './ItemRequestI';

export default interface ColumnI {
  column: ColumnResponseI;
  items: Array<ItemRequestI>;
}
