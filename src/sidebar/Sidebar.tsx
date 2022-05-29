import { Tab, TabList, TabPanel, Tabs } from "@hope-ui/solid";
import { JSX } from "solid-js";
import { ClipsTab } from "./ClipsTab";
import { ReplaysTab } from "./ReplaysTab";
import { SettingsTab } from "./SettingsTab";

export function Sidebar(): JSX.Element {
  return (
    <>
      <Tabs height="$full" display="flex" flexDirection="column">
        <TabList display="flex" justifyContent="space-evenly">
          <Tab>Replays</Tab>
          <Tab>Clips</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanel flexShrink="1" overflowY="auto">
          <ReplaysTab />
        </TabPanel>
        <TabPanel flexShrink="1" overflowY="auto">
          <ClipsTab />
        </TabPanel>
        <TabPanel flexShrink="1" overflowY="auto">
          <SettingsTab />
        </TabPanel>
      </Tabs>
    </>
  );
}
