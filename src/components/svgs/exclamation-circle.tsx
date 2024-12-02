import { cn } from "@/lib/utils";

export function ExclamationCircle({
  className,
  ...props
}: {
  className?: string;
}) {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M10 2c4.42 0 8 3.58 8 8s-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8m1.13 9.38l.35-6.46H8.52l.35 6.46zm-.09 3.36c.24-.23.37-.55.37-.96c0-.42-.12-.74-.36-.97s-.59-.35-1.06-.35s-.82.12-1.07.35s-.37.55-.37.97c0 .41.13.73.38.96c.26.23.61.34 1.06.34s.8-.11 1.05-.34"
      />
    </svg>
  );
}
