import { parseMetadata } from "./parser/parser";

onmessage = async event => {
  const metadatas = await Promise.all(
    (event.data.payload as File[]).map((file: File) =>
      file.arrayBuffer().then(buffer => parseMetadata(buffer))
    )
  );
  postMessage({
    id: event.data.id,
    payload: metadatas,
  });
};
