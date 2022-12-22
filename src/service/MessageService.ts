import GenericService from './GenerciService';
import MessageI from '../core/MessageI';
import { UserResponseI } from '../core/UserResponseI';

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
