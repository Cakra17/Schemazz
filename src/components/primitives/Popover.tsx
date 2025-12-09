import React, {
	useState,
	cloneElement,
	isValidElement,
	useEffect,
} from "react";
import {
	useFloating,
	offset,
	flip,
	shift,
	autoUpdate,
	useClick,
	useDismiss,
	useInteractions,
	type AutoUpdateOptions,
	type Placement,
} from "@floating-ui/react";

interface AdvancedPopoverProps {
	// The content inside the bubble (Your preference)
	children: React.ReactNode;
	// The button/element that triggers the popover
	trigger: React.ReactNode;
	placement?: Placement;
	className?: string;
	shouldAutoUpdate?: boolean;
	onOpenCallback?: (isOpen: boolean) => void;
}

export function AdvancedPopover({
	children,
	trigger,
	placement = "bottom",
	className = "",
	shouldAutoUpdate = false,
	onOpenCallback = () => {},
}: AdvancedPopoverProps) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		onOpenCallback(isOpen);
	}, [isOpen]);

	const updateOption: AutoUpdateOptions = {
		ancestorScroll: shouldAutoUpdate,
		elementResize: shouldAutoUpdate,
		ancestorResize: shouldAutoUpdate,
		layoutShift: shouldAutoUpdate,
		animationFrame: shouldAutoUpdate,
	};

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: placement,
		middleware: [offset(10), flip(), shift()],
		whileElementsMounted: (refEl, floatEl, update) =>
			autoUpdate(refEl, floatEl, update, updateOption),
	});

	const click = useClick(context);
	const dismiss = useDismiss(context);

	// Create useInteraction props and pass it to trigger & child
	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
	]);

	// Inject trigger to our trigger element
	const triggerElement = isValidElement(trigger) ? (
		cloneElement(trigger as React.ReactElement, {
			// @ts-ignore - Idk what it does but it necessary and i'm too lazy to ask ai
			ref: refs.setReference,
			onClick: (e: React.MouseEvent) => {
				setIsOpen(!isOpen);
				// If your custom button had its own onClick, call it too:
				(trigger as any).props.onClick?.(e);
			},
		})
	) : (
		// Fallback just in case someone passes a plain string as a trigger
		<span
			ref={refs.setReference}
			// onClick={() => setIsOpen(!isOpen)}
			{...getReferenceProps()}
		>
			{trigger}
		</span>
	);

	return (
		<>
			{triggerElement}
			<div
				ref={refs.setFloating}
				style={floatingStyles}
				{...getFloatingProps()}
				className={`
					z-50 bg-white dark:bg-neutral-800 dark:border dark:border-neutral-600 rounded-xl shadow-xl transition-all duration-150
					${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
					${className}
					`}
			>
				{children}
			</div>
		</>
	);
}
