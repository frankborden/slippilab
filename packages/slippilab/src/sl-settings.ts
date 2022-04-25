import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { model } from './model';
import '@spectrum-web-components/switch';

@customElement('sl-settings')
export class SlippiLabSettings extends LitElement {
  static get styles() {
    return css`
      kbd {
        background-color: #eee;
        border-radius: 3px;
        border: 1px solid #b4b4b4;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2),
          0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
        color: #333;
        display: inline-block;
        font-size: 0.85em;
        font-weight: 700;
        line-height: 1;
        padding: 2px 4px;
        white-space: nowrap;
      }
    `;
  }
  constructor() {
    super();
    model.state$.subscribe((state) => {
      this.darkMode = state.darkMode;
      this.debugMode = state.debugMode;
    });
  }

  private toggleDarkMode(): void {
    localStorage.setItem('darkMode', String(!this.darkMode));
    model.setDarkMode(!this.darkMode);
  }

  private toggleDebugMode(): void {
    localStorage.setItem('debugMode', String(!this.debugMode));
    model.setDebugMode(!this.debugMode);
  }

  @state()
  private darkMode = false;

  @state()
  private debugMode = false;

  override render() {
    return html`
      <sp-switch @change=${this.toggleDarkMode} ?checked=${this.darkMode}>
        Dark Mode
      </sp-switch>
      <sp-switch @change=${this.toggleDebugMode} ?checked=${this.debugMode}>
        Debug Mode
      </sp-switch>
      <div>
        <kbd>Space</kbd>/<kbd>Click</kbd> Toggle pause
        <br />
        <kbd>Right</kbd> Jump 2 seconds forward
        <br />
        <kbd>Left</kbd> Jump 2 seconds backward
        <br />
        <kbd>.</kbd> Frame advance forward
        <br />
        <kbd>,</kbd> Frame advance backward
        <br />
        <kbd>]</kbd> Next replay
        <br />
        <kbd>[</kbd> Previous replay
        <br />
        <kbd>'</kbd> Next clip
        <br />
        <kbd>;</kbd> Previous clip
        <br />
        <kbd>Up</kbd> Speed up (hold)
        <br />
        <kbd>Down</kbd> Slow down (hold)
        <br />
        <kbd>+</kbd> Zoom in
        <br />
        <kbd>-</kbd> Zoom out
        <br />
        <kbd>/</kbd> Toggle dark mode
      </div>
    `;
  }
}
