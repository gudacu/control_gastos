import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    gradient?: boolean
}

export function GlassCard({ className, gradient = false, children, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300",
                gradient
                    ? "bg-gradient-to-br from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30"
                    : "bg-white/5 hover:bg-white/10",
                className
            )}
            {...props}
        >
            {/* Glossy reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
