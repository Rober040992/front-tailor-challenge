import type { InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
  name: string;
};

export function AuthField({
  error,
  label,
  name,
  ...inputProps
}: AuthFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label className="mb-2 block text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      <input
        {...inputProps}
        id={name}
        name={name}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className="min-h-12 w-full rounded-full border border-white/80 bg-tailor-blue px-5 py-3 text-tailor-white outline-none transition placeholder:text-white/55 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
      />
      {error ? (
        <p
          className="mt-2 text-base font-bold text-tailor-error"
          id={errorId}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
