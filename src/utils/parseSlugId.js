/**
 * Parses a URL parameter in the format "${slug}-${id}" and extracts the id.
 * @param {string} param - The URL parameter (e.g., "my-post-title-abc123")
 * @returns {{ slug: string, id: string }} - Object with slug and id
 */
export function parseSlugId(param) {
  if (!param) {
    return { slug: "", id: "" };
  }

  const lastDashIndex = param.lastIndexOf("-");
  
  if (lastDashIndex === -1) {
    // No dash found, treat entire param as id (fallback for old URLs)
    return { slug: param, id: param };
  }

  const slug = param.substring(0, lastDashIndex);
  const id = param.substring(lastDashIndex + 1);

  return { slug, id };
}
