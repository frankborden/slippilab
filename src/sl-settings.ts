import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { model } from './model';

@customElement('sl-settings')
export class SlippiLabSettings extends LitElement {
  constructor() {
    super();
    model.state$.subscribe((state) => {
      this.darkMode = state.darkMode;
    });
  }

  private toggleDarkMode(): void {
    model.setDarkMode(!this.darkMode);
  }

  @state()
  private darkMode = false;

  override render() {
    return html`
      <sp-switch @change=${this.toggleDarkMode} ?checked=${this.darkMode}>
        Dark Mode
      </sp-switch>
    `;
  }
}
