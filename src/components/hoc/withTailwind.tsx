import React from 'react';
// import AppHelper from '@utils/AppHelper';
import { styled } from 'nativewind';

const withTailwind = (WrappedComponent: React.ComponentType<any>) => {
  const WithTailwind = styled(WrappedComponent);
  // const WithTailwind: React.FC<any> = React.forwardRef((props: any, ref) => {
  //   const { className, style, ...rest } = props;
  //   const tailwind = useTailwind();
  //   const classes = className
  //     ? Array.isArray(className)
  //       ? /* istanbul ignore next */
  //         className.flat().filter(Boolean).join(' ')
  //       : className
  //     : '';

  //   return <WrappedComponent ref={ref} style={[tailwind(classes), style && style]} {...rest} />;
  // });
  // WithTailwind.displayName = `withTailwind(${AppHelper.getComponentDisplayName(WrappedComponent)})`;

  return WithTailwind;
};

export default withTailwind;
