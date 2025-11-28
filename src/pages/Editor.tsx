import { Background, Controls, Panel, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { Clipboard, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import type { TextArea } from "@/types/editor";
import EditorHeader from "@/components/EditorHeader";
import AddTableForm from "@/components/AddTableForm";
import useFormStore from "@/store/form";
import '@xyflow/react/dist/style.css';
import { NoobSQLParser } from "@/lib/parser";
import { SchemaStore } from "@/store/node-store";

const Value = {
  editor: ""
}

export default function Editor() {
  const { isFormOpen, openForm } = useFormStore();
  const [ data, setData ] = useState<TextArea>(Value);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = SchemaStore();
  const parser = new NoobSQLParser();

  const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setData((PrevData) => ({
      ...PrevData,
      [name]: value
    }));
    
  };

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

    let element = document.createElement('a');
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(editorText.value));
    element.setAttribute("download", filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    const editorText = document.getElementById("editor") as HTMLTextAreaElement;
    editorText.value = "";
    return;
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = parseInt(getComputedStyle(e.currentTarget.parentElement!).getPropertyValue('--panel-width') || '400', 10);

    const onMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(320, Math.min(600, startWidth + diff));
      document.documentElement.style.setProperty('--panel-width', `${newWidth}px`);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorHeader />
      <main className="flex-1 flex overflow-hidden">
        <aside 
          className="relative bg-[#333] transition-all duration-10 flex flex-col" 
          style={{ width: 'var(--panel-width, 400px)' }}
        >
          <div className="flex justify-end p-2 mr-1 gap-3">
            <button 
              className="p-2 bg-indigo-500 rounded-md cursor-pointer flex gap-1 justify-center items-center hover:bg-indigo-700"
              onClick={copy}>
              <Clipboard className="w-5 stroke-white"/>
              <span className="text-white jb">Copy</span>
            </button>
            <button 
              className="p-2 bg-red-500 rounded-md cursor-pointer flex gap-1 justify-center items-center hover:bg-red-700"
              onClick={reset}>
              <Trash2 className="w-5 stroke-white"/>
              <span className="text-white jb">Reset</span>
            </button>
            <button 
              className="p-2 bg-indigo-500 rounded-md cursor-pointer flex gap-1 justify-center items-center hover:bg-indigo-700"
              onClick={download}>
              <Download className="w-5 stroke-white"/>
              <span className="text-white jb">Download</span>
            </button>
          </div>
          <div>
            <hr className="text-white/40"/>
          </div> 
          <textarea 
            name="editor" 
            id="editor" 
            className="flex-1 w-full resize-none text-white jb p-2 focus:outline-none bg-[#333]"
            onBlur={handleEditorChange}
          ></textarea>
        </aside>
        <div
          className="w-1 bg-transparent hover:bg-[#00d9ff] cursor-col-resize transition-colors flex-none"
          onMouseDown={handleResizeStart}
        />
        <section className="flex-1">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
            >
              <Panel position="top-left">
                <button 
                  className="p-[6px] bg-indigo-500 text-white jb rounded-md cursor-pointer hover:bg-indigo-700" 
                  onClick={openForm}
                  >
                  Add Table
                </button>
              </Panel>
              <Controls />
              <Background gap={12} size={1} />
            </ReactFlow>
            { isFormOpen && <AddTableForm/>}
          </ReactFlowProvider>
        </section>
      </main>
    </div>
  )
}
