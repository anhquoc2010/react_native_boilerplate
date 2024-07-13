import { Font } from '@fonts';
import DefaultColor from '@themes/DefaultColor';
import { Dimensions, StyleProp, ViewStyle, TextStyle, ColorValue, ScaledSize } from 'react-native';
import ViewConfig from '@themes/ViewConfig';

const { width, height } = Dimensions.get('window');

/**
 * Shadow
 */
const androidDepth = {
  umbra: [
    '0px 2px 1px -1px',
    '0px 3px 1px -2px',
    '0px 3px 3px -2px',
    '0px 2px 4px -1px',
    '0px 3px 5px -1px',
    '0px 3px 5px -1px',
    '0px 4px 5px -2px',
    '0px 5px 5px -3px',
    '0px 5px 6px -3px',
    '0px 6px 6px -3px',
    '0px 6px 7px -4px',
    '0px 7px 8px -4px',
    '0px 7px 8px -4px',
    '0px 7px 9px -4px',
    '0px 8px 9px -5px',
    '0px 8px 10px -5px',
    '0px 8px 11px -5px',
    '0px 9px 11px -5px',
    '0px 9px 12px -6px',
    '0px 10px 13px -6px',
    '0px 10px 13px -6px',
    '0px 10px 14px -6px',
    '0px 11px 14px -7px',
    '0px 11px 15px -7px',
  ],
  penumbra: [
    '0px 1px 1px 0px',
    '0px 2px 2px 0px',
    '0px 3px 4px 0px',
    '0px 4px 5px 0px',
    '0px 5px 8px 0px',
    '0px 6px 10px 0px',
    '0px 7px 10px 1px',
    '0px 8px 10px 1px',
    '0px 9px 12px 1px',
    '0px 10px 14px 1px',
    '0px 11px 15px 1px',
    '0px 12px 17px 2px',
    '0px 13px 19px 2px',
    '0px 14px 21px 2px',
    '0px 15px 22px 2px',
    '0px 16px 24px 2px',
    '0px 17px 26px 2px',
    '0px 18px 28px 2px',
    '0px 19px 29px 2px',
    '0px 20px 31px 3px',
    '0px 21px 33px 3px',
    '0px 22px 35px 3px',
    '0px 23px 36px 3px',
    '0px 24px 38px 3px',
  ],
  ambient: [
    '0px 0px 0px 0px',
    '0px 1px 3px 0px',
    '0px 1px 5px 0px',
    '0px 1px 8px 0px',
    '0px 1px 10px 0px',
    '0px 1px 14px 0px',
    '0px 1px 18px 0px',
    '0px 2px 16px 1px',
    '0px 3px 14px 2px',
    '0px 3px 16px 2px',
    '0px 4px 18px 3px',
    '0px 4px 20px 3px',
    '0px 5px 22px 4px',
    '0px 5px 24px 4px',
    '0px 5px 26px 4px',
    '0px 6px 28px 5px',
    '0px 6px 30px 5px',
    '0px 6px 32px 5px',
    '0px 7px 34px 6px',
    '0px 7px 36px 6px',
    '0px 8px 38px 7px',
    '0px 8px 40px 7px',
    '0px 8px 42px 7px',
    '0px 9px 44px 8px',
    '0px 9px 46px 8px',
  ],
};
function interpolate(i: number, a: number, b: number, a2: number, b2: number) {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
}
function parseShadow(raw: any) {
  const values = raw.split(' ').map((val: any) => +val.replace('px', ''));
  return {
    x: values[0],
    y: values[1],
    blur: values[2],
    spread: values[3], // unused
  };
}
function onDepthChange(depth: number) {
  const s = parseShadow(androidDepth.penumbra[depth]);
  const y = s.y === 1 ? 1 : Math.floor(s.y * 0.5);
  return {
    elevation: depth + 1, // Android
    // iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: y,
    },
    shadowOpacity: Number.parseFloat(interpolate(depth, 1, 24, 0.2, 0.6).toFixed(2)),
    shadowRadius: Number.parseFloat(interpolate(s.blur, 1, 38, 1, 16).toFixed(2)),
  };
}

class CAppView {
  private static _instance: CAppView;

  private constructor() {
    // ...
  }

  public static get Instance(): CAppView {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CAppView._instance;
  }

  fontFamily: Font = 'GoogleSans-Regular';

  safeAreaInsets = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  shadow = (depth: number = 10) => (depth >= 1 ? onDepthChange(depth - 1) : {});

  bottomNavigationBarHeight = 45;

  headerHeight = 50;

  bodyHeight =
    height -
    this.headerHeight -
    this.bottomNavigationBarHeight -
    this.safeAreaInsets.top -
    this.safeAreaInsets.bottom;

  bodyPaddingHorizontal = Number.parseFloat(ViewConfig.spacing.DEFAULT);

  bodyWidth = width - 2 * this.bodyPaddingHorizontal;

  roundedBorderRadius = Number.parseFloat(ViewConfig.borderRadius.DEFAULT);

  bottomSheetBorderRadius = Number.parseFloat(ViewConfig.borderRadius.card);

  itemMarginHorizontal = 10;

  screenWidth = width;

  screenHeight = height;

  isHorizontal = this.screenWidth > this.screenHeight;

  // Carousel
  sliderWidth = this.screenWidth;

  itemWidth = (this.isHorizontal ? 0.35 : 0.75) * this.screenWidth + this.itemMarginHorizontal * 2;

  itemHeight = 300;

  carouselBorderRadius = 8;

  onDimensionChange = (dimensions: { window: ScaledSize; screen: ScaledSize }) => {
    const { window } = dimensions;
    this.screenWidth = window.width;
    this.screenHeight = window.height;
    const isHorizontal = window.width > window.height;
    this.isHorizontal = isHorizontal;

    if (isHorizontal) {
      // Carousel
      this.itemWidth = 0.35 * window.width + this.itemMarginHorizontal * 2;
      this.sliderWidth = window.width;
    } else {
      this.itemWidth = 0.75 * window.width + this.itemMarginHorizontal * 2;
      this.sliderWidth = window.width;
    }
  };

  initSafeArea = (safeAreaInsets: { top: number; bottom: number; left: number; right: number }) => {
    const dimensions = Dimensions.get('window');
    this.safeAreaInsets = safeAreaInsets;
    this.bodyHeight =
      dimensions.height -
      this.headerHeight -
      this.bottomNavigationBarHeight -
      safeAreaInsets.top -
      safeAreaInsets.bottom;
  };

  getHeaderStyle = (theme: typeof DefaultColor) =>
    ({
      headerStyle: {
        backgroundColor: theme.colors.background,
      } as StyleProp<ViewStyle>,
      headerTitleStyle: {
        fontSize: 22,
        color: theme.colors.grey0,
        fontWeight: 'bold',
        fontFamily: AppView.fontFamily,
      } as StyleProp<TextStyle>,
      headerShadowVisible: false,
      headerBackTitleVisible: false,
      headerBackButtonMenuEnabled: false,
      headerTintColor: theme.colors.text,
    } as any);

  getQuickStyle = ({
    outline,
    clear,
    backgroundColor,
    textColor,
    borderColor,
  }: {
    outline?: boolean;
    clear?: boolean;
    backgroundColor: ColorValue;
    textColor: ColorValue;
    borderColor?: ColorValue;
  }) => {
    let quickStyles: StyleProp<ViewStyle> = {};
    let quickTextStyles: StyleProp<TextStyle> = {};
    if (outline) {
      quickStyles = {
        backgroundColor: 'transparent',
        borderColor: borderColor || backgroundColor,
        borderWidth: 1,
        elevation: 0,
      };
      quickTextStyles = {
        color: textColor || backgroundColor,
      };
    } else if (clear) {
      quickStyles = {
        backgroundColor: 'transparent',
        elevation: 0,
        borderRadius: 0,
      };
      quickTextStyles = { color: backgroundColor };
    } else {
      quickStyles = {
        backgroundColor,
      };
    }
    return { quickStyles, quickTextStyles };
  };

  getInputQuickStyle = ({
    outline,
    clear,
  }: {
    outline?: boolean;
    clear?: boolean;
    textColor: ColorValue;
  }) => {
    let quickStyles: StyleProp<ViewStyle> = {};
    if (outline) {
      quickStyles = {
        borderWidth: 1,
        elevation: 0,
      };
    } else if (clear) {
      quickStyles = {
        backgroundColor: 'transparent',
        borderRadius: 0,
        borderBottomWidth: 1,
        elevation: 0,
      };
    } else {
      quickStyles = {
        borderWidth: 1,
      };
    }
    return { quickStyles };
  };
}

const AppView = CAppView.Instance;
export default AppView;
