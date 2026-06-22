import type { ReactNode } from "react";

type LoadingStateProps = {
  message: string;
  children?: ReactNode;
};

export function LoadingState({ children, message }: LoadingStateProps) {
  return (
    <div aria-live="polite" className="space-y-4">
      <p className="text-sm text-tailor-muted">{message}</p>
      {children}
    </div>
  );
}

type ErrorStateProps = {
  title: string;
  message: string;
};

export function ErrorState({ message, title }: ErrorStateProps) {
  return (
    <div
      className="rounded-tailor-md border border-tailor-blue bg-tailor-surface p-6"
      role="alert"
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm text-tailor-muted">{message}</p>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
};

export function EmptyState({ title }: EmptyStateProps) {
  return (
    <div className="rounded-tailor-md bg-tailor-surface p-8 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}
