import type { ReactNode } from "react";

export function ListMenu({ children }: { children: ReactNode }) {
	return <div className="flex flex-col items-stretch py-2">{children}</div>;
}

interface ListMenuProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	leadingContent?: ReactNode;
	title: string;
	description?: string;
	trailingContent?: ReactNode;
}

export function ListMenuItem({
	leadingContent = null,
	trailingContent = null,
	title,
	description = "",
	onClick,
}: ListMenuProps) {
	return (
		<button
			className="flex flex-row px-6 py-3 gap-4 text-stone-800 dark:text-gray-100 hover:dark:bg-stone-700 hover:cursor-pointer transition-all text-sm"
			onClick={onClick}
		>
			{leadingContent}
			<div className="flex flex-col items-start gap-0.5">
				<h1>{title}</h1>
				{description !== "" ? (
					<h2 className="opacity-80 text-xs">{description}</h2>
				) : null}
			</div>
			{trailingContent}
		</button>
	);
}
