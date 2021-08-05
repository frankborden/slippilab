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
import { fetchAnimation, supportedCharactersById } from './viewer';
import './file-list';
import './highlight-list';

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
          model.prev();
          break;
        case ']':
          model.next();
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
        grid-template: 1fr / 1fr 3fr;
      }
      .main {
        display: flex;
        justify-content: center;
      }
      .sidebar {
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
              <sp-tab label="Files" value="1"></sp-tab>
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
          </div>
          <div class="main">
              <replay-viewer .dark=${this.darkMode}></replay-viewer>
          </div>
        </div>
      </sp-theme>
    `;
  }
}
