export interface ItemRequestI {
  id?: number;
  name: string;
  environment: string;
  issue_type: number;
  order: number;
  priority: number;
  description: string;
  column_id: number;
  assignee_id?: number;
  reporter_id?: number;

  created_at?: Date;
}
