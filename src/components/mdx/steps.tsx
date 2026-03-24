interface StepsProps {
  children: React.ReactNode;
}

export function Steps({ children }: StepsProps) {
  return <div className="my-6 space-y-4">{children}</div>;
}

interface StepProps {
  children: React.ReactNode;
  number?: number;
}

export function Step({ children, number }: StepProps) {
  return (
    <div className="flex gap-4">
      {number && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
          {number}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
