import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomTextInput from "@/components/CustomTextInput";
import ItemRow from "@/components/ItemRow";
import { printToPdf } from "@/utils/pdfGenerator";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as Haptics from "expo-haptics";
import { Item } from "@/types/Items";
import formatCurrency from "@/utils/formatCurrency";

export default function App() {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "", quantity: "", price: "" },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const addItem = useCallback(() => {
    setItems((prevItems) => [
      ...prevItems,
      { id: Date.now(), name: "", quantity: "", price: "" },
    ]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const updateItem = useCallback(
    (id: number, field: keyof Item, value: string) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const removeItem = useCallback(
    (id: number) => {
      if (items.length > 1) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Alert.alert("Cannot Remove", "You must have at least one item.");
      }
    },
    [items.length]
  );

  const handlePrint = useCallback(async () => {
    if (!customerName.trim()) {
      Alert.alert("Error", "Please enter customer name.");
      return;
    }

    const validItems = items.filter(
      (item) => item.name.trim() && item.quantity.trim() && item.price.trim()
    );

    if (validItems.length === 0) {
      Alert.alert("Error", "Please add at least one valid item to the bill.");
      return;
    }

    try {
      await printToPdf(customerName, validItems);
      Alert.alert("Success", "PDF has been generated and saved.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [customerName, items]);

  const totalAmount = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.price) * parseInt(item.quantity) || 0),
      0
    );
  }, [items]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>FMU Electronics</Text>
            <Text style={styles.subtitle}>Bill Generator</Text>
          </View>
          <CustomTextInput
            label="Customer's Name"
            value={customerName}
            onChangeText={setCustomerName}
            style={styles.customerInput}
          />
          {items.map((item, index) => (
            <ItemRow
              key={item.id}
              item={item}
              updateItem={updateItem}
              removeItem={removeItem}
              serialNumber={index + 1}
            />
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
            <Feather name="printer" size={20} color="#fff" />
            <Text style={styles.buttonText}>Generate Bill</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: "#1a1a1a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: "#4a4a4a",
    marginTop: 8,
  },
  customerInput: {
    marginBottom: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "#1a1a1a",
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#1a1a1a",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  printButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginLeft: 8,
  },
});
