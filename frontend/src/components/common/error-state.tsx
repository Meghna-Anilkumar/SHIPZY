import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
    <p>{message}</p>
    {onRetry ? (
      <Button className="mt-3" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    ) : null}
  </div>
);
