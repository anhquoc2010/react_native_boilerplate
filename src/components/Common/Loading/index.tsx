import {
  StyleProp,
  ActivityIndicator as RNActivityIndicator,
  ActivityIndicatorProps as RNActivityIndicatorProps,
  ViewStyle,
} from 'react-native';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { useTheme } from '@react-navigation/native';

export interface LoadingProps extends RNActivityIndicatorProps {
  className?: string;
  loading?: boolean;
}
const Loading: React.FC<LoadingProps> = React.forwardRef((props, ref: any) => {
  const loadingRef = useRef<RNActivityIndicator>(null);

  const theme = useTheme();
  const { style: styleProp, loading: loadingProp, ...otherProps } = props;
  const [loading, setLoading] = useState(loadingProp);

  useEffect(() => {
    setLoading(loadingProp);
  }, [loadingProp]);

  const triggerLoading = (nextLoading?: boolean) => {
    if (nextLoading === undefined) {
      setLoading(!loading);
    } else {
      if (nextLoading !== loading) {
        setLoading(nextLoading);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    ...loadingRef.current,
    triggerLoading,
  }));

  const style: StyleProp<ViewStyle> = [
    styleProp,
    {
      display: loading ? 'flex' : 'none',
    },
  ];

  return (
    <RNActivityIndicator
      testID="Loading"
      ref={loadingRef}
      color={theme.colors.primary}
      {...otherProps}
      style={style}
    />
  );
});

Loading.defaultProps = {
  loading: true,
};

export interface LoadingType extends RNActivityIndicator {
  triggerLoading: (nextLoading?: boolean) => void;
}

export default withTailwind(Loading) as React.FC<
  LoadingProps & { ref?: React.LegacyRef<RNActivityIndicator> }
>;
