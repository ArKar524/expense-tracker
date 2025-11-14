import React from "react";
import { View } from "react-native";

export default function ItemSeparator() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#34d399",
        opacity: 0.2,
      }}
    />
  );
}
