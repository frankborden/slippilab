export function SpinnerCircle() {
  return (
    <svg viewBox="-5 -5 10 10">
      <circle
        r={4}
        class="fill-transparent stroke-slate-400 animate-spin"
        stroke-dasharray="100"
        stroke-dashoffset={44}
        stroke-linecap="round"
        // @ts-ignore
        pathLength="100"
      />
    </svg>
  );
}
