import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";

export async function loader({ params, context }: LoaderFunctionArgs) {
  console.log("params", params);
  if (params.slug?.endsWith(".slp")) {
    const { BUCKET } = context.cloudflare.env;
    const object = await BUCKET.get(params.slug.slice(0, -4));
    if (!object) {
      return redirect("/");
    }
    const buffer = await object.arrayBuffer();
    const file = new File([buffer], params.slug, {
      type: "application/octet-stream",
    });
    return new Response(file);
  }
  return redirect("/?watch=" + params.slug);
}
