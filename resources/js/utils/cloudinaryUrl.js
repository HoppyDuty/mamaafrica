/**
 * Requests a width-capped, auto-format/auto-quality version of a Cloudinary
 * image URL for the given display context, so a full-resolution upload
 * isn't shipped to a browser rendering it in a 300px card.
 *
 * Non-Cloudinary URLs (Unsplash seed images, placehold.co fallbacks) are
 * returned unchanged - they already carry their own sizing/format params.
 *
 * @param {string|undefined|null} url
 * @param {number} width target display width in CSS px (doubled for @2x)
 */
export function cloudinaryUrl(url, width) {
    if (!url || typeof url !== 'string') return url;

    const marker = '/image/upload/';
    const idx = url.indexOf(marker);
    if (idx === -1) return url;

    const insertAt = idx + marker.length;
    const targetWidth = Math.round(width * 2); // serve @2x, CSS scales down for high-DPI screens
    return `${url.slice(0, insertAt)}w_${targetWidth},c_limit,q_auto,f_auto/${url.slice(insertAt)}`;
}
