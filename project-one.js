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
    this.title = "";
    this.siteData = null;
    this.items = [];
    this.overview = null;
  }

  static get properties() {
    return {
      title: { type: String },
      siteData: { type: Object },
      items: { type: Array },
      overview: { type: Object },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
        }
        .input-container {
          display: flex;
          gap: 0.5rem;
        }
        .overview {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
        }
        .card-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .card {
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          flex: 1 1 calc(25% - 1rem);
        }
        .card h4 {
          margin-top: 0;
        }
        @media (max-width: 800px) {
          .card {
            flex: 1 1 calc(50% - 1rem);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="input-container">
        <input id="urlInput" placeholder="Enter site URL" @input="${this._validateURL}" />
        <button @click="${this._fetchData}">Analyze</button>
      </div>
      
      ${this.overview
        ? html`
            <div class="overview">
              <h3>Overview</h3>
              <p><strong>Name:</strong> ${this.overview.name}</p>
              <p><strong>Description:</strong> ${this.overview.description}</p>
              <img src="${this.overview.logo}" alt="Site Logo" />
              <p><strong>Theme:</strong> ${this.overview.theme}</p>
              <p><strong>Created:</strong> ${this.overview.created}</p>
              <p><strong>Last Updated:</strong> ${this.overview.lastUpdated}</p>
            </div>
          `
        : ""}
      
      <div class="card-container">
        ${this.items.map(
          (item) => html`
            <div class="card">
              <h4>${item.title}</h4>
              <p>${item.description}</p>
              ${item.image ? html`<img src="${item.image}" alt="${item.title}" />` : ""}
              <p>Last updated: ${item.lastUpdated}</p>
              <a href="${item.url}" target="_blank">View Content</a>
              <a href="${item.source}" target="_blank">View Source</a>
            </div>
          `
        )}
      </div>
    `;
  }

  async _fetchData() {
    const url = this._getSiteJsonURL(this.shadowRoot.querySelector("#urlInput").value);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Invalid URL or site.json missing.");
      const data = await response.json();
      this._processData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      this.siteData = null;
    }
  }

  _getSiteJsonURL(url) {
    return url.endsWith("site.json") ? url : `${url}/site.json`;
  }

  _processData(data) {
    if (!this._isValidSiteData(data)) {
      console.error("Invalid site.json format.");
      return;
    }
    this.overview = {
      name: data.metadata.name,
      description: data.metadata.description,
      logo: data.metadata.logo,
      theme: data.metadata.theme,
      created: data.metadata.created,
      lastUpdated: data.metadata.updated,
    };
    this.items = data.items.map((item) => ({
      title: item.title,
      description: item.description || "No description available",
      image: item.image,
      lastUpdated: item.lastUpdated,
      url: item.slug ? `https://${data.metadata.domain}/${item.slug}` : "#",
      source: `https://${data.metadata.domain}/index.html`,
    }));
  }

  _isValidSiteData(data) {
    return data && data.metadata && Array.isArray(data.items);
  }

  _validateURL() {
    const input = this.shadowRoot.querySelector("#urlInput").value;
    const isValid = input && input.startsWith("http");
    this.shadowRoot.querySelector("button").disabled = !isValid;
  }
}

globalThis.customElements.define(projectOne.tag, projectOne);