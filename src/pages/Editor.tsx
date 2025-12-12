import EditorHeader from "@/components/EditorHeader";
import ReactFlowDiagram from "@/components/ReactFlowDiagram";
import { defaultColorSelection } from "@/components/diagram/TableNode";
import { useState } from "react";
import { NoobSQLParser } from "@/lib/parser";
import { SchemaStore } from "@/store/node-store";
import type { Position, Table } from "@/types/node";
import type { TextArea } from "@/types/editor";
import type { Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const Value = {
  editor: ""
}

export default function Editor() {
	const { addTable, addEdge, resetSchema } = SchemaStore();
	const [ data, setData ] = useState<TextArea>(Value);
	const parser = new NoobSQLParser();

	const handleSql = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setData((prevData) => ({...prevData, [name]: value}));

		try {
			parser.SetSQLText(value);
			parser.Parse();
			const asts = parser.GetAST();

			resetSchema();

			let x = 100;
			let y = 100;
			let spacing = 500;

			for (const ast of asts) {
				const table: Table = {
					columns: ast.column,
					name: ast.tableName,
					headerColor: defaultColorSelection["gray"],
				}
				const position: Position = { x, y };
				addTable(table, position, "table");

				x += spacing;
				if (x > window.innerWidth - 400) {
					x = 100;
					y += spacing;
				}
			}

      const currentNodes = SchemaStore.getState().nodes;
      let counter = 1;
      
      for (const ast of asts) {
        if (ast.relation.length === 0) continue;
        
        ast.relation.forEach((rl) => {
          const source = currentNodes.find((node) => 
            node.data.table.name === rl.from.tableName
          );
          const target = currentNodes.find((node) => 
            node.data.table.name === rl.to.tableName
          );
          
          if (!source || !target) return;

          const sourceHandle = source.data.table.columns.find((col) => 
            col.name === rl.from.columnName
          );
          const targetHandle = target.data.table.columns.find((col) => 
            col.name === rl.to.columnName
          );
          
          if (!sourceHandle || !targetHandle) return;

          const edge: Edge = {
            id: `edge-${counter++}`,
            source: source.id,
            target: target.id,
            sourceHandle: sourceHandle.id,
            targetHandle: targetHandle.id,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#00d9ff", strokeWidth: 2 },
          }
          addEdge(edge);
        });
      }
		} catch (error) {
			console.log(error);
		}	
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
					<textarea
						name="editor"
						id="editor"
						className="flex-1 w-full resize-none bg-stone-800 text-white jb p-2 rounded-2xl focus:outline-none "
						onChange={handleSql}
						defaultValue={data.editor}
					></textarea>
				</aside>
				<div
					className="w-1 bg-stone-900 hover:bg-[#00d9ff] rounded-full cursor-col-resize transition-colors flex-none"
					onMouseDown={handleResizeStart}
				/>
				<section className="flex-1 relative h-full w-full pl-1 bg-stone-900 ">
					<ReactFlowDiagram />
					<div className=" absolute flex-1 bg-stone-900 h-full w-full z-1"></div>
				</section>
			</main>
		</div>
	);
}
