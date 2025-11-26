import { Database } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
	return (
		<Link
			to={"/"}
			className="p-[6px] flex items-center text-2xl font-semibold gap-1 pr-4"
		>
			<Database size={28} />
			<h1>Schemazz</h1>
		</Link>
	);
}
