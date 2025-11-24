import { 
  addEdge, 
  applyEdgeChanges, 
  applyNodeChanges, 
  type Connection, 
  type Edge, 
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum ColumnType {
  VARCHAR = "VARCHAR",
  TEXT = "TEXT",
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  DATE = "DATE",
  DATETIME = "DATETIME",
  UUID = "UUID"
}

export interface Column {
  name: string;
  primarykey: boolean;
  unique: boolean;
  null: boolean;
  type: ColumnType;
  defaultValue?: string;
}

export interface Table {
  name: string;
  columns: Column[];
}

interface NNode extends Node {
  data: {
    table: Table;
  }
}

interface SchemaState {
  nodes: NNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addTable: (table: Table) => void;
  setNodes: (nodes: NNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  resetSchema: () => void;
}

export const SchemaStore = create<SchemaState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes: NodeChange[]) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) as NNode[] });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },
      onConnect: (connection: Connection) => {
        set({ edges: addEdge(connection, get().edges) });
      },
      addTable: (table: Table) => {
        set((state) => {
          const newNode: NNode = {
            id: `table-${Date.now()}`,
            position: {x: 100, y: 100},
            data: {
              table: table,
              label: `${table.name}`
            }
          };
          const newNodes = [...state.nodes, newNode];
          return {nodes: newNodes};
        });
      },
      setNodes: (nodes: NNode[]) => {
        set({ nodes: nodes });
      },
      setEdges: (edges: Edge[]) => {
        set({ edges: edges });
      },
      resetSchema: () => {
        set({ nodes: [], edges: []});
      },
    }),{
      name: "schema"
    }
  )
);
