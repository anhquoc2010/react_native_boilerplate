import React from 'react';
import Text, { TextProps } from '@components/Common/Text';
import View from '@components/Common/View/View';
import { TError } from '@utils/Api';

export interface ErrorTextProps extends Omit<TextProps, 'error'> {
  error?: null | TError | string;
}

function ErrorText(props: ErrorTextProps) {
  const { error, ...otherProps } = props;

  const renderSingleMessage = (message?: string, index: number = 0) => (
    <Text
      testID="ErrorText"
      key={index.toString()}
      className="text-center my-0.5 mx-1 text-color-error"
    >
      {message === 'undefined' ? '' : message}
    </Text>
  );

  const renderMessages = () => {
    if (typeof error === 'string') {
      return renderSingleMessage(error);
    } else if (error && typeof error.message === 'string') {
      return renderSingleMessage(error.message);
    }
    return error?.messages?.map((message, index) => renderSingleMessage(message, index));
  };

  if (error) {
    return <View {...otherProps}>{renderMessages()}</View>;
  }
  return null;
}

ErrorText.defaultProps = {
  marginTop: 5,
  marginBottom: 5,
};

export default ErrorText;
