export default function VR({ className = '' }: { className?: string }) {
    return (
        <div
            className={`h-3/4 border border-slate-950 dark:border-slate-50 opacity-60  ${className}`}
        />)
}