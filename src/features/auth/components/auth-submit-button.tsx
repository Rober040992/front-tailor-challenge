type AuthSubmitButtonProps = {
  isPending: boolean;
  label: string;
  pendingLabel: string;
};

export function AuthSubmitButton({
  isPending,
  label,
  pendingLabel,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="min-h-12 w-full rounded-full bg-tailor-white px-7 py-3 font-bold text-tailor-black transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? pendingLabel : label}
    </button>
  );
}
