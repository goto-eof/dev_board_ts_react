export interface ItemRequestI {
  id?: number;
  name: string;
  environment: string;
  code: string;
  order: number;
  priority: number;
  description: string;
  column_id: number;
  assignee_id?: number;
}
