import { BoardResponseI } from './BoardResponseI';
import { UserResponseI } from './UserResponseI';

export default interface SharedWithResponseI {
  board: BoardResponseI;
  users: Array<UserResponseI>;
}
