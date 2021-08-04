import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/switch/sp-switch';
import '@spectrum-web-components/theme/sp-theme';
import '@spectrum-web-components/theme/theme-dark';
import '@spectrum-web-components/theme/theme-light';
import '@spectrum-web-components/theme/scale-large';
import '@spectrum-web-components/action-button/sp-action-button';

import { model } from './model';
import { fetchAnimation, supportedCharactersById } from './viewer';
import './file-list';
import type { Replay } from './common';

@customElement('app-root')
export class AppRoot extends LitElement {
  constructor() {
    super();
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
    model.replayOutput$.subscribe((state) => {
      if (this.currentReplay !== state.replay) {
        this.currentReplay = state.replay;
      }
    })
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
        grid-column-start: span 1;
      }
      .main {
        display: flex;
        justify-content: center;
        grid-row-start: span 2;
      }
      .sidebar {
        grid-row-start: 2;
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

  private async playPrevReplay(): Promise<void> {
    model.prev();
  }

  private async playNextReplay(): Promise<void> {
    model.next();
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
              : html`<div class="noReplay">Waiting for game.</div>`}
          </div>
        </div>
      </sp-theme>
    `;
  }
}
