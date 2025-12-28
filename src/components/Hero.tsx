import { Link } from "react-router-dom";
import hero from "public/images/hero.png";

export default function Hero() {
	return (
		<main className="min-h-screen jb">
			<section className="max-w-7xl py-4 mx-auto">
				<div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
					<div className="py-4">
						<div className="Ejb font-bold md:text-4xl text-3xl tracking-tight">
							Design Your Entity Relationship Diagram With Schemazz
						</div>
					</div>
					<div className="pt-1 pb-3">
						<div className=" text-gray-500 text-sm md:text-xl tracking-tight">
							A free, simple tool to draw ER diagrams by just writing SQL
							queries
						</div>
						<div className="text-gray-500 text-sm md:text-xl tracking-tight">
							Design for developers and data analysts
						</div>
					</div>
					<div className="pt-5">
						<Link
							to="/editor"
							className="bg-[#181818] hover:bg-[#333] text-white rounded-md cursor-pointer p-3 shadow-xl"
						>
							Try it Now!
						</Link>
					</div>
				</div>
			</section>
			<section className="max-w-2xl md:max-w-7xl mx-auto py-4">
				<img loading="lazy" src={hero} alt="example" className="rounded-lg shadow-xl"/>
			</section>
		</main>
	);
}
