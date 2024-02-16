import { Link, Outlet } from "react-router-dom";

export function Root() {
  return (
    <>
      {/* <header className="py-2 px-8 border-b flex items-center gap-2">
        <Link to="/">slippilab</Link>
      </header> */}
      <main className="pt-4 px-8">
        <Outlet />
      </main>
    </>
  );
}
