import {
  Background,
  ConnectionMode,
  Controls,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import TableNode from "./diagram/TableNode";
import { SchemaStore } from "@/store/node-store";
import { Button } from "./primitives/Button";
import { FileStore } from "@/store/file-store";

const nodeTypes = {
  table: TableNode,
};

export default function ReactFlowDiagram() {
  const { nodes, edges, onNodesChange, onEdgesChange, resetSchema } =
    SchemaStore();
  const { resetText } = FileStore();

  const handleReset = () => {
    resetText();
    resetSchema();
  };

  return (
    <div className="absolute h-full w-full rounded-2xl overflow-hidden bg-gray-50 z-2">
      <ReactFlow
        colorMode="dark"
        className=" dark:border-1 dark:border-neutral-600 rounded-2xl"
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionMode={ConnectionMode.Loose}
      >
        <Panel position="top-left">
          <Button
            variant="danger"
            className="text-[1rem]"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Panel>
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
