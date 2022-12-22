import GenericService from '../service/GenerciService';
import MessageI from './message';
import { UserResponseI } from './UserResponseI';

export const insertHistoryMessage = (itemId: number, message: string) => {
  const user: UserResponseI = JSON.parse(localStorage.getItem('user') || '{}');
  GenericService.create<MessageI>('message', {
    item_id: itemId,
    message: message,
    message_type: 'history',
    user_id: user.id,
  }).then((result) => {
    if (result.success) {
    }
  });
};
