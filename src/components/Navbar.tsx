import { Database, Sun } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="relative z-100 bg-[#111] border-b border-white/1 backdrop-blur-md">
      <div className="flex h-15 max-w-7xl items-center justify-between mx-auto px-4 text-white jb sm:px-6 lg:px-8">
        <div className="flex gap-2 items-center">
          <div className='mx-1'>
            <Database className='h-8 w-8'/>
          </div>
          <div className="text-xl">Schemazz</div>
        </div>
        <nav>
          <ul className="flex space-x-8">
            <li className="underline underline-offset-4 hover:font-bold "><a href="/">Editor</a></li>
            <li className="underline underline-offset-8"><a href='/'>Github</a></li>
          </ul>
        </nav>
        <div>
          <button className='mx-auto w-8 h-8 flex justify-center items-center hover:bg-[#333] hover:rounded-md hover:backdrop-blur-[2px] cursor-pointer'>
            <Sun className='w-5 h-5'/>
          </button>
        </div>
      </div>
    </header>
  );
}