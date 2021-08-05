import { css, html, LitElement } from 'lit';
import { customElement, queryAll, state } from 'lit/decorators.js';
import type { Highlight } from './common';

import { model } from './model';
import './replay-select';

@customElement('highlight-list')
export class HighlightList extends LitElement {
  @state()
  private highlights: Highlight[] = [];

  @queryAll('option')
  private selectOptions?: HTMLOptionElement[];

  constructor() {
    super();
    model.state$.subscribe((state) => {
      if (this.highlights !== state.replay?.highlights) {
        this.highlights = state.replay?.highlights ?? [];
        if (this.selectOptions) {
          console.log(this.selectOptions);
          this.selectOptions.forEach((option) => option.selected = false);
        }
      }
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
      select {
        flex-grow: 1;
      }
    `;
  }

  render() {
    return html`
      <div class="container">
        <replay-select></replay-select>
        <select size="20" @change=${this.selected}>
          ${this.highlights.map(
            (highlight, index) =>
              html`<option value=${index}>
                ${highlight.startFrame}-${highlight.endFrame}
              </option>`,
          )}
        </select>
      </div>
    `;
  }
}
