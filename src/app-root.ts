import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import './replay-select';
import './replay-player';
import { SlippiGame } from '@slippi/slippi-js';
import { fetchAnimation, supportedCharacters } from './player/animations';
import { characterDataById, characters } from './player/characters/character';
import { stagesById } from './player/stages/stage';

@customElement('app-root')
export class AppRoot extends LitElement {
  constructor() {
    super();
    Object.keys(characterDataById).forEach((characterId) =>
      fetchAnimation(Number(characterId)),
    );
  }

  static get styles() {
    return css`
      .grid {
        display: grid;
      }
      .topbar,
      .explanation {
        z-index: 1;
      }
      .hidden {
        position: absolute;
        left: -5000px;
      }
      new-replay-player {
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
          supportedCharacters.includes(characters[player.characterId!]),
        ) &&
      Object.keys(stagesById).includes(
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

  render() {
    const playerClasses = { hidden: !this.currentReplay, player: true };
    return html`
      <div class="grid">
        <div class="topbar">
          <replay-select
            @replays-selected=${this.replaySelected}
          ></replay-select>
          ${this.replays && this.replays.length > 1
            ? html`
                <wired-button
                  class="label"
                  @click=${this.playPrevReplay}
                  elevation="2"
                >
                  Start Prev Replay
                </wired-button>

                <wired-button
                  class="label"
                  @click=${this.playNextReplay}
                  elevation="2"
                >
                  Start Next Replay
                </wired-button>
              `
            : ``}
          ${this.replays && this.replays.length > 0
            ? html` <span>${this.getIndexText()}</span> `
            : ''}
        </div>
        <div class="explanation">
          <b>Supported Characters: Fox, Falco, Falcon, Marth, Puff</b><br />
          <b>Supported Stages: FD, BF, DL, YS, FoD (static), PS (static)</b
          ><br />
          Pause: Space or K or click<br />
          Rewind -2s: Left or J<br />
          Skip Ahead +2s: Right or L<br />
          Zoom In: + or =<br />
          Zoom Out: - or _<br />
          Speed Up: hold Up<br />
          Slow down: hold Down<br />
          Frame Forward: .<br />
          Frame Backwards: ,<br />
          Capture next 10s as GIF: g<br />
        </div>
        ${this.currentReplay
          ? html` <new-replay-player
              .replay=${this.currentReplay}
              class=${classMap(playerClasses)}
            ></new-replay-player>`
          : ''}
      </div>
    `;
  }
}
