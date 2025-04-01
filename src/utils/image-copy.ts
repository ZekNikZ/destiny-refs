export async function copyImageToClipboard(src: string) {
  let type = src.split(".").pop();
  let blob;
  console.log("type", type);

  // support JPG/PNG only
  if (type === "jpg" || type === "jpeg" || type === "avif") {
    blob = await setCanvasImage(src);
  } else if (type === "png") {
    let dataReq = await fetch(src);
    let data = await dataReq.blob();

    blob = new Blob([data], { type: "image/png" });
  }

  if (!blob) {
    console.error("Blob is null");
    return;
  }

  let cbData = [new ClipboardItem({ "image/png": blob })];
  await navigator.clipboard.write(cbData);
  console.log("Done");
}

export function setCanvasImage(path: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");

    img.onload = function () {
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      ctx?.drawImage(img, 0, 0);
      c.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    };
    img.src = path;
  });
}
