import { decode } from "@shelacek/ubjson";

import { stages } from "../common/names";
import { type ReplayStub } from "../common/types";
import { parseReplay, parseStub } from "../parser";

// Accepts an array of File objects. Emits progress events followed by an event
// with the date-sorted stubs,file pairs. Replays with non-tournament stages or
// custom characters are filtered out.
self.onmessage = async (event) => {
  const stubs: [ReplayStub, File][] = [];
  for (let i = 0; i < event.data.length; i++) {
    const file = event.data[i] as File;

    // Only reading the first bit of the file saves a ton of time, but misses
    // the start timestamp that lies at the end of the file. We guess the start
    // timestamp based on the filename.
    const reader = new FileReader();
    reader.readAsArrayBuffer(file.slice(0, 2000));
    await new Promise((resolve) => (reader.onload = resolve));
    let stubWithoutStartTimestampAndSlug:
      | Omit<ReplayStub, "startTimestamp" | "slug">
      | undefined = undefined;
    try {
      if (file.name.endsWith(".slp")) {
        stubWithoutStartTimestampAndSlug = parseStub(
          reader.result as ArrayBuffer,
        );
      }
    } catch (e) {
      console.error(`Error parsing file ${file.name}`, e);
      continue;
    }

    let startTimestamp: string;
    if (
      stubWithoutStartTimestampAndSlug !== undefined &&
      stages[stubWithoutStartTimestampAndSlug.stageId] !== undefined &&
      stubWithoutStartTimestampAndSlug.players.every(
        (p) => p.externalCharacterId <= 25,
      )
    ) {
      // if file is like Game_8C56C529AEAA_20230519T093306.slp or Game_20230519T093306.slp
      const fileMatch =
        /Game.*_(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).slp/.exec(
          file.name,
        );
      if (fileMatch) {
        // construct ISO 8601 timestamp string
        const date = `${fileMatch[1]}-${fileMatch[2]}-${fileMatch[3]}T${fileMatch[4]}:${fileMatch[5]}:${fileMatch[6]}`;
        startTimestamp = date;
      } else {
        // the file name has been changed, so we must read the whole file.
        const { raw, metadata } = decode(await file.arrayBuffer(), {
          useTypedArrays: true,
        });
        const replay = parseReplay(metadata, raw);
        startTimestamp = replay.settings.startTimestamp;
      }
      const stub = {
        ...stubWithoutStartTimestampAndSlug,
        startTimestamp,
        slug: `local-${file.name}`,
      };
      stubs.push([stub, file]);
    }
    self.postMessage({ progress: 100 * ((i + 1) / event.data.length) });
  }
  stubs.sort((a, b) => {
    if (a[0].startTimestamp < b[0].startTimestamp) {
      return 1;
    }
    return -1;
  });
  self.postMessage({ stubs });
};
