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
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  space
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  K
                </kbd>
              </td>
              <td class="pl-3">Toggle pause</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  LeftArrow
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  J
                </kbd>
              </td>
              <td class="pl-3">Rewind 2 seconds</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  RightArrow
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  L
                </kbd>
              </td>
              <td class="pl-3">Skip ahead 2 seconds</td>
            </tr>

            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  0
                </kbd>
                -
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  9
                </kbd>
              </td>
              <td class="pl-3">
                Jump to xx%. For example, press{" "}
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  3
                </kbd>{" "}
                for 30%
              </td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  .
                </kbd>
              </td>
              <td class="pl-3">Next frame (pauses if not paused)</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  ,
                </kbd>
              </td>
              <td class="pl-3">Previous frame (pauses if not paused)</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  UpArrow
                </kbd>
              </td>
              <td class="pl-3">Slow speed</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  DownArrow
                </kbd>
              </td>
              <td class="pl-3">Fast speed</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  +
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  =
                </kbd>
              </td>
              <td class="pl-3">Zoom in</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  -
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  _
                </kbd>
              </td>
              <td class="pl-3">Zoom out</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  [
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  {"{"}
                </kbd>
              </td>
              <td class="pl-3">Play previous file</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  ]
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  {"}"}
                </kbd>
              </td>
              <td class="pl-3">Play next file</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  ;
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  :
                </kbd>
              </td>
              <td class="pl-3">Play previous clip</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  '
                </kbd>
                /
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  "
                </kbd>
              </td>
              <td class="pl-3">Play next clip</td>
            </tr>
            <tr>
              <td>
                <kbd class="border bg-slate-50 border-slate-400 px-1 rounded">
                  d
                </kbd>
              </td>
              <td class="pl-3">Toggle debug output</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
