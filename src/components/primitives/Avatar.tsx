//TODO: Props
export default function Avatar({
  className = "",
  children = <></>,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`w-8 h-8 rounded-full ${className} flex items-center justify-center`}
    >
      {children}
    </div>
  );
}
