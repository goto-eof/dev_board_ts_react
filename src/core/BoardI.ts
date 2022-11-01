import { ColumnResponseI } from './ColumnResponseI';
import { ItemRequestI } from './ItemRequestI';

export default interface BoardI {
  board: ColumnResponseI;
  items: Array<ItemRequestI>;
  _force_update?: boolean;
}
