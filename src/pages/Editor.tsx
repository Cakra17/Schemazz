import EditorHeader from "@/components/EditorHeader";
import { Clipboard, Download, LucideArrowLeft, Trash2 } from "lucide-react";

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

  return (
    <div>
      <EditorHeader/>
      <main className="min-h-screen flex">
        <aside id="sidepanel" className="relative bg-[#333] transition-all duration-10" style={{ width: 'var(--panel-width, 400px)' }}>
          <div className="flex justify-end p-2 mr-1 gap-3">
            <button 
              className="p-2 bg-indigo-500 rounded-md cursor-pointer flex gap-1 justify-center items-center hover:bg-indigo-700"
              onClick={copy}>
              <Clipboard className="w-5 stroke-white"/>
              <span className="text-white jb">Copy</span>
            </button>
            <button 
              className="p-2 bg-red-500 rounded-md cursor-pointer flex gap-1 justify-center items-center hover:bg-indigo-700"
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
          <textarea name="editor" id="editor" className="w-full h-full text-white jb p-2 focus:outline-none"></textarea>
        </aside>
        <div
          className="w-1 bg-transparent hover:bg-[#00d9ff] cursor-col-resize transition-colors"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = parseInt(getComputedStyle(e.currentTarget.parentElement!).getPropertyValue('--panel-width') || '400', 10);

            const onMouseMove = (e: MouseEvent) => {
              const diff = e.clientX - startX;
              const newWidth = Math.max(200, Math.min(600, startWidth + diff));
              document.documentElement.style.setProperty('--panel-width', `${newWidth}px`);
            };

            const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        />
        <section className="overflow-hidden">
          
        </section>
      </main>
    </div>
  )
}