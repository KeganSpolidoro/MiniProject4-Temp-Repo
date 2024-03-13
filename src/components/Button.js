import * as React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function Button({ title, onPress, icon, color, iconSize }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
      <Entypo name={icon} size={iconSize} color={color ? color : "white"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    marginLeft: 10,
  },
});
