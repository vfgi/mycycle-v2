import React from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../theme/colors";

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  minHeight?: number;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  isOpen,
  onClose,
  children,
  minHeight,
}) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent
        bg={FIXED_COLORS.background[800]}
        maxHeight="90%"
        minHeight={minHeight}
      >
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {children}
      </ActionsheetContent>
    </Actionsheet>
  );
};
