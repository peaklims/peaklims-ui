import { cn } from "@/lib/utils";

export function Abandoned({ className, ...props }: { className?: string }) {
  return (
    // https://iconbuddy.com/solar/trash-bin-trash-line-duotone

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={200}
      height={200}
      viewBox="0 0 24 24"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M20.5 6h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79c-.865.81-2.195.81-4.856.81h-.774c-2.66 0-3.99 0-4.856-.81c-.865-.809-.953-2.136-1.13-4.79l-.46-6.9"
        />
        <path strokeLinecap="round" d="m9.5 11l.5 5m4.5-5l-.5 5" opacity=".5" />
        <path
          d="M6.5 6h.11a2 2 0 0 0 1.83-1.32l.034-.103l.097-.291c.083-.249.125-.373.18-.479a1.5 1.5 0 0 1 1.094-.788C9.962 3 10.093 3 10.355 3h3.29c.262 0 .393 0 .51.019a1.5 1.5 0 0 1 1.094.788c.055.106.097.23.18.479l.097.291A2 2 0 0 0 17.5 6"
          opacity=".5"
        />
      </g>
    </svg>
  );
}