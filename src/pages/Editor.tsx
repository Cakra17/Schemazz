import EditorHeader from "@/components/EditorHeader";
import AddTableForm from "@/components/AddTableForm";
import {
	Background,
	Controls,
	Panel,
	ReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import { Clipboard, Download, Trash2 } from "lucide-react";
import "@xyflow/react/dist/style.css";
import TableNode from "@/components/diagram/TableNode";
import type { TableNodeType } from "@/components/diagram/types";

const nodeTypes = {
	table: TableNode,
};

const defaultNodes: TableNodeType[] = [
	{
		id: "node-1",
		type: "table",
		position: { x: 300, y: 300 },
		data: {
			tableName: "users",
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
		data: {
			tableName: "posts",
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

export default function Editor() {
	const copy = () => {
		const editorText = document.getElementById("editor") as HTMLTextAreaElement;
		navigator.clipboard.writeText(editorText.value).then(() => {
			console.log("copied");
		});
	};

	const download = () => {
		const editorText = document.getElementById("editor") as HTMLTextAreaElement;

		if (editorText.value === "") {
			alert("can't download");
			return;
		}

		const filename = Date.now() + ".sql";

		let element = document.createElement("a");
		element.setAttribute(
			"href",
			"data:text/plain;charset=utf-8," + encodeURIComponent(editorText.value)
		);
		element.setAttribute("download", filename);

		element.style.display = "none";
		document.body.appendChild(element);

		element.click();
		document.body.removeChild(element);
	};

	const reset = () => {
		const editorText = document.getElementById("editor") as HTMLTextAreaElement;
		editorText.value = "";
		return;
	};

	const handleResizeStart = (e: React.MouseEvent) => {
		const startX = e.clientX;
		const startWidth = parseInt(
			getComputedStyle(e.currentTarget.parentElement!).getPropertyValue(
				"--panel-width"
			) || "400",
			10
		);

		const onMouseMove = (e: MouseEvent) => {
			const diff = e.clientX - startX;
			const newWidth = Math.max(320, Math.min(600, startWidth + diff));
			document.documentElement.style.setProperty(
				"--panel-width",
				`${newWidth}px`
			);
		};

		const onMouseUp = () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	return (
		<div className="h-screen flex flex-col overflow-hidden">
			<EditorHeader />
			<main className="flex-1 flex px-4 pb-4 bg-stone-900 overflow-hidden">
				<aside
					className="relative bg-stone-900 pr-1 transition-all duration-10 flex flex-col"
					style={{ width: "var(--panel-width, 400px)" }}
				>
					{/* <div className="flex justify-end p-2 mr-1 gap-3">
            <button
              className="p-2 bg-indigo-500 rounded-md cursor-pointer flex gap-1 justify-center items-center hover:bg-indigo-700"
              onClick={copy}
            >
              <Clipboard className="w-5 stroke-white" />
              <span className="text-white jb">Copy</span>
            </button>
            <button
              className="p-2 bg-red-500 rounded-md cursor-pointer flex gap-1 justify-center items-center hover:bg-red-700"
              onClick={reset}
            >
              <Trash2 className="w-5 stroke-white" />
              <span className="text-white jb">Reset</span>
            </button>
            <button
              className="p-2 bg-indigo-500 rounded-md cursor-pointer flex gap-1 justify-center items-center hover:bg-indigo-700"
              onClick={download}
            >
              <Download className="w-5 stroke-white" />
              <span className="text-white jb">Download</span>
            </button>
          </div>
          <div>
            <hr className="text-white/40" />
          </div> */}
					<textarea
						name="editor"
						id="editor"
						className="flex-1 w-full resize-none bg-stone-800 text-white jb p-2 rounded-2xl focus:outline-none "
					></textarea>
				</aside>
				<div
					className="w-1 bg-stone-900 hover:bg-[#00d9ff] rounded-full cursor-col-resize transition-colors flex-none"
					onMouseDown={handleResizeStart}
				/>
				<section className="flex-1 relative h-full w-full pl-1 bg-stone-900">
					<ReactFlowProvider>
						<div className="absolute h-full w-full rounded-2xl overflow-hidden bg-gray-50 z-2">
							<ReactFlow
								colorMode="dark"
								className="dark"
								nodeTypes={nodeTypes}
								nodes={defaultNodes}
							>
								<Panel position="top-left">
									<AddTableForm />
								</Panel>
								<Controls />
								<Background gap={12} size={1} />
							</ReactFlow>
						</div>
					</ReactFlowProvider>
					<div className=" absolute flex-1 bg-stone-900 h-full w-full z-1"></div>
				</section>
			</main>
		</div>
	);
}
