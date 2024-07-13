import React from 'react';
const SafeList = () => {
  // eslint-disable-next-line no-unused-vars
  const handleSafeList = () => {
    const defaultColor = require('./DefaultColor');

    const result = [];
    Object.keys(defaultColor.colors).map(key => {
      result.push(`dark:text-color-${key}-dark`);
      result.push(`dark:bg-color-${key}-dark`);
      result.push(`dark:border-color-${key}-dark`);
    });
    return result;
  };

  return (
    <>
      {/* <View className="dark:text-color-primary-dark dark:bg-color-primary-dark dark:border-color-primary-dark dark:text-color-background-dark dark:bg-color-background-dark dark:border-color-background-dark dark:text-color-card-dark dark:bg-color-card-dark dark:border-color-card-dark dark:text-color-text-dark dark:bg-color-text-dark dark:border-color-text-dark dark:text-color-border-dark dark:bg-color-border-dark dark:border-color-border-dark dark:text-color-notification-dark dark:bg-color-notification-dark dark:border-color-notification-dark dark:text-color-grey0-dark dark:bg-color-grey0-dark dark:border-color-grey0-dark dark:text-color-grey1-dark dark:bg-color-grey1-dark dark:border-color-grey1-dark dark:text-color-grey2-dark dark:bg-color-grey2-dark dark:border-color-grey2-dark dark:text-color-grey3-dark dark:bg-color-grey3-dark dark:border-color-grey3-dark dark:text-color-grey4-dark dark:bg-color-grey4-dark dark:border-color-grey4-dark dark:text-color-grey5-dark dark:bg-color-grey5-dark dark:border-color-grey5-dark dark:text-color-white-dark dark:bg-color-white-dark dark:border-color-white-dark dark:text-color-black-dark dark:bg-color-black-dark dark:border-color-black-dark dark:text-color-info-dark dark:bg-color-info-dark dark:border-color-info-dark dark:text-color-success-dark dark:bg-color-success-dark dark:border-color-success-dark dark:text-color-warning-dark dark:bg-color-warning-dark dark:border-color-warning-dark dark:text-color-error-dark dark:bg-color-error-dark dark:border-color-error-dark" /> */}
    </>
  );
};

export default SafeList;
