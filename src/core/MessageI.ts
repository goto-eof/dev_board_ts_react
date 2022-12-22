export default interface MessageI {
  id?: number;
  message_type: string;
  user_id: number;
  item_id: number;
  message: string;
  created_at?: Date;
  updated_at?: Date;
}
