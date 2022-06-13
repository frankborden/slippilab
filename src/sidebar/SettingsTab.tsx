import { Kbd } from "@hope-ui/solid";

export function SettingsTab() {
  return (
    <>
      <div class="flex flex-col items-center gap-2 overflow-y-auto">
        <table>
          <caption>Playback Shortcuts</caption>
          <thead>
            <tr>
              <th>Shortcut</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Kbd>space</Kbd>/<Kbd>K</Kbd>
              </td>
              <td>Toggle pause</td>
            </tr>
            <tr>
              <td>
                <Kbd>LeftArrow</Kbd>/<Kbd>J</Kbd>
              </td>
              <td>Rewind 2 seconds</td>
            </tr>
            <tr>
              <td>
                <Kbd>RightArrow</Kbd>/<Kbd>L</Kbd>
              </td>
              <td>Skip ahead 2 seconds</td>
            </tr>

            <tr>
              <td>
                <Kbd>0</Kbd>-<Kbd>9</Kbd>
              </td>
              <td>
                Jump to xx%. For example, press <Kbd>3</Kbd> for 30%
              </td>
            </tr>
            <tr>
              <td>
                <Kbd>.</Kbd>
              </td>
              <td>Next frame (pauses if not paused)</td>
            </tr>
            <tr>
              <td>
                <Kbd>,</Kbd>
              </td>
              <td>Previous frame (pauses if not paused)</td>
            </tr>
            <tr>
              <td>
                <Kbd>UpArrow</Kbd>
              </td>
              <td>Slow speed</td>
            </tr>
            <tr>
              <td>
                <Kbd>DownArrow</Kbd>
              </td>
              <td>Fast speed</td>
            </tr>
            <tr>
              <td>
                <Kbd>+</Kbd>/<Kbd>=</Kbd>
              </td>
              <td>Zoom in</td>
            </tr>
            <tr>
              <td>
                <Kbd>-</Kbd>/<Kbd>_</Kbd>
              </td>
              <td>Zoom out</td>
            </tr>
            <tr>
              <td>
                <Kbd>[</Kbd>/<Kbd>{"{"}</Kbd>
              </td>
              <td>Play previous file</td>
            </tr>
            <tr>
              <td>
                <Kbd>]</Kbd>/<Kbd>{"}"}</Kbd>
              </td>
              <td>Play next file</td>
            </tr>
            <tr>
              <td>
                <Kbd>;</Kbd>/<Kbd>:</Kbd>
              </td>
              <td>Play previous clip</td>
            </tr>
            <tr>
              <td>
                <Kbd>'</Kbd>/<Kbd>"</Kbd>
              </td>
              <td>Play next clip</td>
            </tr>
            <tr>
              <td>
                <Kbd>d</Kbd>
              </td>
              <td>Toggle debug output</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
