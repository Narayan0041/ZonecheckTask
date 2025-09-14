import React, { useEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, Alert } from "react-native";
import { supabase } from "../../lib/supabase";

export default function TasksScreen({route}) {
    const [user, setUser] = useState(route.params?.user || null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch current user on mount
  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      Alert.alert("Error fetching user", error.message);
    } else {
      setUser(user);
      fetchTasks(user.id);
    }
  }

  async function fetchTasks(userId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) Alert.alert("Error fetching tasks", error.message);
    else setTasks(data);
  }

  async function addTask() {
    if (!newTask.trim()) return Alert.alert("Task cannot be empty");

    if (!user) return Alert.alert("User not found");

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ task_title: newTask, user_id: user.id }]);

    if (error) Alert.alert("Error adding task", error.message);
    else {
      setNewTask("");
      fetchTasks(user.id);
    }
  }

  async function toggleTask(id, completed) {
    if (!user) return Alert.alert("User not found");

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", id)
      .eq("user_id", user.id); // ensure user can only update their own tasks

    if (error) Alert.alert("Error updating task", error.message);
    else fetchTasks(user.id);
  }

  async function deleteTask(id) {
    if (!user) return Alert.alert("User not found");

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // ensure user can only delete their own tasks

    if (error) Alert.alert("Error deleting task", error.message);
    else fetchTasks(user.id);
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <TextInput
        placeholder="New task"
        value={newTask}
        onChangeText={setNewTask}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 5,
              alignItems: "center",
            }}
          >
            <Text
              onPress={() => toggleTask(item.id, item.completed)}
              style={{
                textDecorationLine: item.completed ? "line-through" : "none",
                flex: 1,
              }}
            >
              {item.task_title}
            </Text>
            <Button title="Delete" onPress={() => deleteTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
