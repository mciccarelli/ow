export function Plus({ className }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="w-6 h-6 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-muted-foreground" />
        <div className="absolute top-0 left-1/2 h-full w-px bg-muted-foreground" />
      </div>
    </div>
  )
}
