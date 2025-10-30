import Navbar from "@/components/Navbar"

export default function Editor() {
  return (
    <div>
      <Navbar/>
      <main className="min-h-screen flex">
        <aside className="bg-[#333] transition-all duration-10" style={{ width: 'var(--panel-width, 400px)' }}>
          <textarea name="editor" id="editor" className="w-full h-full text-white/90 jb"></textarea>
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