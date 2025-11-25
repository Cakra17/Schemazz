import { Database, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "./primitives/Button";

export default function Navbar() {
	return (
		<header className="dark relative z-100 bg-[#111] border-b border-white/1 backdrop-blur-md">
			<div className="flex flex-row h-15 max-w-7xl items-center justify-between mx-auto px-4 text-white jb sm:px-6 lg:px-8">
				<div className="flex-1">
					<Logo />
				</div>
				<nav>
					<ul className="flex space-x-8">
						<li className="underline underline-offset-4 hover:font-bold hover:decoration-white decoration-white/30">
							<Link to="/editor">Editor</Link>
						</li>
						<li className="underline underline-offset-4 hover:font-bold hover:decoration-white decoration-white/30">
							<Link to="https://github.com/Cakra17/Schemazz" target="_blank">
								Github
							</Link>
						</li>
					</ul>
				</nav>
				<div className="flex-1 flex flex-row justify-end">
					<Button variant="plain" className="p-2">
						<Sun className="w-5 h-5" />
					</Button>
				</div>
			</div>
		</header>
	);
}
