export interface Column {
  id: string
  name: string;
  isPK?: boolean;
  isFK?: boolean;
  unique: boolean;
  nullable: boolean;
  type: string;
}