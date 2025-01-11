// Chatroom.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { saveMessage, getMessages, clearMessages } from "./dexieDB";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null); // Create a ref for the TextInput

  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await getMessages();
      setMessages(savedMessages);
    };

    loadMessages();
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const messageId = Date.now(); // Use timestamp as a unique ID
      const message = { id: messageId, text: input };
      saveMessage(message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput(""); // Clear the input field
      inputRef.current.focus(); // Focus back on the TextInput
    }
  };

  const clearAllMessages = async () => {
    await clearMessages(); // Clear messages from Dexie
    setMessages([]); // Update local state to reflect cleared messages
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
        keyExtractor={(item) => item.id.toString()} // Ensure the key is unique
      />
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef} // Attach the ref to the TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor="#aaa" // Lighter color for placeholder text
          onSubmitEditing={sendMessage} // Send message on Enter key press
          returnKeyType="send" // Change the return key to "Send"
          blurOnSubmit={false} // Prevent the TextInput from losing focus
        />
        <Button title="Send" onPress={sendMessage} color="#4CAF50" />
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearAllMessages}>
        <Text style={styles.clearButtonText}>CLEAR ALL</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background color
    padding: 10,
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444", // Darker border color
    color: "#fff", // White text color for messages
    fontSize: 18, // Font size for messages
  },
  inputContainer: {
    flexDirection: "row", // Arrange children in a row
    alignItems: "center", // Center vertically
    marginBottom: 10, // Add some space below the input
  },
  input: {
    flex: 1, // Take up remaining space
    borderColor: "#444", // Darker border color
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "#1E1E1E", // Darker input background
    color: "#fff", // White text color for input
    fontSize: 18, // Font size for input
  },
  clearButton: {
    backgroundColor: "#B22222", // Dark red color
    width: "100%", // Full width for the clear button
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff", // White text color for the clear button
  },
});

export default Chatroom;
