interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="px-5 pt-5 pb-3 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-orchard-800 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ink-muted mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  )
}

export function PageShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`page-enter page-shell flex flex-col h-full overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}

export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="font-semibold text-orchard-800 flex items-center gap-2 mb-3">
      <span className="text-lg">{icon}</span>
      {title}
    </h2>
  )
}

export function EmptyState({
  emoji, title, action,
}: { emoji: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4 drop-shadow-sm">{emoji}</div>
      <p className="text-ink-muted mb-5 text-sm leading-relaxed max-w-[200px]">{title}</p>
      {action}
    </div>
  )
}
