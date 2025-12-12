import type { Column } from "@/types/column";
import type { Position, Table } from "@/types/node";
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

export interface NNode extends Node {
  data: {
    table: Table;
    label: string;
  }
}

export interface SchemaState {
  nodes: NNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addTable: (table: Table, pos: Position, type: string) => void;
  addEdge: (edge: Edge) => void;
  updateTable: (tableId: string, table: Table) => void;
  deleteTable: (tableId: string) => void;
  addColumn: (tableId: string, column: Column) => void;
  updateColumn: (tableId: string, columnId: string, column: Column) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
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
      addTable: (table: Table, pos: Position, type: string) => {
        set((state) => {
          const newNode: NNode = {
            id: `table-${table.name}`,
            position: pos,
            type: type,
            data: {
              table: table,
              label: `${table.name}`
            }
          };
          const newNodes = [...state.nodes, newNode];
          return {nodes: newNodes};
        });
      },
      addEdge: (edge: Edge) => {
        set((state) => {
          const newEdges = [...state.edges, edge];
          return {edges: newEdges};
        });
      },
      setNodes: (nodes: NNode[]) => {
        set({ nodes: nodes });
      },
      setEdges: (edges: Edge[]) => {
        set({ edges: edges });
      },
      updateTable: (tableId: string, table: Table) => {
        set((state) => {
          const updatedNodes = state.nodes.map((node) => {
            if (node.id === tableId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  table: table,
                }
              }
            }
            return node;
          });
          return { nodes: updatedNodes, edges: state.edges };
        });
      },
      deleteTable: (tableId: string) => {
        set((state) => {
          const updatedNodes = state.nodes.map((node) => {
            if (node.id !== tableId) {
              return {
                ...node
              }
            }
            return node;
          })
          return { nodes: updatedNodes, edges: state.edges };
        });
      },
      addColumn: (tableId: string, column: Column) => {
        set((state) => {
          const updatedNodes = state.nodes.map((node) => {
            if (node.id === tableId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  table: {
                    ...node.data.table,
                    column: [...node.data.table.columns, column],
                  }
                }
              }
            }
            return node
          });
          return { nodes: updatedNodes, edges: state.edges };
        });        
      },
      updateColumn: (tableId: string, columnId: string, column: Column) => {
        set((state) => {
          const updatedNodes = state.nodes.map((node) => {
            if (node.id === tableId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  table: {
                    ...node.data.table,
                    columns: node.data.table.columns.map((cl) => {
                      if (cl.id === columnId) {
                        return {
                          ...cl,
                          column
                        }
                      }
                      return cl;
                    }),
                  }
                }
              }
            }
            return node;
          });
          return { nodes: updatedNodes, edges: state.edges };
        });
      },
      deleteColumn: (tableId: string, columnId: string) => {
        set((state) => {
          const updatedNodes = state.nodes.map((node) => {
            if (node.id === tableId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  table: {
                    ...node.data.table,
                    columns: node.data.table.columns.map((cl) => {
                      if (cl.id !== columnId) {
                        return {
                          ...cl
                        }
                      }
                      return cl;
                    }),
                  }
                }
              }
            }
            return node;
          });
          return { nodes: updatedNodes, edges: state.edges };
        });
      },
      resetSchema: () => {
        set({ nodes: [], edges: []});
      },
    }),{
      name: "schema"
    }
  )
);
