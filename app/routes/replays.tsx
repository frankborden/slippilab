import {
  Button,
  Tab,
  TabList,
  Tabs,
  Tag,
  TagGroup,
  TagList,
} from "react-aria-components";

const tabs = [
  { label: "My Computer", id: "local" },
  { label: "Slippi Lab", id: "cloud" },
  { label: "Tournaments", id: "events" },
];

const tags = ["Falco", "Battlefield"];

export default function Page() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-medium tracking-tight">Replays</h1>
      <div className="mb-2 flex items-center justify-between gap-2">
        <Tabs>
          <TabList className="inline-flex cursor-default items-center rounded border border-gray-300 bg-gray-100 outline-2 -outline-offset-2 has-[:focus]:outline">
            {tabs.map((tab) => (
              <Tab
                id={tab.id}
                className="selected:bg-blue-600 selected:text-white whitespace-nowrap px-2 py-0.5 tracking-tight first:rounded-l-[3px] last:rounded-r-[3px] hover:bg-gray-200 focus:outline-none"
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Button className="flex cursor-default items-center gap-0.5 rounded border border-gray-300 bg-gray-100 py-0.5 pl-1 pr-2 hover:bg-gray-200">
          <div className="i-tabler-plus" />
          <div>Filter</div>
        </Button>
      </div>
      <TagGroup>
        <TagList className="mb-2 flex flex-wrap items-center gap-1 text-sm">
          {tags.map((tag) => (
            <Tag className="flex items-center rounded border border-gray-300 bg-gray-100 pl-1 has-[button:hover]:bg-gray-200">
              <div>{tag}</div>
              <Button
                slot="remove"
                className="flex cursor-default rounded-r-[3px] p-1"
              >
                <div className="i-tabler-x size-3" />
              </Button>
            </Tag>
          ))}
        </TagList>
      </TagGroup>
      <div className="grid grid-cols-[repeat(5,auto)] justify-start gap-x-12">
        <div className="col-span-full mb-1 grid grid-cols-subgrid items-center border-b border-gray-300 px-4 text-sm font-medium text-gray-600 *:text-center">
          <div>Stage</div>
          <div>Type</div>
          <div>Date</div>
          <div>Player 1</div>
          <div>Player 2</div>
        </div>
        <Button className="col-span-full grid cursor-default grid-cols-subgrid items-center rounded px-4 py-2 text-sm hover:bg-gray-100">
          <img
            src="/stages/3.png"
            className="h-12 rounded border border-gray-400"
          />
          <div>
            <div className=" i-tabler-route size-6" />
            <div>Direct</div>
          </div>
          <div>
            <div>{new Date().toLocaleDateString("en-us")}</div>
            <div>{new Date().toLocaleTimeString("en-us")}</div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/stockicons/19/0.png" className="size-6" />
            <div className="*:text-start">
              <div className="text-base">Jmook</div>
              <div className="font-mono text-gray-500">JMOOK#0</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/stockicons/20/0.png" className="size-6" />
            <div className="*:text-start">
              <div className="text-base">Mang0</div>
              <div className="font-mono text-gray-500">MANG#0</div>
            </div>
          </div>
        </Button>
        <Button className="col-span-full grid cursor-default grid-cols-subgrid items-center rounded px-4 py-2 text-sm hover:bg-gray-100">
          <img
            src="/stages/8.png"
            className="h-12 rounded border border-gray-400"
          />
          <div>
            <div className="i-tabler-trophy size-6" />
            <div>Ranked</div>
          </div>
          <div>
            <div>{new Date().toLocaleDateString("en-us")}</div>
            <div>{new Date().toLocaleTimeString("en-us")}</div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/stockicons/9/1.png" className="size-6" />
            <div className="*:text-start">
              <div className="text-base">Zain</div>
              <div className="font-mono text-gray-500">ZAIN#0</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/stockicons/2/3.png" className="size-6" />
            <div className="*:text-start">
              <div className="text-base">Cody</div>
              <div className="font-mono text-gray-500">IBDW#0</div>
            </div>
          </div>
        </Button>
      </div>
    </>
  );
}
