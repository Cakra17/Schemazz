import type { Edge, Node } from "@xyflow/react";

// /// /// /// /// /// /// ///
// /// Table definition /// //
// /// /// /// /// /// /// ///
export type Column = {
  id: string;
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  nullable?: boolean;
};

// Define data of table
export type TableNodeData = {
  tableName: string;
  column: Column[];
};

// Use as Node type
export type TableNodeType = Node<TableNodeData>;

// /// /// /// /// /// /// //
// /// Edge definition /// //
// /// /// /// /// /// /// //
//TODO: Handle Relationship
export type RelationshipType = "1-1" | "1-M" | "M-M";

export type RelationshipEdgeData = {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  relationship: RelationshipType;
};

export type RelationshipEdge = Edge<RelationshipEdgeData>;
