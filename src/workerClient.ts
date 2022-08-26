import { GameSettings } from "~/common/types";
import MyWorker from "./worker?worker";

const worker = new MyWorker();
const callbacks = new Map<number, () => void>();
const resolvers = new Map<number, (data: any) => void>();
let nextId = 0;
const newId = (): number => nextId++;
export async function send<P, R>(
  payload: P,
  onProgress: () => void
): Promise<R> {
  return await new Promise((resolve) => {
    const id = newId();
    resolvers.set(id, resolve);
    callbacks.set(id, onProgress);
    worker.postMessage({ id, payload });
  });
}
worker.onmessage = (event) => {
  if ((event.data.payload as Payload) !== undefined) {
    resolvers.get(event.data.id)?.(event.data.payload);
  } else {
    // progress
    callbacks.get(event.data.id)?.();
  }
};

type Payload =
  | {
      goodFilesAndSettings: Array<[File, GameSettings]>;
      skipCount: number;
      failedFilenames: string[];
    }
  | undefined;
