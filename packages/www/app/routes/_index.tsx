import { ReplayType, charactersExt, stages } from "@slippilab/common";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  FileTrigger,
  Key,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
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

const typeIcons: Record<ReplayType, string> = {
  ranked: "i-tabler-trophy",
  unranked: "i-tabler-globe",
  direct: "i-tabler-route",
  "old online": "i-tabler-globe",
  offline: "i-tabler-armchair",
};

export default function Page() {
  const { loadFiles, stubs, filters, setFilters, page, setPage } =
    useFileStore();
  const [tab, setTab] = useState<Key>("cloud");
  const [filterCharacters, setFilterCharacters] = useState<Key[]>(
    filters.filter((f) => f.type === "character").map((f) => f.value),
  );
  const [filterStages, setFilterStages] = useState<Key[]>(
    filters.filter((f) => f.type === "stage").map((f) => f.value),
  );

  const filteredStubs = stubs.filter(([stub]) => {
    const allowedStages = filters
      .filter((f) => f.type === "stage")
      .map((f) => Number(f.value));
    if (allowedStages.length > 0 && !allowedStages.includes(stub.stageId)) {
      return false;
    }

    const neededCharacters = filters
      .filter((f) => f.type === "character")
      .map((f) => Number(f.value));
    if (
      neededCharacters.length > 0 &&
      neededCharacters.some(
        (c) => !stub.players.some((p) => p.externalCharacterId === c),
      )
    ) {
      return false;
    }

    return true;
  });

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
          className="inline-flex items-center rounded border border-gray-300 bg-white"
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
      <div className="mx-auto w-[calc(13rem+38ch)]">
        <div className="mb-2 flex items-end justify-between">
          <TagGroup aria-label="filters">
            <TagList className="flex flex-wrap items-center gap-1 text-sm">
              {filters.map((filter) => (
                <Tag
                  key={`${filter.type}-${filter.value}`}
                  textValue={filter.value}
                  className="flex select-none items-center rounded border border-gray-300 bg-gray-100 px-2 has-[button:hover]:bg-gray-200"
                >
                  <div>
                    {filter.type === "character"
                      ? charactersExt[filter.value]
                      : stages[filter.value]}
                  </div>
                </Tag>
              ))}
            </TagList>
          </TagGroup>
          <div className="flex gap-2">
            <DialogTrigger>
              <Button className="rounded border border-gray-300 bg-gray-100 px-2 hover:bg-gray-200">
                Filter
              </Button>
              <ModalOverlay
                isDismissable
                className="fixed inset-0 z-10 grid place-items-center bg-black/10"
              >
                <Modal className="rounded border border-gray-300 bg-white px-8 py-4 shadow">
                  <Dialog className="outline-none">
                    {({ close }) => (
                      <>
                        <div className="mb-4 text-xl font-medium tracking-tight">
                          Replay filters
                        </div>
                        <div className="mb-1 font-medium tracking-tight">
                          Stage
                        </div>
                        <ListBox
                          selectedKeys={filterStages}
                          onSelectionChange={(keys) => {
                            if (keys === "all") return;
                            setFilterStages([...keys.values()]);
                          }}
                          className="mb-4 grid grid-cols-[auto,auto,auto] justify-center gap-2"
                          layout="grid"
                          selectionMode="multiple"
                        >
                          {[8, 2, 3, 31, 32, 28].map((stageId) => (
                            <ListBoxItem id={stageId} className="relative">
                              {({ isSelected }) => (
                                <>
                                  <img
                                    src={`/stages/${stageId}.png`}
                                    className="h-20 rounded border border-gray-300"
                                  />
                                  {isSelected && (
                                    <div className="absolute inset-0 z-10 grid place-items-center rounded bg-emerald-600/50">
                                      <div className="i-tabler-check size-10 text-white" />
                                    </div>
                                  )}
                                </>
                              )}
                            </ListBoxItem>
                          ))}
                        </ListBox>
                        <div className="mb-1 font-medium tracking-tight">
                          Character
                        </div>
                        <ListBox
                          selectedKeys={filterCharacters}
                          onSelectionChange={(keys) => {
                            if (keys === "all") return;
                            setFilterCharacters([...keys.values()]);
                          }}
                          layout="grid"
                          className="mb-4 grid grid-cols-9 gap-1"
                          selectionMode="multiple"
                        >
                          {[
                            22, 8, 7, 5, 12, 17, 1, 0, 25, 20, 2, 11, 14, 4, 16,
                            19, 6, 21, 24, 13, 15, 10, 3, 9, 23, 18,
                          ].map((characterId) => (
                            <ListBoxItem
                              id={characterId}
                              className={`relative p-1 ${characterId === 24 ? "col-start-2" : ""}`}
                            >
                              {({ isSelected }) => (
                                <>
                                  <img
                                    src={`/stockicons/${characterId}/0.png`}
                                    className="h-8"
                                  />
                                  {isSelected && (
                                    <div className="absolute inset-0 z-10 grid place-items-center rounded bg-emerald-600/75">
                                      <div className="i-tabler-check size-6 text-white" />
                                    </div>
                                  )}
                                </>
                              )}
                            </ListBoxItem>
                          ))}
                        </ListBox>
                        <div className="flex justify-end gap-2">
                          <Button
                            onPress={close}
                            className="rounded px-2 hover:bg-gray-100"
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setFilters([
                                ...filterCharacters.map((value) => ({
                                  type: "character" as const,
                                  value: value.toString(),
                                })),
                                ...filterStages.map((value) => ({
                                  type: "stage" as const,
                                  value: value.toString(),
                                })),
                              ]);
                              setPage(0);
                              close();
                            }}
                            className="rounded bg-emerald-600 px-2 py-0.5 text-white hover:bg-emerald-600/90"
                          >
                            Apply
                          </Button>
                        </div>
                      </>
                    )}
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
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
        {filteredStubs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded border border-gray-300 p-12">
            <div className="i-tabler-folder-x text-4xl text-gray-500" />
            <div className="text-lg font-medium tracking-tight text-gray-500">
              No replays
            </div>
          </div>
        ) : (
          <>
            <ListBox
              aria-label="Replays"
              items={filteredStubs.slice(page * 10, page * 10 + 10)}
              selectionMode="single"
              className="mb-1 divide-y divide-gray-300 rounded border border-gray-300"
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
            <div className="grid grid-cols-[auto,auto,1fr,auto,auto] items-center gap-x-4 [&>button>div]:size-6 [&>button]:size-6 [&>button]:rounded hover:[&>button]:bg-gray-100 disabled:[&>button]:text-gray-400">
              <Button isDisabled={page === 0} onPress={() => setPage(0)}>
                <div className="i-tabler-chevron-left-pipe" />
              </Button>
              <Button isDisabled={page === 0} onPress={() => setPage(page - 1)}>
                <div className="i-tabler-chevron-left" />
              </Button>
              <div className="text-center">
                Page {page + 1} of {Math.ceil(filteredStubs.length / 10)}
              </div>
              <Button
                isDisabled={page === Math.ceil(filteredStubs.length / 10) - 1}
                onPress={() => setPage(page + 1)}
              >
                <div className="i-tabler-chevron-right" />
              </Button>
              <Button
                isDisabled={page === Math.ceil(filteredStubs.length / 10) - 1}
                onPress={() =>
                  setPage(Math.ceil(filteredStubs.length / 10) - 1)
                }
              >
                <div className="i-tabler-chevron-right-pipe" />
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
