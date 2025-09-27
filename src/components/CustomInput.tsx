import React from "react";
import {
  Input,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";
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
      >
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
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
