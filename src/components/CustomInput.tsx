import React, { useState } from "react";
import {
  Input,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Box,
  Pressable,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { FIXED_COLORS } from "../theme/colors";

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  isInvalid?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  editable?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  isInvalid = false,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = true,
  editable = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const shouldMaskPassword = secureTextEntry ? !showPassword : false;

  return (
    <FormControl isInvalid={isInvalid}>
      <FormControlLabel>
        <FormControlLabelText
          color={FIXED_COLORS.text[50]}
          fontSize="$sm"
          fontWeight="$medium"
        >
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <Box position="relative">
        <Input
          bg={FIXED_COLORS.background[700]}
          borderColor={
            isInvalid ? FIXED_COLORS.error[300] : FIXED_COLORS.background[700]
          }
          borderWidth={1}
          borderRadius="$xl"
          $focus={{
            borderColor: FIXED_COLORS.primary[600],
            borderWidth: 1,
          }}
          $invalid={{
            borderColor: FIXED_COLORS.error[500],
            borderWidth: 2,
          }}
          shadowColor="$black"
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.1}
          shadowRadius={2}
          elevation={2}
          height={50}
          pr={secureTextEntry ? 48 : undefined}
        >
          <InputField
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            secureTextEntry={shouldMaskPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            editable={editable}
            color={FIXED_COLORS.text[50]}
            fontSize="$md"
            placeholderTextColor={FIXED_COLORS.text[400]}
            keyboardAppearance="dark"
          />
        </Input>
        {secureTextEntry && (
          <Pressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={FIXED_COLORS.text[400]}
            />
          </Pressable>
        )}
      </Box>
      {error && (
        <FormControlError>
          <FormControlErrorText
            color={FIXED_COLORS.error[600]}
            fontSize="$xs"
            mt="$1"
          >
            {error}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

const styles = StyleSheet.create({
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
