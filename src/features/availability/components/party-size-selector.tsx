type PartySizeSelectorProps = {
  hasInvalidPartySize: boolean;
  onPartySizeChange: (value: string) => void;
  partySizeInput: string;
  selectedDate: string | null;
  selectedOperatingHours: string | null;
  selectedWeekday: string | null;
};

export function PartySizeSelector({
  hasInvalidPartySize,
  onPartySizeChange,
  partySizeInput,
  selectedDate,
  selectedOperatingHours,
  selectedWeekday,
}: PartySizeSelectorProps) {
  return (
    <section aria-labelledby="party-size-heading">
      <h2 className="text-xl font-bold" id="party-size-heading">
        Party size
      </h2>
      <label className="mt-5 block" htmlFor="partySize">
        <span className="mb-3 block text-sm font-bold text-tailor-muted">
          Guests
        </span>
        <input
          aria-describedby={hasInvalidPartySize ? "partySize-error" : undefined}
          aria-invalid={hasInvalidPartySize}
          className="min-h-12 w-full rounded-full border border-tailor-blue bg-tailor-blue px-5 py-3 text-tailor-white outline-none transition placeholder:text-white/65 hover:border-white focus:border-white focus:ring-2 focus:ring-white/30"
          id="partySize"
          min={1}
          onChange={(event) => onPartySizeChange(event.target.value)}
          placeholder="2"
          type="number"
          value={partySizeInput}
        />
      </label>
      {hasInvalidPartySize ? (
        <p
          className="mt-2 text-sm font-bold text-tailor-error"
          id="partySize-error"
        >
          Party size must be a positive whole number.
        </p>
      ) : null}

      <div className="mt-8 border-t border-tailor-border pt-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-tailor-muted">
          Selected day
        </h3>
        {selectedDate ? (
          <div className="mt-3 space-y-2">
            <p className="text-lg font-bold">{selectedDate}</p>
            <p className="text-sm leading-6 text-tailor-muted">
              {selectedOperatingHours
                ? `${selectedWeekday}: ${selectedOperatingHours}`
                : "No operating hours listed for this day."}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-tailor-muted">
            Select a date to see operating hours.
          </p>
        )}
      </div>
    </section>
  );
}
