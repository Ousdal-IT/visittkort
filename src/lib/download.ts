/** Downloads arbitrary Blob-compatible data without format-specific handling. */
export function downloadFile(
  data: BlobPart | BlobPart[],
  filename: string,
  mimeType = 'application/octet-stream',
): void {
  const parts = Array.isArray(data) ? data : [data];
  const blob = data instanceof Blob ? data : new Blob(parts, { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
