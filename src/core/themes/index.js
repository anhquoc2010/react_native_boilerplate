/* eslint-disable no-unused-vars */
function create(name, ...args) {
  const json = JSON.stringify({ name, args });
  return `__${json}`;
}
const platformSelect = value => create('platformSelect', value);
const platformColor = color => create('platformColor', color);
const hairlineWidth = () => create('hairlineWidth');
const pixelRatio = v => create('pixelRatio', v);
const fontScale = v => create('fontScale', v);
const getPixelSizeForLayoutSize = n => create('getPixelSizeForLayoutSize', n);
const roundToNearestPixel = n => create('roundToNearestPixel', n);

const handleColor = () => {
  const defaultColor = require('./DefaultColor');
  const darkColor = require('./DarkColor');

  const result = {};
  Object.keys(defaultColor.colors).forEach(key => {
    result[key] = {
      DEFAULT: defaultColor.colors[key],
      dark: darkColor.colors[key],
    };
  });
  return result;
};

module.exports = {
  extend: {
    fontFamily: {
      Roboto: 'Roboto',
      GoogleSans: 'GoogleSans-regular',
      SVNPoppins: 'SVN-Poppins',
    },
    colors: {
      color: handleColor(),
    },
    ...require('./ViewConfig'),
  },
};
