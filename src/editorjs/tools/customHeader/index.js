import Header from "@editorjs/header";
import "./index.css";

export default class CustomHeader extends Header {
  constructor({ data, config, api, readOnly }) {
    super({ data, config, api, readOnly });
  }

  /**
   * Override getTag to add data-tag attribute for styling
   */
  getTag() {
    // Call parent's getTag method
    const tag = super.getTag();

    // Add data-tag attribute for heading level-specific styling
    tag.dataset.tag = this.currentLevel.tag.toLowerCase();

    return tag;
  }
}
