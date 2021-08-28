import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/switch/sp-switch';
import '@spectrum-web-components/theme/sp-theme';
import '@spectrum-web-components/theme/theme-dark';
import '@spectrum-web-components/theme/theme-light';
import '@spectrum-web-components/theme/scale-large';
import '@spectrum-web-components/action-button/sp-action-button';
import '@spectrum-web-components/tabs/sp-tab';
import '@spectrum-web-components/tabs/sp-tabs';
import '@spectrum-web-components/tabs/sp-tab-panel';

import { model } from './model';
// import { fetchAnimation, supportedCharactersById } from './viewer';
import './replay-select';
import './file-list';
import './highlight-list';
import type { Highlight, Replay } from '../packages/common';

@customElement('app-root')
export class AppRoot extends LitElement {
  constructor() {
    super();
    model.state$.subscribe(async (state) => {
      if (this.replay !== state.replay) {
        this.replay = state.replay;
      }
      this.highlight =
        state.currentHighlightIndex === undefined
          ? undefined
          : state.replay?.highlights[state.currentHighlightIndex];
    });
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'd':
          this.toggleDarkMode();
          break;
        case '[':
          model.prev();
          break;
        case ']':
          model.next();
          break;
      }
    });
    // Object.keys(supportedCharactersById).forEach((characterId) =>
    //   fetchAnimation(Number(characterId)),
    // );
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
        display: flex;
        flex-direction: column;
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
    `;
  }

  @state()
  private replay?: Replay;

  @state()
  private highlight?: Highlight;

  @state()
  private darkMode = false;

  private toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.body.style.backgroundColor = this.darkMode ? 'black' : 'white';
  }

  render() {
    return html`
      <sp-theme
        scale="large"
        color=${this.darkMode ? 'dark' : 'light'}
        class=${this.darkMode ? 'dark' : ''}
      >
        <div class="container">
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
                <sp-switch
                  @change=${this.toggleDarkMode}
                  ?checked=${this.darkMode}
                >
                  Dark Mode
                </sp-switch>
              </sp-tab-panel>
            </sp-tabs>
            <replay-select></replay-select>
          </div>
          <div class="main">
            <replay-viewer
              .dark=${this.darkMode}
              .replay=${this.replay}
              .highlight=${this.highlight}
            ></replay-viewer>
          </div>
        </div>
      </sp-theme>
    `;
  }
}
