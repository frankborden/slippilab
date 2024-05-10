import {
  Button,
  ListBox,
  ListBoxItem,
  Tab,
  TabList,
  Tabs,
  Tag,
  TagGroup,
  TagList,
  Toolbar,
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
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Tabs>
          <TabList className="inline-flex cursor-default items-center rounded border border-gray-300 bg-gray-100 outline-2 -outline-offset-2 has-[:focus]:outline">
            {tabs.map((tab) => (
              <Tab className="whitespace-nowrap px-2 py-0.5 tracking-tight first:rounded-l-[3px] last:rounded-r-[3px] hover:bg-gray-200 focus:outline-none selected:bg-emerald-600 selected:text-white">
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <Toolbar className="flex items-center gap-1">
          <Button className="flex cursor-default items-center gap-1 rounded border border-gray-300 bg-gray-100 py-0.5 pl-1 pr-2 hover:bg-gray-200">
            <div className="i-ph-funnel-simple-bold" />
            <div>Filter</div>
          </Button>
          <Button className="flex cursor-default items-center gap-1 rounded border border-gray-300 bg-gray-100 py-0.5 pl-1 pr-2 hover:bg-gray-200">
            <div className="i-tabler-plus" />
            <div>Add Files</div>
          </Button>
        </Toolbar>
      </div>
      <TagGroup>
        <TagList className="mb-2 flex flex-wrap items-center gap-1 text-sm">
          {tags.map((tag, i) => (
            <Tag className="flex select-none items-center rounded border border-gray-300 bg-gray-100 pl-1 has-[button:hover]:bg-gray-200">
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
      <ListBox selectionMode="single">
        <ListBoxItem className="flex items-center gap-4 rounded px-4 py-2 text-sm hover:bg-gray-100">
          <div>
            <div>
              {new Date().toLocaleDateString("en-us", {
                dateStyle: "short",
              })}
            </div>
            <div>
              {new Date().toLocaleTimeString("en-us", {
                timeStyle: "short",
              })}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className=" i-tabler-trophy size-6" />
            <div className="w-[8ch] overflow-x-hidden text-center">
              Unranked
            </div>
          </div>
          <img
            src="/stages/31.png"
            className="h-10 rounded border border-gray-400"
          />
          <div className="flex items-center gap-2">
            <img src="/stockicons/2/3.png" className="size-6" />
            <div className="*:text-start">
              <div className="w-[20ch] overflow-x-hidden text-ellipsis whitespace-nowrap text-base">
                Cody on a Wednesday
              </div>
              <div className="font-mono text-gray-500">IBDW#0</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/stockicons/9/1.png" className="size-6" />
            <div className="*:text-start">
              <div className="w-[20ch] overflow-x-hidden text-ellipsis whitespace-nowrap text-base">
                Zain
              </div>
              <div className="font-mono text-gray-500">ZAIN#0</div>
            </div>
          </div>
        </ListBoxItem>
      </ListBox>
    </>
  );
}
