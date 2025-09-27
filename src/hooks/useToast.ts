import React from "react";
import {
  useToast as useGluestackToast,
  Toast,
  ToastTitle,
  ToastDescription,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { useTranslation } from "./useTranslation";
import { FIXED_COLORS } from "../theme/colors";

export const useToast = () => {
  const toast = useGluestackToast();
  const { t } = useTranslation();

  const showError = (message: string) => {
    toast.show({
      placement: "top",
      render: ({ id }) => {
        return React.createElement(
          Toast,
          {
            nativeID: `toast-${id}`,
            action: "error",
            variant: "solid",
            bg: FIXED_COLORS.error[600],
          },
          React.createElement(VStack, { space: "xs" }, [
            React.createElement(
              HStack,
              { alignItems: "center", key: "title" },
              React.createElement(
                ToastTitle,
                { color: FIXED_COLORS.text[50] },
                t("common.error")
              )
            ),
            React.createElement(
              ToastDescription,
              { color: FIXED_COLORS.text[100], key: "description" },
              message
            ),
          ])
        );
      },
    });
  };

  const showSuccess = (message: string) => {
    toast.show({
      placement: "top",
      render: ({ id }) => {
        return React.createElement(
          Toast,
          {
            nativeID: `toast-${id}`,
            action: "success",
            variant: "solid",
            bg: FIXED_COLORS.success[600],
          },
          React.createElement(VStack, { space: "xs" }, [
            React.createElement(
              HStack,
              { alignItems: "center", key: "title" },
              React.createElement(
                ToastTitle,
                { color: FIXED_COLORS.text[50] },
                t("common.success")
              )
            ),
            React.createElement(
              ToastDescription,
              { color: FIXED_COLORS.text[100], key: "description" },
              message
            ),
          ])
        );
      },
    });
  };

  return {
    showError,
    showSuccess,
  };
};
