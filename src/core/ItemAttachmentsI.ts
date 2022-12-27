import { GuiFileI } from './GuiFileI';
import { ItemRequestI } from './ItemI';

export interface ItemAttachmentsI {
  item: ItemRequestI;
  attachments: Array<GuiFileI>;
}
