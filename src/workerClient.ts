import { parseGameSettings } from "./parser/parser";

onmessage = async event => {
  const metadatas = await Promise.all(
    (event.data.payload as File[]).map((file: File) =>
      file.arrayBuffer().then(buffer => parseGameSettings(buffer))
    )
  );
  postMessage({
    id: event.data.id,
    payload: metadatas,
  });
};
