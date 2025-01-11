// App.js
import React from "react";
import { SafeAreaView } from "react-native";
import Chatroom from "./Chatroom";

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Chatroom />
    </SafeAreaView>
  );
};

export default App;
