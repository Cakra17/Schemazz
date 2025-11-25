import type { NodeProps } from "@xyflow/react";
import type { TableNodeType, TableNodeData } from "./types";
import { Button } from "../primitives/Button";
import { Key, Link, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function TableNode({
	id,
	data,
	selected,
}: NodeProps<TableNodeType>) {
	// TODO: Interactive node changes
	return (
		<div className="jb min-w-xs max-w-md shadow-lg rounded-2xl overflow-hidden bg-gray-100 dark:bg-stone-800">
			<TableHeader title={data.tableName} />
			{data.column.map((column) => (
				<div className="flex flex-row items-center px-3 py-3 gap-2 text-stone-800 dark:text-gray-100 hover:dark:bg-stone-700 transition-all">
					{column.isPK ? (
						<Key className="text-amber-400" size={16} strokeWidth={3} />
					) : null}
					{column.isFK ? (
						<Link className="text-blue-400" size={16} strokeWidth={3} />
					) : null}
					<div>{column.name}</div>
					<div className="flex-1" />
					<div className="opacity-90 text-xs">{column.type}</div>
					{column.isPK ? (
						<div className="rounded-full bg-cyan-200 dark:bg-cyan-700 px-2.5 py-0.5 text-xs">
							PK
						</div>
					) : null}
					{column.isFK ? (
						<div className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-2.5 py-0.5 text-xs">
							FK
						</div>
					) : null}
				</div>
			))}
		</div>
	);
}

function TableHeader({
	title,
	onTitleChange = () => {},
}: {
	title: string;
	onTitleChange?: () => void;
}) {
	const [isConfigShowing, setIsConfigShowing] = useState(false);

	// TODO: Costumization & Configs
	return (
		<div
			className="flex flex-row items-center px-2.5 py-2.5 w-full bg-cyan-300 dark:bg-fuchsia-700 text-stone-900 dark:text-stone-50 font-bold justify-between"
			onMouseEnter={() => setIsConfigShowing(true)}
			onMouseLeave={() => setIsConfigShowing(false)}
		>
			<input
				className="outline-none ring-none ring-slate-400 rounded-md py-1 pl-2
                focus:dark:ring-slate-300 focus:ring-2
                transition-all duration-150"
				value={
					(title.length === 0 ? "" : title.charAt(0).toUpperCase()) +
					(title.length < 2 ? "" : title.slice(1))
				}
			></input>
			<Button
				variant="plain"
				disableEffect
				className={`pr-2 ${isConfigShowing ? "opacity-100" : "opacity-0"}`}
				disabled={isConfigShowing}
			>
				<MoreVertical size={20} />
			</Button>
		</div>
	);
}
