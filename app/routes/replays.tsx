import { useRef } from "react";
import {
  Button,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Tab,
  TabList,
  Tabs,
  Tag,
  TagGroup,
  TagList,
  Toolbar,
} from "react-aria-components";

import { ReplayStub, ReplayType } from "~/common/types";
import { useFileStore } from "~/stores/fileStore";

const tabs = [
  { label: "My Computer", id: "local" },
  { label: "Slippi Lab", id: "cloud" },
  { label: "Tournaments", id: "events" },
];

const tags = ["Falco", "Battlefield"];

const typeIcons: Record<ReplayType, string> = {
  ranked: "i-tabler-trophy",
  unranked: "i-tabler-globe",
  direct: "i-tabler-route",
  "old online": "i-tabler-globe",
  offline: "i-tabler-armchair",
};

export default function Page() {
  const loadFiles = useFileStore((store) => store.loadFiles);
  const stubs = useFileStore((store) => store.stubs);
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <h1 className="mb-4 text-2xl font-medium tracking-tight">Replays</h1>
      <div className="mb-8 flex items-center justify-between gap-2">
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
          <MenuTrigger>
            <Button className="flex cursor-default items-center gap-1 rounded border border-gray-300 bg-gray-100 py-0.5 pl-1 pr-2 hover:bg-gray-200">
              <div className="i-tabler-plus" />
              <div>Add Files</div>
            </Button>
            <Popover placement="bottom right">
              <Menu
                className="rounded border border-gray-300 bg-white shadow"
                autoFocus="first"
              >
                <MenuItem
                  onAction={() => folderInput.current?.click()}
                  className="select-none rounded px-2 py-1 focus:bg-gray-100 focus:outline-none"
                >
                  Open Folder
                </MenuItem>
                <MenuItem
                  onAction={() => fileInput.current?.click()}
                  className="select-none rounded px-2 py-1 focus:bg-gray-100 focus:outline-none"
                >
                  Open File
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
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
      {stubs.length === 0 ? (
        <div className="flex w-[calc(13rem+38ch)] flex-col items-center p-8">
          <div className="i-ph-folder-open-thin text-5xl" />
          <div className="text-lg">No replays</div>
        </div>
      ) : (
        <ListBox
          selectionMode="single"
          className="divide-y divide-gray-300 rounded border border-gray-300"
        >
          {stubs.map(([stub]) => (
            <Row stub={stub} />
          ))}
        </ListBox>
      )}
      <input
        ref={fileInput}
        type="file"
        accept=".slp"
        multiple
        className="hidden"
        onInput={(e) => loadFiles([...(e.target as HTMLInputElement).files!])}
      />
      <input
        ref={folderInput}
        type="file"
        // @ts-ignore webkit
        webkitdirectory=""
        className="hidden"
        onInput={(e) => loadFiles([...(e.target as HTMLInputElement).files!])}
      />
    </>
  );
}

function Row({ stub }: { stub: ReplayStub }) {
  return (
    <ListBoxItem
      key={Math.random()}
      className="flex cursor-default items-center gap-4 px-4 py-2 text-sm first:rounded-t last:rounded-b hover:bg-gray-100"
    >
      <div className="w-[8ch]">
        <div>
          {new Date(stub.startTimestamp).toLocaleDateString("en-us", {
            dateStyle: "short",
          })}
        </div>
        <div>
          {new Date(stub.startTimestamp).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className={`${typeIcons[stub.type]} size-6`} />
        <div className="w-[6ch] overflow-x-hidden text-center capitalize">
          {stub.type}
        </div>
      </div>
      <img
        src={`/stages/${stub.stageId}.png`}
        className="h-12 rounded border border-gray-400"
      />
      {stub.players.map((player) => (
        <div className="flex items-center gap-2">
          <img
            src={`/stockicons/${player.externalCharacterId}/${player.costumeIndex}.png`}
            className="size-6"
          />
          <div className="*:text-start">
            <div className="w-[12ch] overflow-x-hidden text-ellipsis whitespace-nowrap text-base">
              {player.displayName ??
                player.nametag ??
                `Player ${player.playerIndex + 1}`}
            </div>
            <div className="font-mono text-gray-500">{player.connectCode}</div>
          </div>
        </div>
      ))}
    </ListBoxItem>
  );
}
