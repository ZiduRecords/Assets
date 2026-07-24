function extractColors(imgSrc) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imgSrc;

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4 * 80) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    const brightness = (r + g + b) / 3;

    let top, bottom;

    if (brightness > 150) {
      top = `rgb(${r * 0.35}, ${g * 0.35}, ${b * 0.35})`;
      bottom = `rgb(${r * 0.15}, ${g * 0.15}, ${b * 0.15})`;
    } else if (brightness < 90) {
      top = `rgb(${r + 60}, ${g + 60}, ${b + 60})`;
      bottom = `rgb(${r + 20}, ${g + 20}, ${b + 20})`;
    } else {
      top = `rgb(${r + 30}, ${g + 30}, ${b + 30})`;
      bottom = `rgb(${r - 10}, ${g - 10}, ${b - 10})`;
    }

    document.body.style.background = `linear-gradient(to bottom, ${top}, ${bottom})`;

    let titleColor;

    if (brightness > 150) {
      titleColor = `rgb(${r * 0.3}, ${g * 0.3}, ${b * 0.3})`;
    } else {
      titleColor = `rgb(${Math.min(255, r + 180)}, ${Math.min(255, g + 180)}, ${Math.min(255, b + 180)})`;
    }

    document.getElementById("song-title").style.color = titleColor;
  };
}
