/**
 * Compress a single image file in the browser using the Canvas API.
 * Resizes to max 1200px on the longest side and re-encodes as JPEG at 75% quality.
 * Falls back to the original file if compression fails.
 */
export function compressImage(file: File, maxDimension = 1200, quality = 0.75): Promise<File> {
    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            const { width, height } = img;
            const ratio = Math.min(1, maxDimension / Math.max(width, height));
            const newWidth = Math.round(width * ratio);
            const newHeight = Math.round(height * ratio);

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(file);
                return;
            }

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, newWidth, newHeight);
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }
                    const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
                    resolve(compressed);
                },
                'image/jpeg',
                quality,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file);
        };
        img.src = objectUrl;
    });
}
