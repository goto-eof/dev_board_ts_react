export interface ItemI {
  id?: number;
  itemName: string;
  t_type: string;
  code: string;
  itemStatus: string;
  description: string;
  column_id: number;
}

export default interface Result<T> {
  result: T;
  success: boolean;
}
