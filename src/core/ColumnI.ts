import { ColumnResponseI } from './ColumnResponseI';
import { ItemRequestI } from './ItemI';

export default interface ColumnI {
  column: ColumnResponseI;
  items: Array<ItemRequestI>;
}
