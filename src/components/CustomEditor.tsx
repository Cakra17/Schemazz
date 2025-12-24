import { useRef } from "react";
import { editor } from "monaco-editor";
import { Editor, type OnChange, type OnMount } from "@monaco-editor/react";
import { NoobSQLParser } from "@/lib/parser";
import { SchemaStore } from "@/store/node-store";
import type { Position, Table } from "@/types/node";
import { defaultColorSelection } from "./diagram/TableNode";
import type { Edge } from "@xyflow/react";

export default function CustomEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { addTable, addEdge, resetSchema } = SchemaStore();
	const parser = new NoobSQLParser();

	const handleSql: OnChange = (value, event) => {
		try {
			parser.SetSQLText(value!);
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

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.focus();
  };

  return (
    <>
      <Editor 
        theme="vs-dark"
        defaultLanguage="sql"
        className="w-full rounded-2xl"
        onMount={handleEditorMount}
        onChange={handleSql}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          automaticLayout: true,
        }}
      />
    </>
  );
}