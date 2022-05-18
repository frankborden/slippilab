import { parseGameSettings } from "./parser/parser";

onmessage = async event => {
  postMessage({
    id: event.data.id,
    payload: (
      await Promise.all(
        event.data.payload.map((file: File) => file.arrayBuffer())
      )
    ).map(buffer => {
      try {
        return parseGameSettings(buffer);
      } catch (e) {
        return undefined;
      }
    }),
  });
};
