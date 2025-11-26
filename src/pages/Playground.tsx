import { Share2 } from "lucide-react";
import type React from "react";
import { Button } from "@/components/primitives/Button";
import { useState } from "react";
import { usePopper } from "react-popper";
import {
	autoUpdate,
	flip,
	FloatingFocusManager,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { AdvancedPopover } from "@/components/primitives/Popover";

export default function Playground() {
	return (
		<>
			<div className="flex flex-col gap-4 overflow-hidden m-4 p-4 border-1 rounded-xl">
				<h2 className="text-2xl font-medium">Buttons</h2>
				<div className="flex gap-2 items-center">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="danger">Danger</Button>
					<Button variant="warning">Warning</Button>
					<Button variant="link">Link</Button>
					<Button variant="plain">
						<Share2 size={20} />
					</Button>
				</div>
			</div>
			<div className="dark dark:bg-neutral-800 flex flex-col gap-4 overflow-hidden m-4 p-4 border-1 rounded-xl">
				<h2 className="text-2xl font-medium text-neutral-50">Buttons (Dark)</h2>
				<div className="flex gap-2 items-center">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="danger">Danger</Button>
					<Button variant="warning">Warning</Button>
					<Button variant="link">Link</Button>
					<Button variant="plain">
						<Share2 size={20} />
					</Button>
				</div>
			</div>
			<PopperDemo />
		</>
	);
}

function PopperDemo() {
	return (
		<>
			<div className="dark dark:bg-neutral-800 flex flex-col gap-4 overflow-hidden m-4 p-4 border-1 rounded-xl">
				<h2 className="text-2xl font-medium text-neutral-50">
					Popover Menu & Tooltip
				</h2>
				<div className="flex flex-row"></div>
				<AdvancedPopover trigger={<Button>Click to show</Button>}>
					<p>HELLO I'm A POPOVER!</p>
				</AdvancedPopover>
			</div>
		</>
	);
}
