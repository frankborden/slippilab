import { OpenMenu } from "~/components/common/OpenMenu";
import colors from "tailwindcss/colors";
import { GitHubIcon, SlippiLab, TwitterIcon } from "~/components/common/icons";

export function Landing() {
  return (
    <div
      class="box-border grid h-screen grid-cols-[0_auto_0] grid-rows-[0_auto_min-content] bg-[length:30px_30px] p-4 md:grid-cols-3 md:grid-rows-[1fr_auto_1fr]"
      style={{
        "grid-template-areas": `
          ".      .      ."
          "falco  logo   fox"
          "footer footer footer"
        `,
        "background-image": `
          linear-gradient(lightblue 1px, transparent 1px),
          linear-gradient(90deg, lightblue 1px, transparent 1px)
        `,
      }}
    >
      <div class="hidden md:block" style={{ "grid-area": "falco" }}>
        <svg class="aspect-square" viewBox="-14 -20 30 19">
          <radialGradient id="fill-red" r="1">
            <stop stop-color={colors.red["700"]}>
              <animate
                dur="0.5s"
                begin="1.35s"
                attributeName="offset"
                fill="freeze"
                from="0"
                to="1"
              />
            </stop>
            <stop stop-color="transparent">
              <animate
                dur="0.5s"
                begin="1.35s"
                attributeName="offset"
                fill="freeze"
                from="0"
                to="1"
              />
            </stop>
          </radialGradient>
          <path
            transform="scale(-.1 .1) translate(-500 -500)"
            class="flex-grow animate-draw stroke-red-800 stroke-[3]"
            stroke-dasharray="1000"
            stroke-dashoffset="1000"
            fill="url(#fill-red)"
            d="m461.65 371.3.35-.3.65.3 6.15 2.35 7.2 3.85.65-7.85 1.15-3.65 2.85-3 3.15-1.5 5.2-.35-1.2-5 .85-3.35.65-2.3 4.35-5.5 8.65-5.5 2.85-2.35 1.85-2.85 1 1.7.65 3.8 4.85-3.5 3.15-3.5 4.35-6.5.8 5.35-.3 6.65-2 6.85 4.65-2.5 4.65-5.5V343l-1.15 6.5-2.65 6 1.15.3 3.5-.8-.5 5.15-1.85 4-1.15 2.35-4.65 6.15-1.5 5.15 10.5 1 2.5.85.3.15-1 1.2v.15L526 393.3l2 1.7 4.3 1.3 1.2 1.85.3 1.85-.3 1.15 1.5 2 .3 1.5 2.5 2.5v1l.5.15 4.85 2.5 6.65 1.85 9.5 4-.15 1v.15l-1.15 2 3.8 1.85 6.5 5 6.2 3.35 3.8 4.3 1.35 2.35-1.15.85-.85-.2-5-2.3.5 3.15-1.35.65-1-.65-4.8-3.85 1.15 4.7-1 3.15L564 442l-.85-.85-1.5-2.65-.35-1.7-.65-.3-1.15-.2-1.2-2.3-1-.85-3-2.5-1.8-.5-2.2 4.5-.3.35-.5-.5-17.7-14.35-4-5.35-1.5-.3-1.15-1-7 3-1 3.3-1.5.2-1.35 2.8-3 .5 1.5.5 5.85 1.7 2.15 1.3.35.5-2.15.7 9 3.65 1.65 1.15-.5.2-20.85-6-2.3 2.5 8.8 5.3 5 3.85 2.7 1.15 1.8 1.85.35 1 2 2.85-.5 1.8L528 450l.5 2.3.65.7h.65l1.2-.85h1.5l1.65 1.35 1.15 1.15V456l9 5 3.5 3.65 1.85 1.5 3.85 4.65 1 3.2.15 2.65-.5.15H554l-1.35 2.2-2.15 1.3.3.5h-2.15l-4.85-2-4.5-3.8-4.5-3.85-6.65-7-.85.5-1.5-.15-2.15-2-.35-1.7 1.2-1.5-1.85-1.15-2.85-.85-1.65-1.3H516l-2.5-.35-2.7-2.5-2-.85-2-2-.5-.15-.5-.65-3-2.2-11.65-13.3-2.35 1.5-2.5.8.5-6.8-19.15-4.85-8.15-3-5-.85-2.7-2.8-.3-.5-.5-.5.15-.35V416l-4.65-.7-5.35-1.8-3-2.2-9.5-4.15-1.5 2.5-1.15.35-3.35-1-.65-.85v-1.65l-7.35-1-8-2.5-3.35-1.2-3.5-2.5-.65-1.8-.15-.35.8.15.2-3 1-1.3v-.2l.15-.15v-.15l-.65-.2.5-.65 3.5-2 5.3.35 4.7 1.15.5.15.5.2 9.5 5.3 1.5-.8.5.15 3.15.85.65 1-.3 2.65.5.65 6.8 1.2 4.85-.85 4.85.35 3.65 1.15 3 2.15.65-1.8h6.5l3.2.65 19.5 8.35v-.7l1.65-.8-.15-.35-1.85-2.85-.15-.5.8-1 .5-.8v-.2l-.15-.65v-.5l-.5-.65 2.65-6.2-1.15-.8-.5-.2-2.65-.8-1.85-2-3.15-.2-1-.15-.85-.15h-.5l-.35-.2h-.65l-.35-.15-.8-.15-1.85-.35h-.35l-5-.5-4.15-1.15-5.85-.5h-.5v-.5l.85-2.7-9.85 4.2-3 .3-1.3-.8v-2.2l2.5-1.8-1.35-1.35-2.5-5.65.5-1 6-5.35 1.35-1 11.8 2.35 1.35-3.2m21.85 7-2.85 1.7 5.65 3 4.35.65 1.5 1.35.35.15 5-.85v-.15l.3-.15-3.3-2.35-9 .5 2.3-1.15-2.65-.85-1.65-1.85m-37 4.85-1.2-1.5.5 3.85 2.2-1.5-1.5-.85"
          />
        </svg>
      </div>
      <div
        class="flex flex-col items-center justify-center gap-20"
        style={{ "grid-area": "logo" }}
      >
        <div class="flex flex-col items-center gap-2">
          <img class="w-64" src="logo.png" />
          <SlippiLab class="max-w-[75vw]" title="logo" />
        </div>
        <OpenMenu name="Start" />
      </div>
      <div class="hidden md:block" style={{ "grid-area": "fox" }}>
        <svg class="aspect-square" viewBox="-16 -24 30 29">
          <radialGradient id="fill-blue" r="1">
            <stop stop-color={colors.blue["700"]}>
              <animate
                dur="0.5s"
                begin="1.35s"
                attributeName="offset"
                fill="freeze"
                from="0"
                to="1"
              />
            </stop>
            <stop stop-color="transparent">
              <animate
                dur="0.5s"
                begin="1.35s"
                attributeName="offset"
                fill="freeze"
                from="0"
                to="1"
              />
            </stop>
          </radialGradient>
          <path
            transform="scale(-.1 .1) translate(-500 -500)"
            class="animate-draw stroke-blue-800 stroke-[3]"
            stroke-dasharray="1000"
            fill="url(#fill-blue)"
            stroke-dashoffset="1000"
            d="M485.8 345.4c-2.1 2.5-3.8 5-3.8 5.5 0 .6-1.4 1.1-3.1 1.1a29 29 0 0 0-6.9 1.1c-3.4 1-4.2.9-6.9-1.1-3-2.1-3.3-2.1-5.7-.5-1.4.9-3.2 3.2-4 5-1.7 4.1-1.8 11.7-.3 13.2.8.8.8 2 .2 3.9-1 3-.2 11.2 1.6 15.7 1.1 2.8 1.5 3.1 6.3 4.1 2.5.6 2.6.7 1.5 4.2l-1.1 3.6-4.8-.5c-2.6-.3-4.9-.3-5.2.1-.2.4-3.3.7-6.8.6-7.3-.2-11.9 2-14.3 6.6-2.1 4-1.9 7 .5 9.5 1.8 2 1.9 2.3.5 3.5-1.5 1.3-2.1 7.6-.7 9.6 1.5 2.2 5.2 3.4 11 3.4h6l1-4.2c.9-3.4.8-4.9-.4-7.2-.8-1.6-1.3-3-1.1-3.2a29 29 0 0 1 11.4-.7c.7.5 1.3 2.9 1.4 5.3.1 2.5.7 5.7 1.3 7.2 1 2.5 1.6 2.8 5.7 2.8 4.5 0 4.6.1 6.9 4.9 1.2 2.7 1.9 5.4 1.6 6-1 1.5-5.8 3.9-12.2 6.1a43.4 43.4 0 0 0-27.4 30.1l-2.9 9.2 5.8-.6c6.8-.6 25.3-9.4 34.4-16.4 5.8-4.5 5.9-4.5 7.3-2.4 1.8 2.5 3.2 2.6 7 .6 1.6-.8 3.7-1.5 4.7-1.5.9 0 3.6-1.2 5.9-2.8 5.4-3.5 12.3-3.7 16.5-.5 5.1 4.1 8.7 5.6 13.5 5.7 3.9.1 5.2-.4 7.7-2.8 6.7-6.5 1.7-15.4-9.8-17.6-3.1-.6-8.5-2-12-3.1a22 22 0 0 0-10.3-1.5c-2.6.4-3.7.3-3.3-.4.3-.5.1-1-.4-1-.6 0-1.1-.5-1.1-1.1 0-.9 3.1-1 11.8-.4 16.9 1.1 19.1 1 22.3-1.5a7.1 7.1 0 0 1 6.4-1.4c2.2.4 4.9.1 7.2-.9 2.1-.8 5.9-1.7 8.5-2.1l4.7-.7.3 3.3c.2 2.6.8 3.4 2.6 3.6 1.7.3 2.5-.2 2.9-1.7.3-1.2.7-2.1.9-2.1l7.9 4c13.2 7 17.3 5.3 17.7-7.1.2-6.4-.1-8-2.1-10.7l-2.3-3.2-13.1.2c-7.3.2-13.5.7-13.9 1.3-.4.5-.8 2-.8 3.3 0 2.1-.3 2.2-3.7 1.6a32 32 0 0 1-7.8-2.8 18.3 18.3 0 0 0-8.7-2c-2.9 0-4.8-.4-4.8-1.1 0-.6-1.2-1.8-2.8-2.7-2.7-1.6-8.2-1.5-21.1.8-4.3.7-4.4.6-3.8-1.7.4-1.3.7-3.1.7-3.9.1-3.4 13-6.8 13-3.5 0 1.3.7 1.5 3.3 1 2.5-.5 3.7-.2 5.1 1.4 1.1 1.2 3 2.1 4.3 2.1 1.3 0 4.1.9 6.2 2 4.8 2.4 5.8 1.6 2.5-2.3-1.4-1.6-2.3-3.1-2.1-3.3.9-.9 3.7.9 4.2 2.7.7 2.1 5.3 2.6 8.6.9 2.6-1.5 2.4-2.9-.7-4a48 48 0 0 1-6.7-3.9 24.1 24.1 0 0 0-9.7-3.6c-3-.4-6.8-1.4-8.3-2.2-1.6-.8-3.6-1.2-4.4-.9-2.7 1.1-5.8-.5-7.3-3.7-1.7-3.7-5.9-5-12.7-4.1-4.1.5-4.2.4-3.9-2.3.2-1.5.9-2.9 1.7-3.2a4 4 0 0 0 2.1-1.5c.9-1.4-.1-5.7-1.7-7.3a14 14 0 0 1-2-5.9c-.7-4.9-5.5-13.8-8.3-15.3-1.3-.7-2-3.3-2.7-10.1l-1-9.1-3.7 4.5z"
          />
        </svg>
      </div>
      <div
        class="flex flex-col items-center justify-end"
        style={{ "grid-area": "footer" }}
      >
        <div class="flex items-center justify-center gap-4">
          <a
            href="https://www.github.com/frankborden/slippilab"
            target="_blank"
          >
            <GitHubIcon class="h-8 w-8" title="GitHub" />
          </a>
          <a href="https://www.twitter.com/slippilab" target="_blank">
            <TwitterIcon class="h-8 w-8" title="Twitter" />
          </a>
        </div>
        <div class="text-center">
          Slippi Lab uses .slp replay files from
          <a
            target="_blank"
            rel="noopener noreferrer"
            class="cursor-pointer pl-[0.5ch] text-slippi-500 underline"
            href="https://slippi.gg"
          >
            Project Slippi
          </a>
          , but is not affiliated with the project.
        </div>
      </div>
    </div>
  );
}
