module.exports = async (colorName) => {
    const colors = {
        blue: '#0000FF',
        red: '#FF0000',
        green: '#00FF00',
        yellow: '#FFFF00',
        orange: '#FFA500',
        purple: '#800080',
        cyan: '#00FFFF',
        magenta: '#FF00FF',
        pink: '#FFC0CB',
        brown: '#A52A2A',
        gray: '#808080',
        black: '#000000',
        white: '#FFFFFF',
    };

    colorName = colorName.toLowerCase();
    const hex = colors[colorName];
    return hex || null;
}