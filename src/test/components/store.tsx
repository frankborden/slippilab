import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { PlayerBadge, StageBadge } from "~/common/Badge";
import { PrimaryButton, SecondaryButton, WhiteButton } from "~/common/Button";
import { stageNameByExternalId } from "~/common/ids";

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

const stories = [
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
