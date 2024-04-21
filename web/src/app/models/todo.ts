export interface TodoModel {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  editing?: boolean;
}

type Priority = 'BAIXA' | 'MEDIA' | 'ALTA'

export type FilterType = "all" | "active" | "completed" | 'none';