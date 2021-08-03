import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/switch/sp-switch';
import '@spectrum-web-components/theme/sp-theme';
import '@spectrum-web-components/theme/theme-dark';
import '@spectrum-web-components/theme/theme-light';
import '@spectrum-web-components/theme/scale-large';
import '@spectrum-web-components/action-button/sp-action-button';

import { model } from './model';
import './replay-select';
import { fetchAnimation, supportedCharactersById } from './viewer';
import './file-list';
import type { Replay } from './common';

@customElement('app-root')
export class AppRoot extends LitElement {
  constructor() {
    super();
    model.replayOutput$.subscribe((state) => {
      console.log(state);
      this.currentReplay = state.replay;
      if (!this.currentReplay || state.currentFileIndex === undefined) {
        this.indexFraction = '';
        return;
      }
      const fraction = `${state.currentFileIndex + 1}/${state.files.length}`;
      this.indexFraction = `Playing file (${fraction}): ${this.currentReplay.fileName}`;
    });
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'd':
          this.toggleDarkMode();
          break;
        case '[':
          this.playPrevReplay();
          break;
        case ']':
          this.playNextReplay();
          break;
      }
    });
    Object.keys(supportedCharactersById).forEach((characterId) =>
      fetchAnimation(Number(characterId)),
    );
  }

  static get styles() {
    return css`
      .dark {
        color: white;
      }
      .container {
        height: 100vh;
        display: grid;
        grid-template: min-content 1fr / 1fr 4fr;
      }
      .topbar {
        grid-column-start: span 2;
      }
      .main {
        display: flex;
        justify-content: center;
      }
      replay-viewer {
        width: 100%;
        height: 100%;
      }
      .noReplay {
        align-self: center;
      }
    `;
  }

  @state()
  private darkMode = false;

  @state()
  private currentReplay?: Replay;

  @state()
  private indexFraction?: string;

  private async playPrevReplay(): Promise<void> {
    model.prev();
  }

  private async playNextReplay(): Promise<void> {
    model.next();
  }

  private async replaySelected(event: CustomEvent<File[]>): Promise<void> {
    model.setFiles(...event.detail);
  }

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
          <div class="topbar">
            Top Bar
            <sp-switch @change=${this.toggleDarkMode} ?checked=${this.darkMode}>
              Dark Mode
            </sp-switch>
            <replay-select
              @replays-selected=${this.replaySelected}
            ></replay-select>
            ${this.currentReplay
              ? html`
                  <sp-action-button @click=${this.playPrevReplay}>
                    Start Prev Replay
                  </sp-action-button>
                  <sp-action-button @click=${this.playNextReplay}>
                    Start Next Replay
                  </sp-action-button>
                `
              : ``}
            ${this.indexFraction}
          </div>
          <div class="sidebar">
            <file-list></file-list>
          </div>
          <div class="main">
            ${this.currentReplay
              ? html` <replay-viewer
                  .replay=${this.currentReplay}
                  .dark=${this.darkMode}
                ></replay-viewer>`
              : html`<div class="noReplay">Waiting for game...</div>`}
          </div>
        </div>
      </sp-theme>
    `;
  }
}
