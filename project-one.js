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
    return [
      super.styles,
      css`
        :host {
          display: block;
          text-align: left;
          font-family: var(--ddd-font-primary);
        }
  
        .card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
  
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
        }
  
        .image-container {
          height: 180px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
  
        .image-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
        }
  
        .content {
          padding: 16px;
        }
  
        .title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #333333;
        }
  
        .description {
          font-size: 14px;
          color: #666666;
          line-height: 1.4;
          margin: 0 0 12px 0;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
  
        .metadata {
          font-size: 12px;
          color: #999999;
          margin-bottom: 16px;
        }
  
        .actions {
          display: flex;
          gap: 8px;
          justify-content: flex-start;
        }
  
        .button {
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          display: inline-block;
          transition: background 0.3s;
        }
  
        .button.primary {
          background: #007bff;
          color: white;
          border: none;
        }
  
        .button.primary:hover {
          background: #0056b3;
        }
  
        .button.secondary {
          background: #e9ecef;
          color: #333333;
          border: none;
        }
  
        .button.secondary:hover {
          background: #ced4da;
        }
      `,
    ];
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