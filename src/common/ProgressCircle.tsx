export function ProgressCircle(props: { percent: number }) {
  return (
    <svg viewBox="-5 -5 10 10">
      <circle
        r={4}
        class="fill-transparent stroke-slate-400 -rotate-90"
        stroke-dasharray="100"
        stroke-dashoffset={100 - props.percent}
        // @ts-ignore
        pathLength="100"
      />
    </svg>
  );
}
