import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";

export function loader({ params }: LoaderFunctionArgs) {
  return redirect("/?slug=" + params.slug);
}
