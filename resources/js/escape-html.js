/**
 * Escape text for insertion into HTML (innerHTML, x-html, swal `html:`).
 *
 * Use this at RENDER time only. It is not idempotent ("&" -> "&amp;" on every
 * call), so never apply it to values that get stored — names are stored as
 * plain text.
 *
 * Exposed globally as `window.sanitizeHtml` (it replaced the sanitize-html
 * package, which caused Vite console noise due to Node module externalization).
 */
export function escapeHtml(value) {
    if (typeof value !== 'string') return value;
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function unescapeHtml(safe) {
    if (typeof safe !== 'string') return safe;
    return safe
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, `'`)
        .replace(/&amp;/g, '&');
}
