import { cn } from "@/lib/utils";

export function HorizontalEllipsis({
  className,
  ...props
}: {
  className?: string;
}) {
  return (
    // https://iconbuddy.app/ion/ellipsis-horizontal-sharp
    <svg
      width={512}
      height={512}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <circle cx={256} cy={256} r={48} fill="currentColor" />
      <circle cx={416} cy={256} r={48} fill="currentColor" />
      <circle cx={96} cy={256} r={48} fill="currentColor" />
    </svg>
  );
}
