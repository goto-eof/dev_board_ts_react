export interface ItemUpdateRequestI {
  name?: string;
  environment?: string;
  issue_type?: number;
  order?: number;
  priority?: number;
  description?: string;
  column_id?: number;
  assignee_id?: number;
}
