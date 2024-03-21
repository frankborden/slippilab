import { store } from "~/store";

export function HUD() {
  const { replay, frame } = store();
  return (
    <>
      <div className="absolute left-0 top-1 flex w-full justify-center text-2xl text-white">
        {timer(frame)}
      </div>
      <div className="absolute bottom-1 left-0 grid w-full grid-cols-4 text-white">
        {replay?.settings.playerSettings.map((settings) => (
          <div
            key={settings.playerIndex}
            className="flex flex-col items-center"
            style={{
              gridColumnStart: settings.playerIndex + 1,
              WebkitTextStroke: "0.1px black",
            }}
          >
            <div className="flex">
              {[
                ...Array(
                  replay.frames[frame].players[settings.playerIndex].state
                    .stocksRemaining,
                ).keys(),
              ].map((i) => (
                <img
                  key={i}
                  src={`/stockicons/${settings.externalCharacterId}/0.png`}
                  className="size-6"
                />
              ))}
            </div>
            <div
              className="grid grid-cols-[1fr_auto_1fr] items-baseline font-bold"
              style={{
                color: ["#ffbbbb", "#bbbbff", "#ffffbb", "#bbffbb"][
                  settings.playerIndex
                ],
              }}
            >
              <div className="col-start-2 text-3xl">
                {replay.frames[frame].players[settings.playerIndex].state
                  .actionStateId <= 10 // Dead.*
                  ? 0
                  : Math.round(
                      replay.frames[frame].players[settings.playerIndex].state
                        .percent,
                    )}
              </div>
              <div className="col-start-3 text-xl">%</div>
            </div>
            <div className="text-xl">{settings.displayName}</div>
          </div>
        ))}
      </div>
    </>
  );
}

const meleeHundredths = [
  "00",
  "02",
  "04",
  "06",
  "07",
  "09",
  "11",
  "12",
  "14",
  "16",
  "17",
  "19",
  "21",
  "22",
  "24",
  "26",
  "27",
  "29",
  "31",
  "32",
  "34",
  "36",
  "37",
  "39",
  "41",
  "42",
  "44",
  "46",
  "47",
  "49",
  "51",
  "53",
  "54",
  "56",
  "58",
  "59",
  "61",
  "63",
  "64",
  "66",
  "68",
  "69",
  "71",
  "73",
  "74",
  "76",
  "78",
  "79",
  "81",
  "83",
  "84",
  "86",
  "88",
  "89",
  "91",
  "93",
  "94",
  "96",
  "98",
  "99",
];

function timer(frame: number) {
  const frames = Math.min(60 * 60 * 8, 60 * 60 * 8 - frame + 123);
  const minutes = Math.floor(frames / (60 * 60))
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((frames % (60 * 60)) / 60)
    .toString()
    .padStart(2, "0");
  const hundredths = meleeHundredths[frames % 60];
  return `${minutes}:${seconds}:${hundredths}`;
}
