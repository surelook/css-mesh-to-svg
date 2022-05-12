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
}

cssInput.addEventListener("input", render);
render()