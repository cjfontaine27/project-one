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

  static get properties() {
    return {
      items: { type: Array },
      siteName: { type: String },
      siteDescription: { type: String },
      siteLogo: { type: String },
      theme: { type: String },
      created: { type: String },
      lastUpdated: { type: String },
      domain: { type: String },
      hexcode: { type: String },
    };
  }

  constructor() {
    super();
    this.items = [];
    this.siteName = "";
    this.siteDescription = "";
    this.siteLogo = "";
    this.theme = "";
    this.created = "";
    this.lastUpdated = "";
    this.domain = "https://haxtheweb.org";
    this.hexcode = "";
  }

  static get styles() {
    return css`
      .input-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #e51111f3;
        padding: 20px;
        border-radius: 8px;
        margin: 20px;
      }

      .input-container input {
        padding: 10px;
        font-size: 16px;
        width: 60%;
        margin-right: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
      }

      .input-container button {
        padding: 10px 20px;
        background-color: #0c99d5;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .input-container button:hover {
        background-color: #0aea24;
      }

      .metadata-box {
        text-align: center;
        margin-top: 20px;
        padding: 20px;
        border-radius: 8px;
        width: 300px;
        margin: 0 auto;
        animation: fadeIn 0.5s ease-in;
        background: linear-gradient(135deg, #28b08a, #0c99d5);
        color: white;
      }

      .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: center;
      }

      hax-item {
        flex: 1 1 calc(25% - 16px);
        min-width: 200px;
        max-width: 300px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: white;
      }

      hax-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .metadata-box:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      .metadata-box img {
        max-width: 50%;
        height: auto;
        margin-bottom: 10px;
      }
    `;
  }

  handleAnalyze() {
    const input = this.shadowRoot.querySelector("#url-input").value;
    this.url = input.endsWith("site.json") ? input : `${input}/site.json`;
    this.url = this.url.startsWith("https://")
      ? this.url
      : `https://${this.url}`;

    console.log("Constructed URL:", this.url);

    fetch(this.url)
      .then((response) => response.json())
      .then((data) => {
        if (this.validateData(data)) {
          this.processData(data);
        } else {
          console.error("Invalid data format.");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  validateData(data) {
    return data?.metadata && Array.isArray(data.items);
  }

  processData(data) {
    this.siteName = data.metadata.site.name || "Unknown Site";
    this.siteDescription = data.description || "No description available.";
    this.siteLogo = `${this.domain}/${data.metadata.site.logo || ""}`;
    this.theme = data.metadata.theme.name || "Unknown Theme";
    this.created = data.metadata.site.created
      ? new Date(data.metadata.site.created * 1000).toLocaleDateString()
      : "N/A";
    this.lastUpdated = data.metadata.site.updated
      ? new Date(data.metadata.site.updated * 1000).toLocaleDateString()
      : "N/A";

    this.items = data.items;
  }

  render() {
    return html`
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <h1 style="margin-right: 20px; font-size: 24px; font-weight: bold;">
          HAX Site
        </h1>
        <div class="input-container" style="flex: 1;">
          <input
            type="text"
            id="url-input"
            placeholder="Enter site URL"
            required
          />
          <button @click="${this.handleAnalyze}">Analyze</button>
        </div>
      </div>
      ${this.siteName
        ? html`
            <div class="metadata-box">
              <h2>${this.siteName}</h2>
              <p>${this.siteDescription}</p>
              ${this.siteLogo
                ? html`<img src="${this.siteLogo}" alt="Site Logo" />`
                : ""}
              <p>Theme: ${this.theme}</p>
              <p>Created: ${this.created}</p>
              <p>Last Updated: ${this.lastUpdated}</p>
            </div>
            <div class="cards-container">
              ${this.items.map(
                (item) => html`
                  <hax-item
                    title="${item.title}"
                    image="${item.metadata.images[0]}"
                    description="${item.description}"
                    last_updated="${item.metadata?.updated || "N/A"}"
                    open_component="${item.slug
                      ? `https://haxtheweb.org/${item.slug}`
                      : "#"}"
                    open_source="${item.location
                      ? `https://haxtheweb.org/${item.location}`
                      : "#"}"
                  ></hax-item>
                `
              )}
            </div>
          `
        : ""}
    `;
  }
}

globalThis.customElements.define(projectOne.tag, projectOne);