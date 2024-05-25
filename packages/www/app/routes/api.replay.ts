import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { BUCKET } = context.cloudflare.env;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    throw new Response("Not Found", { status: 404 });
  }
  const data = await BUCKET.get(id);
  if (!data) {
    throw new Response("Not Found", { status: 404 });
  }
  return new Response(await data.arrayBuffer(), {
    headers: {
      "Cache-Control": "max-age=31536000, immutable",
      "Content-Type": "application/octet-stream",
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  // blob from form data
  // metadata from blob
  // pick slug
  // blob to bucket
  // metadata to db
  // return slug
  return null;
}
