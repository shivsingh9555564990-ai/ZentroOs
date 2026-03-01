import { cn } from '../utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
