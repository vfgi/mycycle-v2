import React from 'react';
import { Box } from '@gluestack-ui/themed';
import { SafeContainer } from './SafeContainer';
import { FIXED_COLORS } from '../theme/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  backgroundColor = FIXED_COLORS.background[50],
  paddingTop,
  paddingBottom,
  paddingHorizontal = 24,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
}) => {
  return (
    <SafeContainer
      backgroundColor={backgroundColor}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingHorizontal={paddingHorizontal}
    >
      <Box flex={1} justifyContent={justifyContent} alignItems={alignItems}>
        {children}
      </Box>
    </SafeContainer>
  );
};
