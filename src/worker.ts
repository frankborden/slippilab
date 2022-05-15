import { parseGameSettings } from "./parser/parser";

onmessage = async event => {
  const metadatas = await Promise.all(
    (event.data.payload as File[]).map((file: File) =>
      file.arrayBuffer().then(buffer => {
        try {
          return parseGameSettings(buffer);
        } catch (e) {
          return undefined;
        }
      })
    )
  );
  postMessage({
    id: event.data.id,
    payload: metadatas,
  });
};
