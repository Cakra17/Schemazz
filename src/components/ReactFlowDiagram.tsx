import {
	Background,
	ConnectionMode,
	Controls,
	Panel,
	ReactFlow,
	ReactFlowProvider,
	type Edge,
} from "@xyflow/react";
import type { TableNodeType } from "./diagram/NodeType";
import TableNode, { defaultColorSelection } from "./diagram/TableNode";
import { SchemaStore } from "@/store/node-store";
import { Button } from "./primitives/Button";

const nodeTypes = {
	table: TableNode,
};

const defaultNodes: TableNodeType[] = [
	{
		id: "node-1",
		type: "table",
		position: { x: 300, y: 300 },
		zIndex: 0,
		data: {
			tableName: "users",
			headerColor: defaultColorSelection["gray"],
			column: [
				{
					id: "node-1_col-1",
					name: "id",
					type: "UUID",
					isPK: true,
				},
				{
					id: "node-1_col-2",
					name: "email",
					type: "VARCHAR(320)",
				},
				{
					id: "node-1_col-3",
					name: "username",
					type: "VARCHAR(30)",
				},
				{
					id: "node-1_col-4",
					name: "password_hash",
					type: "VARCHAR(64)",
				},
				{
					id: "node-1_col-5",
					name: "created_at",
					type: "TIMESTAMP",
				},
			],
		},
	},
	{
		id: "node-2",
		type: "table",
		position: { x: 800, y: 200 },
		zIndex: 0,
		data: {
			tableName: "posts",
			headerColor: defaultColorSelection["gray"],
			column: [
				{
					id: "node-2_col-1",
					name: "id",
					type: "UUID",
					isPK: true,
				},
				{
					id: "node-2_col-2",
					name: "title",
					type: "VARCHAR(60)",
				},
				{
					id: "node-2_col-3",
					name: "username",
					type: "TEXT",
				},
				{
					id: "node-2_col-4",
					name: "user_id",
					type: "UUID",
					isFK: true,
				},
				{
					id: "node-2_col-5",
					name: "created_at",
					type: "TIMESTAMP",
				},
			],
		},
	},
];

const defaultEdges: Edge[] = [
	{
		id: "node-1_col-1--node-2_col-4",
		source: "node-1",
		target: "node-2",
		sourceHandle: "node-1_col-1",
		targetHandle: "node-2_col-4",
	},
];

export default function ReactFlowDiagram() {
	// const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
	const { nodes, edges, onNodesChange, onEdgesChange, resetSchema } = SchemaStore();

	return (
		<ReactFlowProvider>
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
						<Button variant="danger" className="text-[1rem]" onClick={resetSchema}> 
							Reset
						</Button>
					</Panel>
					<Controls />
					<Background gap={12} size={1} />
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	);
}
