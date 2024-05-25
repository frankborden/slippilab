import { ReplayType } from "@slippilab/common";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Button,
  FileTrigger,
  Key,
  ListBox,
  ListBoxItem,
  Tab,
  TabList,
  Tabs,
  Tag,
  TagGroup,
  TagList,
} from "react-aria-components";

import { useFileStore } from "~/stores/fileStore";

const tabs = [
  {
    name: "Slippi Lab",
    id: "cloud",
  },
  {
    name: "My Computer",
    id: "local",
  },
  {
    name: "Tournaments",
    id: "events",
  },
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
  const { loadFiles, stubs, filters, page, setPage } = useFileStore();
  const [tab, setTab] = useState<Key>("cloud");

  return (
    <main>
      <Tabs
        defaultSelectedKey="cloud"
        selectedKey={tab}
        onSelectionChange={setTab}
        className="mb-6 grid grid-cols-[1fr,auto,1fr] items-center"
      >
        <h1 className="text-2xl font-medium tracking-tight">Replays</h1>
        <TabList
          className="inline-flex items-center gap-1 bg-white"
          items={tabs}
        >
          {(tab) => (
            <Tab className="relative select-none whitespace-nowrap rounded px-2 outline-none hover:bg-gray-100">
              {({ isSelected }) => (
                <>
                  {tab.name}
                  {isSelected && (
                    <>
                      <motion.span
                        layoutId="tabs-invert"
                        className="absolute inset-0 z-10 rounded bg-white mix-blend-difference"
                        transition={{
                          type: "tween",
                          duration: 0.1,
                        }}
                      />
                      <motion.span
                        layoutId="tabs-color"
                        className="absolute inset-0 z-20 bg-emerald-600 mix-blend-lighten"
                        transition={{
                          type: "tween",
                          duration: 0.1,
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </Tab>
          )}
        </TabList>
      </Tabs>
      <div className="mx-auto w-max">
        <div className="mb-2 flex items-end justify-between">
          <TagGroup aria-label="filters">
            <TagList className="flex flex-wrap items-center gap-1 text-sm">
              {tags.map((tag, i) => (
                <Tag
                  key={`${tag}-${i}`}
                  textValue={tag}
                  className="flex select-none items-center rounded border border-gray-300 bg-gray-100 pl-1 has-[button:hover]:bg-gray-200"
                >
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
          <div className="flex gap-2">
            <Button className="rounded border border-gray-300 bg-gray-100 px-2 hover:bg-gray-200">
              Filter
            </Button>
            {tab === "local" && (
              <FileTrigger
                acceptDirectory
                onSelect={(list) => list && loadFiles([...list])}
              >
                <Button className="rounded bg-emerald-600 px-2 text-white hover:bg-emerald-600/90">
                  Open
                </Button>
              </FileTrigger>
            )}
          </div>
        </div>
        {stubs.length === 0 ? (
          <div className="flex w-[calc(13rem+38ch)] flex-col items-center p-8">
            <div className="i-ph-folder-open-thin text-5xl" />
            <div className="text-lg">No replays</div>
          </div>
        ) : (
          <>
            <ListBox
              aria-label="Replays"
              items={stubs.slice(page * 10, page * 10 + 10)}
              selectionMode="single"
              className="mb-2 divide-y divide-gray-300 rounded border border-gray-300"
            >
              {([stub]) => (
                <ListBoxItem
                  id={stub.slug}
                  textValue={stub.slug}
                  className="flex items-center gap-4 px-4 py-2 text-sm first:rounded-t last:rounded-b hover:bg-gray-100"
                >
                  <div className="w-[8ch]">
                    <div>
                      {new Date(stub.startTimestamp).toLocaleDateString(
                        "en-us",
                        {
                          dateStyle: "short",
                        },
                      )}
                    </div>
                    <div>
                      {new Date(stub.startTimestamp).toLocaleTimeString(
                        "en-us",
                        {
                          timeStyle: "short",
                        },
                      )}
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
                    <div
                      key={player.playerIndex}
                      className="flex items-center gap-2"
                    >
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
                        <div className="font-mono text-gray-500">
                          {player.connectCode}
                        </div>
                      </div>
                    </div>
                  ))}
                </ListBoxItem>
              )}
            </ListBox>
            <div className="grid grid-cols-[auto,auto,1fr,auto,auto] items-center gap-x-4 [&>button]:size-6 [&>button]:rounded hover:[&>button]:bg-gray-100 disabled:[&>button]:text-gray-400">
              <Button isDisabled={page === 0} onPress={() => setPage(0)}>
                <div className="i-tabler-chevron-left-pipe size-6" />
              </Button>
              <Button isDisabled={page === 0} onPress={() => setPage(page - 1)}>
                <div className="i-tabler-chevron-left size-6" />
              </Button>
              <div className="text-center">
                Page {page + 1} of {Math.ceil(stubs.length / 10)}
              </div>
              <Button
                isDisabled={page === Math.ceil(stubs.length / 10) - 1}
                onPress={() => setPage(page + 1)}
              >
                <div className="i-tabler-chevron-right size-6" />
              </Button>
              <Button
                isDisabled={page === Math.ceil(stubs.length / 10) - 1}
                onPress={() => setPage(Math.ceil(stubs.length / 10) - 1)}
              >
                <div className="i-tabler-chevron-right-pipe size-6" />
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
