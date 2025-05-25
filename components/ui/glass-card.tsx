import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  highlight?: boolean
}

export function GlassCard({ children, className, highlight = false, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "relative backdrop-blur-md bg-white/70 border border-white/20 shadow-lg rounded-xl overflow-hidden",
        highlight && "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-secondary/10 before:opacity-30",
        className
      )}
      {...props}
    >
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  )
}