import { motion } from "framer-motion";
import { Tab, TabList, Tabs } from "react-aria-components";

const tabs = [
  {
    name: "My Computer",
    id: "local",
  },
  {
    name: "Slippi Lab",
    id: "cloud",
  },
  {
    name: "Tournaments",
    id: "events",
  },
];

export default function Page() {
  return (
    <main>
      <Tabs defaultSelectedKey="local">
        <TabList className="inline-flex gap-4 bg-white p-1" items={tabs}>
          {(tab) => (
            <Tab className="relative select-none px-2 outline-none">
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
    </main>
  );
}
