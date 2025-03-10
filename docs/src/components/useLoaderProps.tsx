import * as React from 'react';

import { LoaderProps } from '@aws-amplify/ui-react';

import { LoaderPropControlsProps } from './LoaderPropControls';

interface UseLoaderProps {
  (initialValues: LoaderProps): LoaderPropControlsProps;
}

export const useLoaderProps: UseLoaderProps = (initialValues) => {
  const [size, setSize] = React.useState<LoaderProps['size']>(
    initialValues.size
  );
  const [variation, setVariation] = React.useState<LoaderProps['variation']>(
    initialValues.variation
  );
  const [emptyColor, setEmptyColor] = React.useState<LoaderProps['emptyColor']>(
    initialValues.emptyColor
  );
  const [filledColor, setFilledColor] = React.useState<
    LoaderProps['filledColor']
  >(initialValues.filledColor);
  return {
    size,
    setSize,
    variation,
    setVariation,
    emptyColor,
    setEmptyColor,
    filledColor,
    setFilledColor,
  };
};
