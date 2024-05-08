import { Label, Tab, TabList, Tabs } from "react-aria-components";

export default function Page() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-medium tracking-tight">Replays</h1>
      <Label className="text-sm">Source</Label>
      <Tabs>
        <TabList className="selected:*:bg-blue-600 selected:*:text-white inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 p-2 *:rounded *:px-2 *:py-1">
          <Tab id="local">My Computer</Tab>
          <Tab id="cloud">Slippi Lab</Tab>
          <Tab id="events">Tournaments</Tab>
        </TabList>
      </Tabs>
    </>
  );
}
