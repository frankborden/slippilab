import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { Highlight } from '@slippilab/search';

import { model } from './model';
import { attackNamesById } from '@slippilab/common';
import type { AttackName } from '@slippilab/common';

@customElement('highlight-list')
export class HighlightList extends LitElement {
  @state()
  private highlights: [string, number, Highlight][] = [];

  @state()
  private currentHighlightIndex = -1;

  constructor() {
    super();
    model.state$.subscribe((state) => {
      this.highlights = [
        ...(state.replay?.highlights?.entries() ?? []),
      ].flatMap(([name, highlights]) =>
        highlights.map((highlight): [string, number, Highlight] => [
          name,
          highlight.playerIndex,
          highlight,
        ]),
      );
      this.currentHighlightIndex = state.currentHighlightIndex ?? -1;
    });
  }

  private highlightSelected(e: Event) {
    const select = e.currentTarget as HTMLSelectElement;
    model.jumpToHighlight(this.highlights[Number(select.value)][2]);
    select.blur();
  }

  private attackSelected(e: Event) {
    const select = e.currentTarget as HTMLSelectElement;
    const attack = select.value as AttackName;
    model.setAttack(attack);
    select.blur();
  }

  static get styles() {
    return css`
      .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `;
  }

  render() {
    return html`
      <div class="container">
        <select
          size="30"
          .selectedIndex=${this.currentHighlightIndex ?? 0}
          @change=${this.highlightSelected}
        >
          ${this.highlights.map(
            ([name, playerIndex, highlight], index) =>
              html`<option
                value=${index}
                ?selected=${this.currentHighlightIndex === index}
              >
                ${name}: P${playerIndex + 1} -
                ${highlight.startFrame - 123}-${highlight.endFrame - 123}
              </option>`,
          )}
        </select>
        Custom Attack:
        <select @change=${this.attackSelected}>
          ${attackNamesById
            .slice(2)
            .map((name) => html`<option value=${name}>${name}</option>`)}
        </select>
      </div>
    `;
  }
}
