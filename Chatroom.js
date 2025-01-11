// Chatroom.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";
import { createStore } from "tinybase";
import { saveMessage, getMessages, clearMessages } from "./dexieDB";

const store = createStore();

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null); // Create a ref for the TextInput

  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await getMessages();
      savedMessages.forEach((msg) => {
        store.addRow('messages', msg.id, { text: msg.text });
      });
      setMessages(savedMessages);
    };

    loadMessages();

    // Set up a listener for changes in the messages table
    const listener = store.addTablesListener('messages', () => {
      const allMessages = store.getTable('messages');
      setMessages(Object.values(allMessages));
    });

    return () => {
      listener(); // Clean up the listener on unmount
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const messageId = Date.now(); // Use timestamp as a unique ID
      const message = { id: messageId, text: input };
      store.addRow('messages', messageId, { text: input });
      saveMessage(message);
      setInput("");

      // Update the local state immediately after sending the message
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: messageId, text: input },
      ]);

      // Focus back on the TextInput
      inputRef.current.focus();
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
      <TextInput
        ref={inputRef} // Attach the ref to the TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
        onSubmitEditing={sendMessage} // Send message on Enter key press
        returnKeyType="send" // Change the return key to "Send"
        blurOnSubmit={false} // Prevent the TextInput from losing focus
      />
      <Button title="Send" onPress={sendMessage} />
      <Button title="CLEAR ALL" onPress={clearAllMessages} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Chatroom;
