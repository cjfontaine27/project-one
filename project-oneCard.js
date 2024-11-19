import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class projectOneCard extends DDDSuper(I18NMixin(LitElement)) {


    static get tag(){
        return "project-onecard";
    }
  
  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.slug = '';
    this.baseUrl = '';
    this.metadata = null;
  }

  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      slug: { type: String },
      baseUrl: { type: String },
      metadata: { type: Object }
    };
  }

  static get styles() {
    return [super.styles,css`
      :host {
        display: block;
        text-align: center;
      }

      .card {
        height: 500px;
        background: var(--ddd-theme-default-white);
        overflow: hidden;
        border: 1px solid black;
      }

      .content {
        padding: var(--ddd-spacing-4);
      }

      .title {
        text-align: center;
        font-size: var(--ddd-spacing-6);
        font-weight: var(--ddd-font-weight-bold);
      }

      .spacer {
        height: var(--ddd-spacing-1);
      }

      .description {
        color: var(--ddd-theme-default-potential70);
        overflow: hidden;
        height: var(--ddd-spacing-24);
        max-height: var(--ddd-spacing-24);
      }

      .metadata {
        margin-top: var(--ddd-spacing-3);
        font-size: var(--ddd-spacing-4);
        color: var(--ddd-theme-default-potential50);
        margin-bottom: var(--ddd-spacing-4);
      }

      .actions {
        margin-left: var(--ddd-spacing-3);
        display: flex;
        gap: var(--ddd-spacing-3);
      }

      .button {
        padding: var(--ddd-spacing-3) var(--ddd-spacing-3);
        border-radius: var(--ddd-spacing-2);
        text-decoration: none;
        font-weight: var(--ddd-font-weight-medium);
      }

      .primary {
        background: var(--ddd-theme-default-beaverBlue);
        color: var(--ddd-theme-default-limestoneLight);
      }

      .secondary {
        background: var(--ddd-theme-default-limestoneLight);
        color: var(--ddd-theme-default-beaverBlue);
      }
    `];
  }

  dateToString(timestamp){
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  }

  render() {
    const contentUrl = `${this.baseUrl}${this.slug}`;
    const sourceUrl = `${this.baseUrl}${this.slug || ""}`;

return html`
  <div class="card">
    <div class="content">
      <div class="title">${this.title || "Untitled"}</div>
    </div>
    ${this.metadata?.image ? html`
      <img src="${this.metadata.image}" alt="${this.title}" style="width: 100%; max-height: 200px; object-fit: cover;">
    ` : ''}
    <div class="content">
      <div class="description">${this.description || "No description available"}</div>
      <div class="metadata">
        <div>Updated: ${this.metadata?.updated ? this.dateToString(this.metadata.updated) : "N/A"}</div>
      </div>
      <div class="actions">
        <a href="${contentUrl}" target="_blank" class="button primary">View Content</a>
        <a href="${sourceUrl}" target="_blank" class="button secondary">View Source</a>
      </div>
    </div>
  </div>
`;

  }

  
}

customElements.define(projectOneCard.tag, projectOneCard);