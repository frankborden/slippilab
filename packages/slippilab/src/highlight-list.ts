import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { Highlight } from '@slippilab/search';

import { model } from './model';

@customElement('highlight-list')
export class HighlightList extends LitElement {
  @state()
  private highlights: Highlight[] = [];

  @state()
  private currentHighlightIndex?: number;

  constructor() {
    super();
    model.state$.subscribe((state) => {
      if (this.highlights !== state.replay?.highlights) {
        this.highlights = state.replay?.highlights ?? [];
      }
      this.currentHighlightIndex = state.currentHighlightIndex;
    });
  }

  private selected(e: Event) {
    const select = e.currentTarget as HTMLSelectElement;
    model.jumpToHighlight(this.highlights[Number(select.value)]);
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
        <select size="30" @change=${this.selected}>
          ${this.highlights.map(
            (highlight, index) =>
              html`<option
                value=${index}
                ?selected=${this.currentHighlightIndex === index}
              >
                ${highlight.startFrame - 123}-${highlight.endFrame - 123}
              </option>`,
          )}
        </select>
      </div>
    `;
  }
}
