import { CSSColor } from './CSSColor.js';
import { CSSRadialGradient } from './CSSRadialGradient.js';

const cssInput = document.querySelector("#cssInput");
const cssPreview = document.querySelector("#cssPreview");
const svg = document.querySelector("#svg");

const render = () => {
    const { value } = cssInput;
    cssPreview.style = value;

    const backgroundColor = new CSSColor(getComputedStyle(cssPreview).backgroundColor)
    const backgroundImage = getComputedStyle(cssPreview).backgroundImage

    let radialGradients = backgroundImage.split('),').map(value => value + ')').map(value => new CSSRadialGradient(value))

    svg.innerHTML = ''
    svg.setAttributeNS(null, 'viewBox', '0 0 1920 1080')
    svg.innerHTML = `   <title>Gradient 2</title>
    <defs>
        ${radialGradients.map((radialGradient, index) => {
            return `<radialGradient id="gradient${index}" cx="${radialGradient.position.x}%" cy="${radialGradient.position.y}%">
            <stop offset="0%" stop-color="${radialGradient.colorStops[0].color.rgb}" stop-opacity="${radialGradient.colorStops[0].color.alpha}"/>
            <stop offset="100%" stop-color="${radialGradient.colorStops[0].color.rgb}" stop-opacity="0"/>
          </radialGradient>`
        }).join('')}
  </defs>

  <rect fill="${backgroundColor.rgb}"  width="100%" height="100%" />
        ${radialGradients.map((radialGradient, index, array) => `<rect width="100%" height="100%" fill="url(#gradient${array.length - index})"/>`).join('')}
        `
  
  document.body.append(svg)

  svg.addEventListener('click', downloadSVGasTextFile)
}

function downloadSVGasTextFile() {
  //get svg source.
  var serializer = new XMLSerializer();
  var source = serializer.serializeToString(svg);

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
var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);


  const a = document.createElement('a');
  const e = new MouseEvent('click');
  

  a.download = 'download.svg';
  a.href = url
  a.dispatchEvent(e);
}

cssInput.addEventListener("input", render);
render()