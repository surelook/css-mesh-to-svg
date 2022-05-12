import { CSSColor } from "./CSSColor.js";

export class CSSRadialGradient {
    constructor (cssRadialGradientValue) {
        let regexOpenComma = /,\s*(?![^()]*\))/
        let parts = cssRadialGradientValue.split(regexOpenComma)

        const regexAt = /at\s*(\d*)%\s*(\d*)%/;

        let positionMatch = parts[0].match(regexAt)

        this.position = {
            x: positionMatch[1],
            y: positionMatch[2]
        }

        this.colorStops = parts.slice(1).map(colorStop => {
            colorStop = colorStop.trim()
            
            let parts = colorStop.split(') ').map(value => value + ')')
            return {
                color: new CSSColor(parts[0]),
                stop: parseInt(parts[1])
            }
        })
    }
}