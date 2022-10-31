export interface ItemI {
  id?: number;
  name: string;
  t_type: string;
  code: string;
  status: string;
  description: string;
  column_id: number;
}

export default interface Result<T> {
  result: T;
  success: boolean;
}
