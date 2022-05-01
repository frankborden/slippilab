import { Viewer } from "./viewer/Viewer";
import { fetchAnimations } from "./viewer/animationCache";
import { Box, Flex } from "@hope-ui/solid";
import { Sidebar } from "./sidebar/Sidebar";

export function App() {
  // Get started fetching the most popular characters
  fetchAnimations(20); // Falco
  fetchAnimations(2); // Fox
  fetchAnimations(0); // Falcon
  fetchAnimations(9); // Marth

  return (
    <>
      <Flex width={"$screenW"}>
        <Box flexGrow={1}>
          <Sidebar />
        </Box>
        <Box
          height={"$screenH"}
          overflow={"hidden"}
          style={{ "aspect-ratio": "73/60" }}
        >
          <Viewer />
        </Box>
      </Flex>
    </>
  );
}
