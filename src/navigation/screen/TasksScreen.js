import React, { useEffect, useState } from "react";
import { View, TextInput, Button, FlatList, Text, Alert } from "react-native";
import  {supabase}  from "../../lib/supabase";

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) alert(error.message);
    else setTasks(data);
  }

  async function addTask() {
    const { data, error } = await supabase.from("tasks").insert([{ task_title: newTask }]);
    if (error) Alert.alert(error.message);
    else {
      setNewTask("");
      fetchTasks();
    }
  }

  async function toggleTask(id, completed) {
    console.log("gettinf tahe task",id ,completed);
    
    const { error } = await supabase.from("tasks").update({ completed: !completed }).eq("id", id);
    if (error) Alert.alert(error.message);
    else fetchTasks();
  }

  async function deleteTask(id) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) Alert.alert(error.message);
    else fetchTasks();
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="New task"
        value={newTask}
        onChangeText={setNewTask}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
            <Text
              onPress={() => toggleTask(item.id, item.completed)}
              style={{ textDecorationLine: item.completed ? "line-through" : "none" }}
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
