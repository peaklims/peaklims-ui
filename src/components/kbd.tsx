export function Kbd({ command }: { command: string }) {
  return (
    <span
      role="text"
      aria-label={`Keyboard command: ${command}`}
      className="inline-flex items-center justify-center px-1 text-xs font-medium text-center capitalize bg-white border rounded shadow border-slate-200"
    >
      {command}
    </span>
  );
}
