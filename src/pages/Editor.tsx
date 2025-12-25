import EditorHeader from "@/components/EditorHeader";
import ReactFlowDiagram from "@/components/ReactFlowDiagram";
import "@xyflow/react/dist/style.css";
import CustomEditor from "@/components/CustomEditor";
import { ReactFlowProvider } from "@xyflow/react";

export default function EditorPage() {
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
    <ReactFlowProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <EditorHeader />
        <main className="flex-1 flex px-4 pb-4 bg-stone-900 overflow-hidden">
          <aside
            className="relative bg-stone-900 pr-1 transition-all duration-10 flex flex-col"
            style={{ width: "var(--panel-width, 400px)" }}
          >
            <CustomEditor/>
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
    </ReactFlowProvider>
	);
}
