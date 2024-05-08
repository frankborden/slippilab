import { Link } from "react-aria-components";

export default function Page() {
  return (
    <div>
      hello, please go to{" "}
      <Link href="/replays" className="underline">
        Replays
      </Link>
    </div>
  );
}
