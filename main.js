import { CSSColor } from './CSSColor.js';
import { CSSRadialGradient } from './CSSRadialGradient.js';

const cssInput = document.querySelector("#cssInput");
const cssPreview = document.querySelector("#cssPreview");
const svgPreview = document.querySelector("#svgPreview");
const downloadButton = document.querySelector("#downloadButton");

const render = () => {
    const { value } = cssInput;

    cssPreview.style = value;

    const backgroundColor = new CSSColor(getComputedStyle(cssPreview).backgroundColor)
    const backgroundImage = getComputedStyle(cssPreview).backgroundImage
    const radialGradients = backgroundImage.split('),').map(value => value + ')').map(value => new CSSRadialGradient(value))

    svgPreview.innerHTML = ''
    svgPreview.setAttributeNS(null, 'viewBox', '0 0 1920 1080')
    svgPreview.innerHTML = `   <title>Gradient 2</title>
    <defs>
        ${radialGradients.map((radialGradient, index) => {
            return `<radialGradient id="gradient${index}" cx="${radialGradient.position.x}%" cy="${radialGradient.position.y}%">
            <stop offset="0%" stop-color="${radialGradient.colorStops[0].color.rgba}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${radialGradient.colorStops[0].color.rgba}" stop-opacity="0"/>
          </radialGradient>`
        }).join('')}
  </defs>

  <rect fill="${backgroundColor.rgb}"  width="100%" height="100%" />
        ${radialGradients.map((radialGradient, index, array) => `<rect width="100%" height="100%" fill="url(#gradient${array.length - 1 - index})"/>`).join('')}
        `
}

const downloadSVGasTextFile = () => {
  //get svg source.
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgPreview);

  //add name spaces.
  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  //add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  //convert svg source to URI data scheme.
  const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
  const a = document.createElement('a');
  const e = new MouseEvent('click');
  
  a.download = 'gradient-mesh.svg';
  a.href = url
  a.dispatchEvent(e);
}

cssInput.addEventListener('input', render);
render()
downloadButton.addEventListener('click', downloadSVGasTextFile)