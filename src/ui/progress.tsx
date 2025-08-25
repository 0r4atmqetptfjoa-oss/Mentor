import { clsx } from 'clsx';

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={clsx('w-full h-2 bg-slate-200 rounded', className)}>
      <div
        className="h-full bg-sky-500 rounded"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default Progress;

