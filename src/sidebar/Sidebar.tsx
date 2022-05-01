import { Tab, TabList, TabPanel, Tabs } from "@hope-ui/solid";
import { Upload } from "./Upload";

/* TODO: ReplayPicker, Clip stuff, Settings */
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
          {/* ReplayTab */}
          <Upload />
        </TabPanel>
        <TabPanel>
          {/* ClipsTab */}
          ClipsContents
        </TabPanel>
        <TabPanel>
          {/* SettingsTab */}
          SettingsContents
        </TabPanel>
      </Tabs>
    </>
  );
}
