
import { CircleDollarSign } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <CircleDollarSign className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">PennyPilot</h1>
    </div>
  );
}
