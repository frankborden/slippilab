import { ReplayType } from "@slippilab/common";
import { motion } from "framer-motion";
import {
  Button,
  FileTrigger,
  ListBox,
  ListBoxItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
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

const typeIcons: Record<ReplayType, string> = {
  ranked: "i-tabler-trophy",
  unranked: "i-tabler-globe",
  direct: "i-tabler-route",
  "old online": "i-tabler-globe",
  offline: "i-tabler-armchair",
};

export default function Page() {
  const { loadFiles, stubs, filters, page } = useFileStore();

  return (
    <main>
      <Tabs
        defaultSelectedKey="cloud"
        className="mb-2 grid grid-cols-[1fr,auto,1fr] items-center"
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
        <div className="justify-self-end">
          <TabPanel id="local">
            <FileTrigger
              acceptDirectory
              onSelect={(list) => list && loadFiles([...list])}
            >
              <Button className="rounded bg-emerald-600 px-2 text-white hover:bg-emerald-600/90">
                Open Folder
              </Button>
            </FileTrigger>
          </TabPanel>
        </div>
      </Tabs>
      <div>
        <ListBox
          aria-label="Replays"
          items={stubs.slice(0, 10)}
          selectionMode="single"
          className="mx-auto w-max divide-y divide-gray-300 rounded border border-gray-300"
        >
          {([stub]) => (
            <ListBoxItem
              id={stub.slug}
              className="flex items-center gap-4 px-4 py-2 text-sm first:rounded-t last:rounded-b hover:bg-gray-100"
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
                    <div className="font-mono text-gray-500">
                      {player.connectCode}
                    </div>
                  </div>
                </div>
              ))}
            </ListBoxItem>
          )}
        </ListBox>
      </div>
    </main>
  );
}
