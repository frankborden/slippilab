import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/switch/sp-switch';
import '@spectrum-web-components/theme/sp-theme';
import '@spectrum-web-components/theme/theme-dark';
import '@spectrum-web-components/theme/theme-light';
import '@spectrum-web-components/theme/scale-large';
import '@spectrum-web-components/action-button/sp-action-button';
import '@spectrum-web-components/link/sp-link';
import '@spectrum-web-components/tabs/sp-tab';
import '@spectrum-web-components/tabs/sp-tabs';
import '@spectrum-web-components/tabs/sp-tab-panel';

import { model } from './model';
import type { Replay } from './model';
import { fetchAnimation } from '@slippilab/viewer';
import './replay-select';
import './replay-store-select';
import './file-list';
import './highlight-list';
import './sl-settings';
import type { Highlight } from '@slippilab/search';

@customElement('app-root')
export class AppRoot extends LitElement {
  constructor() {
    super();
    model.state$.subscribe(async (state) => {
      this.darkMode = state.darkMode;
      this.debugMode = state.debugMode;
      document.body.style.backgroundColor = state.darkMode ? 'black' : 'white';

      if (this.replay !== state.replay) {
        this.replay = state.replay;
      }
      this.highlight =
        state.currentHighlightIndex === undefined
          ? undefined
          : [...(state.replay?.highlights?.entries() ?? [])].flatMap(
              (x) => x[1],
            )[state.currentHighlightIndex];
    });
    model.setDarkMode(localStorage.getItem('darkMode') === 'true');
    model.setDebugMode(localStorage.getItem('debugMode') === 'true');
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case '/':
          model.setDarkMode(!this.darkMode);
          break;
        case '[':
          model.prevFile();
          break;
        case ']':
          model.nextFile();
          break;
        case ';':
          model.prevHighlight();
          break;
        case "'":
          model.nextHighlight();
          break;
      }
    });
    // Prefetch the most popular characters. It's 16 mb already, but at least
    // users will cache them and they rarely change.
    fetchAnimation(20); // falco
    fetchAnimation(2); // fox
    fetchAnimation(0); // falcon
    fetchAnimation(9); // marth
  }

  static get styles() {
    return css`
      .dark {
        color: white;
      }
      .container {
        height: 100vh;
        display: grid;
        grid-template: 1fr / 1fr 3fr;
      }
      .sidebar {
        height: 100vh;
        width: 25vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .middle {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      replay-viewer {
        width: 100%;
        height: 100%;
      }
      file-list,
      highlight-list {
        width: 100%;
      }
      sp-tab-panel {
        width: 25vw;
      }
    `;
  }

  @state()
  private replay?: Replay;

  @state()
  private highlight?: Highlight;

  @state()
  private darkMode = false;

  @state()
  private debugMode = false;

  override connectedCallback(): void {
    super.connectedCallback();
    const urlMatch = window.location.search.match(/\?replayUrl=(.*\.slp)$/);
    if (urlMatch?.[1]) {
      const url = decodeURIComponent(urlMatch[1]);
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => new File([blob], url.split('/').at(-1) ?? 'url.slp'))
        .then((file) => model.setFiles([file]));
    }
  }

  private dragged(e: DragEvent) {
    e.preventDefault();
  }

  private dropped(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      model.setFiles(Array.from(e.dataTransfer.files));
    }
  }

  override render() {
    return html`
      <sp-theme
        scale="large"
        color=${this.darkMode ? 'dark' : 'light'}
        class=${this.darkMode ? 'dark' : ''}
      >
        <div class="container" @drop=${this.dropped} @dragover=${this.dragged}>
          <div class="sidebar">
            <sp-tabs selected="1">
              <sp-tab label="Replays" value="1"></sp-tab>
              <sp-tab label="Clips" value="2"></sp-tab>
              <sp-tab label="Settings" value="3"></sp-tab>
              <sp-tab-panel value="1">
                <file-list></file-list>
              </sp-tab-panel>
              <sp-tab-panel value="2">
                <highlight-list></highlight-list>
              </sp-tab-panel>
              <sp-tab-panel value="3">
                <sl-settings></sl-settings>
              </sp-tab-panel>
            </sp-tabs>
            <div class="middle">
              <replay-store-select></replay-store-select>
            </div>
            <div class="bottom">
              <sp-link
                size="xl"
                href="https://github.com/frankborden/slippilab"
                target="_blank"
                rel="noopener noreferrer"
                >Source</sp-link
              >
              <replay-select></replay-select>
            </div>
          </div>
          <div class="main">
            <replay-viewer
              .dark=${this.darkMode}
              .debug=${this.debugMode}
              .replayData=${this.replay?.game}
              .highlight=${this.highlight}
            ></replay-viewer>
          </div>
        </div>
      </sp-theme>
    `;
  }
}
