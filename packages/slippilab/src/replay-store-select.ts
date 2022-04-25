import { css, html, LitElement } from 'lit';
import { customElement, query, queryAll } from 'lit/decorators.js';
import '@spectrum-web-components/action-button/sp-action-button';
import '@spectrum-web-components/textfield/sp-textfield';
import type { ActionButton } from '@spectrum-web-components/action-button';
import { model } from './model';
import { api } from './api';


@customElement('replay-store-select')
export class ReplayStoreSelect extends LitElement {
  static get styles() {
    return css`
      input {
        display: none;
      }
      .container {
        display: flex;
        justify-content: center;
      }
    `;
  }

  @query('#replay-input-files')
  private filesInput?: HTMLInputElement;

  @query('#replay-input-dir')
  private dirInput?: HTMLInputElement;

  @queryAll('sp-action-button')
  private actionButtons?: NodeListOf<ActionButton>;

  private async uploadToReplayStore() {
    this.selectFiles(this.filesInput);
  }

  private async selectFiles(input?: HTMLInputElement) {
    if (!input?.files) {
      return;
    }
    if (input.files.length > 0) {
      var allFiles = Array.from(input.files);
      
      model.setFiles(allFiles);

      allFiles.forEach(async function (slpFile) {
        var fileNameComponents = slpFile.name.split(".");
        var fileExtension = fileNameComponents[fileNameComponents.length - 1];
        if (fileExtension == "slp") {
          console.log("Got the slp file. Trying to zip and upload");
          var zipFile = await model.zip(slpFile);
          api.postSlpReplays(zipFile);
        } else {
          api.postSlpReplays(slpFile);
        }
      })

    }
    this.actionButtons?.forEach((actionButton) => actionButton.blur());

  }


  private async openFromReplayStore() {
    const slpReplays = await api.getSlpReplays()

    if (Array.isArray(slpReplays)) {
      var files: File[] = [];

      slpReplays.forEach(async function (slpReplay) {
        console.log("Here is the srsReplay: ", slpReplay);
        var file = blobToFile(slpReplay);

        files.push(file);

      });
      model.setFiles(Array.from(files))
    }
    else {
      console.log("Error fetching replays");
    }
  }

  private openFile() {
    this.filesInput?.click();
  }


  render() {
    return html`
      <div class="container">
        <sp-field-label for="connect-code">Connect Code</sp-field-label>
        <sp-textfield id="connect-code" placeholder="Enter your connect code"></sp-textfield>
      </div>
      <div class="container">
        <sp-action-button class="label" @click=${this.openFromReplayStore}>
          Open Replay Store
        </sp-action-button>
        <sp-action-button class="label" @click=${this.openFile}>
          Save Replay Store
        </sp-action-button>
        <input
          id="replay-input-files"
          name="replay-input-files"
          type="file"
          accept=".slp,.zip"
          multiple
          @change=${this.uploadToReplayStore}
        />
      </div>
    `;
  }
}

function blobToFile(slpReplay: any) {
  const byteCharacters = atob(slpReplay.fileData);

  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: slpReplay.contentType });

  console.log("Here is the blob: ", blob);

  console.log("here is the blob content type: ", blob.type);

  var file = new File([blob], slpReplay.fileName);
  return file;
}

