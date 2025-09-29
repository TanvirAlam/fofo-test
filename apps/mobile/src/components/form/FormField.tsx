import React from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { TextInput, Text } from "react-native";

import { COLORS } from "../../utils/colors";
import { registerStyle } from "../../screens/auth/styles";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoComplete?: "email" | "name" | "tel" | "password" | "off";
  returnKeyType?: "next" | "done";
  maxLength?: number;
  onValueChange?: (value: string, onChange: (v: string) => void) => void;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoComplete = "off",
  returnKeyType = "next",
  maxLength,
  onValueChange,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <TextInput
            style={registerStyle.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCorrect={false}
            autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
            autoComplete={autoComplete}
            returnKeyType={returnKeyType}
            maxLength={maxLength}
            value={String(field.value ?? "")}
            onChangeText={(v) =>
              onValueChange
                ? onValueChange(v, field.onChange)
                : field.onChange(v)
            }
          />
          {fieldState.error?.message ? (
            <Text style={registerStyle.error}>{fieldState.error.message}</Text>
          ) : null}
        </>
      )}
    />
  );
}
