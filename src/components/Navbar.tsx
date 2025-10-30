import { Database, Sun} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname !== "/editor";

  return (
    <header className="relative z-100 bg-[#111] border-b border-white/1 backdrop-blur-md">
      <div className="flex h-15 max-w-7xl items-center justify-between mx-auto px-4 text-white jb sm:px-6 lg:px-8">
        <Link to='/' className="flex gap-2 items-center">
          <div className='mx-1'>
            <Database className='h-8 w-8'/>
          </div>
          <div className="text-xl">Schemazz</div>
        </Link>
        <nav>
          <ul className="flex space-x-8">
            {path && (
              <li className="underline underline-offset-4 hover:font-bold hover:decoration-white decoration-white/30"><Link to="/editor">Editor</Link></li>
            )}
            <li className="underline underline-offset-4 hover:font-bold hover:decoration-white decoration-white/30">
              <Link to='https://github.com/Cakra17/Schemazz' target='_blank'>
                Github
              </Link>
            </li>
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