export class CSSColor {
    constructor (cssColorValue) {
        this.color = colorToRGBA(cssColorValue)
    }

    get rgb () {
        return `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`
    }

    get alpha () {
        return this.color[3] / 255
    }
}

const memoize = function(factory, ctx) {
    const cache = {};
    return (key) => {
        if (!(key in cache)) {
            cache[key] = factory.call(ctx, key);
        }
        return cache[key];
    };
};

const colorToRGBA = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');

    return memoize((col) => {
        ctx.clearRect(0, 0, 1, 1);
        // In order to detect invalid values,
        // we can't rely on col being in the same format as what fillStyle is computed as,
        // but we can ask it to implicitly compute a normalized value twice and compare.
        ctx.fillStyle = '#000';
        ctx.fillStyle = col;
        const computed = ctx.fillStyle;
        ctx.fillStyle = '#fff';
        ctx.fillStyle = col;
        if (computed !== ctx.fillStyle) {
            return; // invalid color
        }
        ctx.fillRect(0, 0, 1, 1);
        return [ ... ctx.getImageData(0, 0, 1, 1).data ];
    });
})();