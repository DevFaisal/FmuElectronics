import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

interface CustomTextInputProps {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  style?: object;
}

export default function CustomTextInput({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  style,
}: CustomTextInputProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={label}
        placeholderTextColor="#a0a0a0"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#4a4a4a",
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },
});
