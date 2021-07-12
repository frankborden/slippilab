import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { SlippiGame } from '@slippi/slippi-js';
import 'wired-elements';

import './replay-select';
import './replay-viewer';
import { fetchAnimation } from './viewer/animations';
import { supportedCharactersById } from './viewer/characters';
import { supportedStagesById } from './viewer/stages';

@customElement('app-root')
export class AppRoot extends LitElement {
  constructor() {
    super();
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
      wired-toggle,
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
  private replays?: File[];

  @state()
  private darkMode = false;

  @state()
  private showExplanation = true;

  @state()
  private currentReplay?: SlippiGame;
  private currentIndex = 0;

  private async playPrevReplay(): Promise<void> {
    if (!this.replays || !this.currentReplay) {
      return;
    }
    const oldIndex = this.currentIndex;
    let replay;
    this.currentIndex =
      (this.currentIndex - 1 + this.replays.length) % this.replays.length;
    replay = await this.parseGame(this.replays[this.currentIndex]);
    while (!replay && this.currentIndex !== oldIndex) {
      this.currentIndex =
        (this.currentIndex - 1 + this.replays.length) % this.replays.length;
      replay = await this.parseGame(this.replays[this.currentIndex]);
    }
    this.currentReplay = replay;
  }

  private async playNextReplay(): Promise<void> {
    if (!this.replays) {
      return;
    }

    const oldIndex = this.currentIndex;
    let replay;
    this.currentIndex = (this.currentIndex + 1) % this.replays.length;
    replay = await this.parseGame(this.replays[this.currentIndex]);
    while (!replay && this.currentIndex !== oldIndex) {
      this.currentIndex = (this.currentIndex + 1) % this.replays.length;
      replay = await this.parseGame(this.replays[this.currentIndex]);
    }
    this.currentReplay = replay;
  }

  private async replaySelected(event: CustomEvent<File[]>): Promise<void> {
    this.replays = event.detail;
    if (this.replays.length > 0) {
      this.currentIndex = -1;
      let replay;
      while (!replay && this.currentIndex < this.replays.length) {
        this.currentIndex++;
        replay = await this.parseGame(this.replays[this.currentIndex]);
      }
      this.currentReplay = replay;
    }
  }

  private async parseGame(file: File): Promise<SlippiGame | undefined> {
    const buffer = await file.arrayBuffer();
    const game = new SlippiGame(buffer);
    const valid =
      game
        .getSettings()
        ?.players.every((player) =>
          Object.keys(supportedCharactersById).includes(
            player.characterId!.toString(),
          ),
        ) &&
      Object.keys(supportedStagesById).includes(
        game.getSettings()?.stageId?.toString()!,
      );

    return valid ? game : undefined;
  }

  private getIndexText(): string {
    if (!this.currentReplay || !this.replays) {
      return '';
    }
    const fraction = `${this.currentIndex + 1}/${this.replays.length}`;
    return `Playing file (${fraction}): ${
      this.replays[this.currentIndex].name
    }`;
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
      <div class=${classMap(topRightClasses)}>
        <div class="darkSection">
          <label for="darkToggle">Dark Mode</label>
          <wired-toggle
            id="darkToggle"
            @change=${this.toggleDarkMode}
            ?checked=${this.darkMode}
          ></wired-toggle>
        </div>
        <div>
          <label for="explanationToggle">Show Configuration</label>
          <wired-toggle
            id="explanationToggle"
            @change=${this.toggleExplanation}
            ?checked=${this.showExplanation}
          ></wired-toggle>
        </div>
      </div>
      <div class=${classMap(gridClasses)}>
        <div class="topbar">
          <replay-select
            @replays-selected=${this.replaySelected}
          ></replay-select>
          ${this.replays && this.replays.length > 1
            ? html`
                <wired-button @click=${this.playPrevReplay} elevation="2">
                  Start Prev Replay
                </wired-button>

                <wired-button @click=${this.playNextReplay} elevation="2">
                  Start Next Replay
                </wired-button>
              `
            : ``}
          ${this.replays && this.replays.length > 0
            ? html` <span>${this.getIndexText()}</span> `
            : ''}
          <div class="explanation" ?hidden=${!this.showExplanation}>
            <b>Supported Characters: Fox, Falco, Falcon, Marth, Puff</b><br />
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
    `;
  }
}
