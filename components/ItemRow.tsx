import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomTextInput from "./CustomTextInput";
import { Item } from "@/types/Items";

interface ItemRowProps {
  item: Item;
  updateItem: (id: number, field: keyof Item, value: string) => void;
  removeItem: (id: number) => void;
  serialNumber: number;
}

export default function ItemRow({
  item,
  updateItem,
  removeItem,
  serialNumber,
}: ItemRowProps) {
  return (
    <View style={styles.inputRow}>
      <CustomTextInput
        label={`Item ${serialNumber}`}
        style={styles.itemInput}
        value={item.name}
        onChangeText={(text) => updateItem(item.id, "name", text)}
      />
      <CustomTextInput
        label="Qty"
        style={styles.quantityInput}
        value={item.quantity}
        onChangeText={(text) => updateItem(item.id, "quantity", text)}
        keyboardType="numeric"
      />
      <CustomTextInput
        label="Price (₹)"
        style={styles.priceInput}
        value={item.price}
        onChangeText={(text) => updateItem(item.id, "price", text)}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Feather name="trash-2" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemInput: {
    flex: 2,
    marginRight: 8,
  },
  quantityInput: {
    flex: 1,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 12,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
  },
});
