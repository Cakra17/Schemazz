import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { TableNodeType, TableNodeData } from "./NodeType";
import { Button } from "../primitives/Button";
import { Key, Link, MoreVertical, Palette } from "lucide-react";
import { useCallback, useState, type CSSProperties } from "react";
import { AdvancedPopover } from "../primitives/Popover";
import { ListMenu, ListMenuItem } from "../primitives/Menu";
import VR from "../primitives/VerticalDivider";
import { isValidHex } from "@/utils/hex_parser";

export default function TableNode({
	id,
	data,
	selected,
}: NodeProps<TableNodeType>) {
	const { setNodes } = useReactFlow();

	const handleCostumizeButton = useCallback(() => {
		setNodes((nodes) => {
			return nodes.map((n) => {
				// 2. If this is the node we clicked, bring it to the front
				if (n.id === id) {
					// Force a new object reference explicitly to trigger React Flow's diffing
					return {
						...n,
						zIndex: 1000,
						data: { ...n.data, _forceUpdate: Date.now() },
					};
				}

				// 3. Optional: Push everyone else to the back
				// (This ensures the clicked node is DEFINITELY on top)
				return { ...n, zIndex: 0 };
			});
		});
	}, [id, setNodes]);

	// TODO: Interactive node changes
	return (
		<div className="jb min-w-xs max-w-md shadow-lg rounded-2xl overflow-hidden bg-gray-100 dark:bg-stone-800 dark:border dark:border-neutral-600">
			<TableHeader id={id} data={data} onClick={handleCostumizeButton} />
			{data.column.map((column) => (
				<div className="relative flex flex-row items-center px-3 py-3 gap-2 text-stone-800 dark:text-gray-100 hover:dark:bg-stone-700 transition-all">
					<Handle
						type="target"
						position={Position.Left}
						id={column.id}
						style={{
							background: "#ffffff",
							borderColor: "#ffffff",
						}}
					/>
					<Handle type="source" position={Position.Right} id={column.id} />
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
	id,
	data,
	onTitleChange = () => {},
	onClick = () => {},
}: {
	id: string;
	data: TableNodeData;
	onTitleChange?: () => void;
	onClick?: () => void; // Handle costumize button callback through react flow
}) {
	const [isConfigShowing, setIsConfigShowing] = useState(false);

	const { setNodes } = useReactFlow();

	const handleColorChange = useCallback(
		(color: CSSProperties["color"]) => {
			setNodes((nodes) => {
				return nodes.map((n) => {
					// 2. If this is the node we clicked, bring it to the front
					if (n.id === id) {
						// Force a new object reference explicitly to trigger React Flow's diffing
						return {
							...n,
							data: { ...n.data, headerColor: color, _forceUpdate: Date.now() },
						};
					}

					return {
						...n,
					};
				});
			});
		},
		[id, setNodes]
	);

	// TODO: Costumization & Configs
	return (
		<div
			className="flex flex-row items-center px-2.5 py-2.5 w-full text-stone-900 dark:text-stone-50 font-bold justify-between"
			style={{
				backgroundColor: data.headerColor,
			}}
			onMouseEnter={() => setIsConfigShowing(true)}
			onMouseLeave={() => setIsConfigShowing(false)}
		>
			<input
				className="outline-none ring-none ring-slate-400 rounded-md py-1 pl-2
                focus:dark:ring-slate-300 focus:ring-2
                transition-all duration-150"
				value={
					(data.tableName.length === 0
						? ""
						: data.tableName.charAt(0).toUpperCase()) +
					(data.tableName.length < 2 ? "" : data.tableName.slice(1))
				}
			></input>
			<AdvancedPopover
				trigger={
					<Button
						variant="plain"
						disableEffect
						className={`pr-2 ${
							isConfigShowing ? "opacity-100" : "opacity-0 pointer-events-none"
						}`}
						onClick={onClick}
					>
						<Palette />
					</Button>
				}
				placement="top"
				className="p-4"
			>
				<TableTheme
					currentColor={data.headerColor}
					onColorSet={handleColorChange}
				/>
			</AdvancedPopover>
		</div>
	);
}

export const defaultColorSelection: Record<string, CSSProperties["color"]> = {
	red: "oklch(44.4% 0.177 26.899)",
	orange: "oklch(70.5% 0.213 47.604)",
	yellow: "oklch(68.1% 0.162 75.834)",
	green: "oklch(52.7% 0.154 150.069)",
	teal: "oklch(51.1% 0.096 186.391)",
	cyan: "oklch(52% 0.105 223.128)",
	blue: "oklch(42.4% 0.199 265.638)",
	purple: "oklch(43.8% 0.218 303.724)",
	pink: "oklch(45.9% 0.187 3.815)",
	rose: "oklch(45.5% 0.188 13.697)",
	slate: "oklch(55.4% 0.046 257.417)",
	gray: "oklch(55.1% 0.027 264.364)",
	custom: "",
};

function TableTheme({
	currentColor,
	onColorSet,
}: {
	currentColor: CSSProperties["color"];
	onColorSet: (color: CSSProperties["color"]) => void;
}) {
	const [value, setValue] = useState("ffffff");
	const [error, setError] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		setValue(input);

		const isValid = isValidHex("#" + input);

		// Only show error if input is not empty and invalid
		setError(input.length > 0 && !isValid);
	};

	return (
		<div className="flex flex-col gap-3">
			<h1>Color</h1>
			<div className="grid grid-cols-4 gap-2">
				{Object.entries(defaultColorSelection).map(([key, value]) =>
					key !== "custom" ? (
						<div className={`flex flex-row justify-center`} key={key}>
							<div
								className={`w-[24] h-[24] rounded-full overflow-hidden ${
									currentColor === value &&
									"ring-1 ring-offset-1 ring-slate-900 dark:ring-slate-100"
								}`}
							>
								<Button
									variant="plain"
									className="w-full h-full"
									onClick={() => onColorSet(value)}
								>
									<div
										className="w-full h-full"
										style={{ backgroundColor: value }}
									></div>
								</Button>
							</div>
						</div>
					) : null
				)}
			</div>
			<h1>Custom</h1>
			<div className="flex flex-row gap-2">
				<div
					className={`w-[24] h-[24] rounded-full overflow-hidden ${
						currentColor === `#${value}` &&
						"ring-1 ring-offset-1 ring-slate-900 dark:ring-slate-100"
					}`}
				>
					<div
						className={`w-full h-full ${
							error ? "pointer-events-none" : "cursor-pointer"
						} `}
						onClick={() => {
							if (!error) {
								onColorSet(`#${value}`);
								console.log("HOLA");
							}
						}}
						style={{ backgroundColor: `#${value}` }}
					></div>
				</div>
				<div className="flex-1 flex flex-row ring-1 ring-slate-600 rounded-sm gap-2 px-2 items-center">
					<h2>#</h2>
					<input
						className="w-[56] outline-none text-sm font-medium"
						value={value}
						onChange={handleChange}
					></input>
				</div>
			</div>
		</div>
	);
}
