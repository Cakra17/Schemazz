type ButtonVariant =
	| "primary"
	| "secondary"
	| "danger"
	| "warning"
	| "link"
	| "plain";

type Radius = "small" | "medium" | "large" | "full";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	radius?: Radius;
	disableEffect?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary: `bg-slate-500 text-slate-50 
        dark:bg-slate-300 dark:text-slate-900
        `,
	secondary: `
        ring-1 ring-slate-600 dark:ring-slate-600
        bg-neutral-100/5 dark:text-white
        `,
	danger: `
        bg-red-700 text-slate-50
        dark:bg-red-600 dark:text-slate-950
        `,
	warning: `
        bg-yellow-400 text-slate-950
        `,
	link: `
        bg-transparent text-blue-800 dark:text-blue-300
        `,
	plain: `
        bg-transparent text-neutral-950 dark:text-neutral-50
        `,
};

const variantEffect: Record<ButtonVariant, string> = {
	primary: `
        hover:bg-slate-700 
        active:bg-slate-600
        dark:hover:bg-slate-200
        dark:active:bg-slate-400
        `,
	secondary: `
        hover:ring-2 hover:ring-slate-600 dark:hover:ring-slate-400
        active:bg-slate-300 dark:active:bg-slate-300/20
        `,
	danger: `
        hover:bg-red-800 active:bg-red-600
        hover:dark:bg-red-500
        active:dark:bg-red-700
        `,
	warning: `
        hover:bg-yellow-500 active:bg-yellow-600
        hover:dark:bg-yellow-300
        active:dark:bg-yellow-500
        `,
	link: `
        hover:bg-neutral-200 hover:dark:bg-neutral-200/20
        hover:text-blue-900 hover:dark:text-blue-200
        active:bg-neutral-300 active:dark:bg-neutral-300/30
        `,
	plain: `
        hover:bg-neutral-200/60 hover:dark:bg-neutral-200/20
        active:bg-neutral-300/20 active:dark:bg-neutral-300/30
        `,
};

const radiusStyles: Record<Radius, string> = {
	small: `rounded-md`,
	medium: `rounded-lg`,
	large: `rounded-xl`,
	full: `rounded-full`,
};

const inactiveStyle = `opacity-80 pointer-event-none`;

export function Button({
	variant = "primary",
	radius = "medium",
	disableEffect = false,
	className = "",
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={`
                ${variantStyles[variant]}
                ${className}
                box-border flex gap-2 items-center justify-center
                transition duration-150 text-sm
                active:transition-none
                hover:cursor-pointer
                ${radiusStyles[radius]}
                ${
									props.disabled
										? ``
										: disableEffect
										? ``
										: variantEffect[variant]
								}
                ${props.disabled ? inactiveStyle : ``}
                
                `}
			{...props}
		>
			{children}
		</button>
	);
}
