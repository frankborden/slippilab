import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { PlayerBadge, StageBadge } from "~/common/Badge";
import { PrimaryButton, SecondaryButton, WhiteButton } from "~/common/Button";
import {
  Dialog,
  DialogClose,
  DialogContents,
  DialogTrigger,
} from "~/common/Dialog";
import { stageNameByExternalId } from "~/common/ids";
import { Picker } from "~/common/Picker";
import { ProgressCircle } from "~/common/ProgressCircle";
import { SpinnerCircle } from "~/common/SpinnerCircle";

export interface Variant {
  name: string;
  component: Component;
}
export interface Story {
  name: string;
  variants: Variant[];
}

export interface Store {
  stories: Story[];
  currentStory: Story;
  currentVariant: Variant;
}

const stories: Story[] = [
  {
    name: "Button",
    variants: [
      {
        name: "All Variants",
        component: () => (
          <div class="flex flex-col gap-2">
            <PrimaryButton onClick={() => alert("Clicked")}>
              Primary
            </PrimaryButton>
            <SecondaryButton onClick={() => alert("Clicked")}>
              Secondary
            </SecondaryButton>
            <WhiteButton onClick={() => alert("Clicked")}>White</WhiteButton>
          </div>
        ),
      },
    ],
  },
  {
    name: "Badge",
    variants: [
      {
        name: "Player Colors",
        component: () => (
          <div class="flex flex-col gap-2">
            <PlayerBadge port={1} />
            <PlayerBadge port={2} />
            <PlayerBadge port={3} />
            <PlayerBadge port={4} />
          </div>
        ),
      },
      {
        name: "Stage Colors",
        component: () => (
          <div class="flex flex-col gap-2">
            <StageBadge
              stageId={stageNameByExternalId.indexOf("Yoshi's Story")}
            />
            <StageBadge
              stageId={stageNameByExternalId.indexOf("Fountain of Dreams")}
            />
            <StageBadge
              stageId={stageNameByExternalId.indexOf("Pokémon Stadium")}
            />
            <StageBadge
              stageId={stageNameByExternalId.indexOf("Battlefield")}
            />
            <StageBadge
              stageId={stageNameByExternalId.indexOf("Final Destination")}
            />
            <StageBadge
              stageId={stageNameByExternalId.indexOf("Dream Land N64")}
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Progress Circle",
    variants: [
      {
        name: "All Variants",
        component: () => (
          <div class="grid grid-cols-2 w-max gap-2">
            <div>0%</div>
            <div class="w-8 h-8">
              <ProgressCircle percent={0} />
            </div>
            <div>30%</div>
            <div class="w-8 h-8">
              <ProgressCircle percent={30} />
            </div>
            <div>60%</div>
            <div class="w-8 h-8">
              <ProgressCircle percent={60} />
            </div>
            <div>90%</div>
            <div class="w-8 h-8">
              <ProgressCircle percent={90} />
            </div>
            <div>100%</div>
            <div class="w-8 h-8">
              <ProgressCircle percent={100} />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    name: "Spinner",
    variants: [
      {
        name: "Default",
        component: () => (
          <div class="w-8 h-8">
            <SpinnerCircle />{" "}
          </div>
        ),
      },
    ],
  },
  {
    name: "Dialog",
    variants: [
      {
        name: "Basic Usage",
        component: () => (
          <Dialog>
            <DialogTrigger>
              <PrimaryButton>Open</PrimaryButton>
            </DialogTrigger>
            <DialogContents>
              <div class="flex flex-col gap-4 w-96 h-96 justify-between">
                Contents Here
                <div class="flex justify-end">
                  <DialogClose>
                    <PrimaryButton>Close</PrimaryButton>
                  </DialogClose>
                </div>
              </div>
            </DialogContents>
          </Dialog>
        ),
      },
    ],
  },
  {
    name: "Picker",
    variants: [
      {
        name: "Basic Usage",
        component: () => (
          <Picker
            items={[1, 2, 3, 4, 5]}
            render={(n) => (
              <div>
                I am item {n}
                {n === 3 ? " (selected)" : ""}
              </div>
            )}
            onClick={(n) => alert(`item ${n} was clicked`)}
            selected={(n) => n === 3}
            estimateSize={() => 34}
          ></Picker>
        ),
      },
    ],
  },
];

const [storeProxy, setStore] = createStore<Store>({
  stories,
  currentStory: stories[0],
  currentVariant: stories[0].variants[0],
});

export const store = storeProxy;

export function setStory(story: Story) {
  setStore((state) => ({
    ...state,
    currentStory: story,
    currentVariant: story.variants[0],
  }));
}

export function setVariant(variant: Variant) {
  setStore((state) => ({ ...state, currentVariant: variant }));
}
