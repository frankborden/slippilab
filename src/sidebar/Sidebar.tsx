import { Tab, TabList, TabPanel, Tabs } from "@hope-ui/solid";
import { ClipsTab } from "./ClipsTab";
import { ReplaysTab } from "./ReplaysTab";
import { SettingsTab } from "./SettingsTab";

export function Sidebar() {
  return (
    <>
      <Tabs>
        <TabList>
          <Tab>Replays</Tab>
          <Tab>Clips</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanel>
          <ReplaysTab />
        </TabPanel>
        <TabPanel>
          <ClipsTab />
        </TabPanel>
        <TabPanel>
          <SettingsTab />
        </TabPanel>
      </Tabs>
    </>
  );
}
