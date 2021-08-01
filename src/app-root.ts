import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '@spectrum-web-components/switch/sp-switch';
import '@spectrum-web-components/theme/sp-theme';
import '@spectrum-web-components/theme/theme-dark';
import '@spectrum-web-components/theme/theme-light';
import '@spectrum-web-components/theme/scale-large';
import '@spectrum-web-components/action-button/sp-action-button';

import { Model } from './model';
import './replay-select';
import { fetchAnimation, supportedCharactersById } from './viewer';
import { Search, SearchSpec, FramePredicates } from './search';
import type { Replay } from './common';

@customElement('app-root')
export class AppRoot extends LitElement {
  constructor() {
    super();
    const successfulEdgeguardSpec: SearchSpec = {
      permanentGroupSpec: {
        unitSpecs: [{ predicate: FramePredicates.isOffstage }],
      },
      groupSpecs: [
        {
          unitSpecs: [
            {
              options: { minimumLength: 30 },
              predicate: FramePredicates.isOffstage,
            },
          ],
        },
        {
          unitSpecs: [
            {
              predicate: (frame, game) =>
                !FramePredicates.isInHitstun(frame, game),
            },
          ],
        },
        { unitSpecs: [{ predicate: FramePredicates.isInHitstun }] },
        { unitSpecs: [{ predicate: FramePredicates.isDead }] },
      ],
    };
    this.model.setSearches(new Search(successfulEdgeguardSpec));
    this.model.replayOutput$.subscribe((replay) => {
      this.currentReplay = replay;
    });
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'd':
          this.toggleDarkMode();
          break;
        case 'e':
          this.toggleExplanation();
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
        background-color: black;
      }
      .darkSection {
        text-align: end;
      }
      .topRight {
        float: right;
      }
      .grid {
        display: grid;
      }
      label {
        position: relative;
      }
      .topbar,
      sp-switch,
      label,
      .explanation {
        z-index: 1000;
      }
      .hidden {
        position: absolute;
        left: -5000px;
      }
      replay-viewer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }

  @state()
  private darkMode = false;

  @state()
  private showExplanation = true;

  @state()
  private currentReplay?: Replay;

  private model: Model = new Model();

  private async playPrevReplay(): Promise<void> {
    this.model.prev();
  }

  private async playNextReplay(): Promise<void> {
    this.model.next();
  }

  private async replaySelected(event: CustomEvent<File[]>): Promise<void> {
    this.model.setFiles(...event.detail);
  }

  private getIndexText(): string {
    if (!this.currentReplay) {
      return '';
    }
    const fraction = `${this.model.currentFileIndex + 1}/${
      this.model.files.length
    }`;
    return `Playing file (${fraction}): ${this.currentReplay.fileName}`;
  }

  private toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.body.style.backgroundColor = this.darkMode ? 'black' : 'white';
  }

  private toggleExplanation(): void {
    this.showExplanation = !this.showExplanation;
  }

  render() {
    const viewerClasses = { hidden: !this.currentReplay };
    const topRightClasses = { topRight: true, dark: this.darkMode };
    const gridClasses = { grid: true, dark: this.darkMode };
    return html`
      <sp-theme scale="large" color=${this.darkMode ? 'dark' : 'light'}>
        <div class=${classMap(topRightClasses)}>
          <div class="darkSection">
            <sp-switch @change=${this.toggleDarkMode} ?checked=${this.darkMode}>
              Dark Mode
            </sp-switch>
          </div>
          <div>
            <sp-switch
              @change=${this.toggleExplanation}
              ?checked=${this.showExplanation}
            >
              Show Configuration
            </sp-switch>
          </div>
        </div>
        <div class=${classMap(gridClasses)}>
          <div class="topbar">
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
            ${this.currentReplay
              ? html` <span>${this.getIndexText()}</span> `
              : ''}
            <div class="explanation" ?hidden=${!this.showExplanation}>
              <b
                >Supported Characters: Falco, Falcon, Fox, Marth, Peach, Puff,
                Sheik</b
              ><br />
              <b>Supported Stages: FD, BF, DL, YS, FoD (static), PS (static)</b
              ><br />
              Previous Replay: [<br />
              Next Replay: ]<br />
              Pause: Space or K or click<br />
              Rewind -2s: Left or J<br />
              Skip Ahead +2s: Right or L<br />
              Jump to %: 0-9 digits<br />
              Zoom In: + or =<br />
              Zoom Out: - or _<br />
              Speed Up: hold Up<br />
              Slow Down: hold Down<br />
              Frame Forward: .<br />
              Frame Backwards: ,<br />
              Capture next 10s as GIF (allow popup): g<br />
              Toggle this text: e<br />
              Toggle dark mode: d<br />
            </div>
          </div>
          ${this.currentReplay
            ? html` <replay-viewer
                .replay=${this.currentReplay}
                .dark=${this.darkMode}
                class=${classMap(viewerClasses)}
              ></replay-viewer>`
            : ''}
        </div>
      </sp-theme>
    `;
  }
}
