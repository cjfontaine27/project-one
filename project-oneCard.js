import { LitElement, html, css } from "lit";

export class HaxItem extends LitElement {
  static get tag() {
    return "hax-item";
  }

  static get properties() {
    return {
      title: { type: String },
      image: { type: String },
      description: { type: String },
      last_updated: { type: String },
      open_component: { type: String },
      open_source: { type: String },
    };
  }

  static get styles() {
    return css`
      .card {
        border: 1px solid #ddd;
        padding: 16px;
        border-radius: 8px;
        text-align: center;
        transition: transform 0.2s;
      }

      .card:hover {
        transform: scale(1.05);
      }

      .link-button {
        display: block;
        text-decoration: none;
        color: white;
        background-color: #c81948;
        padding: 8px;
        margin-top: 8px;
        border-radius: 4px;
      }

      .card img {
        width: 100%;
        max-height: 200px;
        object-fit: cover;
      }
    `;
  }

  render() {
    return html`
      <div class="card">
        ${this.image
          ? html`<img
              src="https://haxtheweb.org/${this.image}"
              alt="${this.title} image"
            />`
          : ""}
        <h3>${this.title}</h3>
        <p>${this.description}</p>
        <p><small>Last Updated: ${this.last_updated}</small></p>
        <a href="${this.open_component}" target="_blank" class="link-button"
          >Open Content</a
        >
        <a href="${this.open_source}" target="_blank" class="link-button"
          >Open Source</a
        >
      </div>
    `;
  }
}

customElements.define(HaxItem.tag, HaxItem);