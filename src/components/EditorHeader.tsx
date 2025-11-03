import { Database, GithubIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function EditorHeader() {
  return (
    <header className="relative z-100 bg-[#111] border-b border-white/1 backdrop-blur-md">
      <div className="flex h-10 max-w-7xl items-center justify-between mx-auto px-4 text-white jb sm:px-6 lg:px-8">
        <div className="flex justify-start items-center gap-3">
          <Link to={"/"} className="p-[6px]"><Database className="h-5 w-5"/></Link>
        </div>
        <div className="justify-end mr-2">
          <div className="flex justify-center items-center">
            <Link to={"https://github.com/Cakra17/Schemazz"} target="_blank" className="p-[6px] rounded-md hover:bg-[#333]">
              <GithubIcon className="w-5 h-5"/>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}