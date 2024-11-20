/**
 * Copyright 2024 Christina
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `project-one`
 * 
 * @demo index.html
 * @element project-one
 */
export class projectOne extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "project-one";
  }

  constructor() {
    super();
    this.loading = false;
    this.items = [];
    this.value = '';
    this.baseUrl = '';
    this.siteData = null;
    this.date = '';
    this.error = '';
  }
  
  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      value: { type: String },
      baseUrl: { type: String },
      siteData: { type: Object },
      date: { type: String },
      error: { type: String },
    };
  }

  static get styles() {
    return [super.styles,css`
      :host {
        font-family: var(--ddd-font-primary);
        display: block;
        padding: var(--ddd-spacing-8);
      }

      .header {
        text-align: center;
        margin-bottom: var(--ddd-spacing-5);
        font-weight: var(--ddd-font-weight-bold);
        font-size: var(--ddd-spacing-10);
      }

      .container{
        display: flex;
        flex-direction: column;
        gap: var(--ddd-spacing-5, 20px);
        max-width: 1500px;
        align-items: center;
        margin: auto;
      }

      .search {
        display: flex;
        width: 700px;
        justify-content: center;
        gap: var(--ddd-spacing-3);
        margin-bottom: var(--ddd-spacing-9);
      }

      input {
        width: 500px;
        padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        font-size: var(--ddd-spacing-4);
        border: 1px solid var(--ddd-theme-default-limestoneMaxLight);
        border-radius: var(--ddd-spacing-2);
      }

      button {
        padding: var(--ddd-spacing-5);
        background: var(--ddd-theme-default-beaverBlue);
        color: var(--ddd-theme-default-white);
        border: none;
        border-radius: var(--ddd-spacing-2);
        cursor: pointer;
        font-weight: var(--ddd-font-weight-bold);
        font-size: var(--ddd-spacing-3);
      }

      button:hover {
        background: var(--ddd-theme-default-beaver80);
      }

      button:disabled {
        opacity: 0.5;
      }

      .error {
        color: var(--ddd-theme-default-error);
        text-align: center;
        margin-bottom: var(--ddd-spacing-4);
      }

      .results {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--ddd-spacing-4);
        width: 100%;
      }


      .site-overview {
        background: var(--ddd-theme-default-accent);
        width: 500px;
        padding: var(--ddd-spacing-7);
        border-radius: var(--ddd-spacing-2);
        margin-bottom: var(--ddd-spacing-2);
        text-align: center;
      }

      .site-info {
        display: grid;
        gap: var(--ddd-spacing-4);
        margin-top: var(--ddd-spacing-4);
      }

      .site-logo {
      max-width: 120px;
      max-height: 120px;
      margin: 0 auto 16px auto;
      display: block;
      border-radius: 8px;
    }

      .site-title {
        font-weight: var(--ddd-font-weight-bold);
        font-size: var(--ddd-spacing-8);
      }
    `];
  }

  validateAndFormatUrl(url) {
    try {
      let finalUrl = url.trim();
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }
      const urlObj = new URL(finalUrl);
      if (!urlObj.pathname.endsWith('site.json')) {
        urlObj.pathname = urlObj.pathname.replace(/\/?$/, '/site.json');
      }
      return urlObj.toString();
    } catch (e) {
      return null;
    }
  }

  async analyze(e) {
    e.preventDefault();
    const input = this.shadowRoot.querySelector('input');
    const url = this.validateAndFormatUrl(input.value);
  
    if (!url) {
      this.error = 'Please enter a valid URL';
      return;
    }
  
    this.loading = true;
    this.error = '';
    this.siteData = null;
    this.items = [];
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch site data');
  
      const data = await response.json();
  
      if (!data.metadata || !Array.isArray(data.items)) {
        throw new Error('Invalid site.json format');
      }
  
      this.siteData = data;
      this.items = data.items;
      this.baseUrl = url.replace('site.json', '');
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
  

  dateToString(timestamp){
    const date = new Date(timestamp * 1000);
    return date.toUTCString();
  }

  render() {
    return html`
      <div class="container">
        <div class="header">HAX Site Analyzer</div>

        <form class="search" @submit=${this.analyze}>
          <input 
            type="text" 
            placeholder="Search a HAX URL"
            ?disabled=${this.loading}
          >
          <button type="submit" ?disabled=${this.loading}>
            ${this.loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        ${this.error ? html`<div class="error">${this.error}</div>` : ''}

        ${this.siteData ? html`
  <div class="site-overview">
  ${this.siteData?.metadata?.site?.logo
    ? html`<img 
          src="${this.siteData.metadata.site.logo}" 
          alt="${this.siteData.metadata.site.name} Logo" 
          class="site-logo"
        />`
    : ""}
  <div class="site-title">${this.siteData?.metadata?.site?.name || "No Name Available"}</div>
  <p>${this.siteData?.metadata?.site?.description || "No Description Available"}</p>
  <div class="site-info">
    <div>
      <strong>Theme:</strong> ${this.siteData?.metadata?.theme?.element || "N/A"}
    </div>
    <div>
      <strong>Created:</strong> ${this.dateToString(this.siteData?.metadata?.site?.created)}
    </div>
    <div>
      <strong>Updated:</strong> ${this.dateToString(this.siteData?.metadata?.site?.updated)}
    </div>
  </div>
</div>

` : ''}


        <div class="results">
          ${this.items.map(item => html`
            <project-oneCard
              .title=${item.title}
              .description=${item.description}
              .slug=${item.slug}
              .baseUrl=${this.baseUrl}
              .metadata=${item.metadata}
              .location=${item.location}
            ></project-oneCard>
          `)}
        </div>
      </div>
    `;
  }

}


globalThis.customElements.define(projectOne.tag, projectOne);