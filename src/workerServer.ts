const worker = new Worker(new URL("./workerClient.ts", import.meta.url), {
  type: "module",
});
const resolvers = new Map<number, (data: any) => void>();
let nextId = 0;
const newId = () => nextId++;
export function send<P, R>(payload: P): Promise<R> {
  return new Promise(resolve => {
    const id = newId();
    resolvers.set(id, resolve);
    worker.postMessage({ id, payload });
  });
}
worker.onmessage = event => resolvers.get(event.data.id)!(event.data.payload);
