import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Enable Animation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const stored = await AsyncStorage.getItem("tasks");
    if (stored) setTaskList(JSON.parse(stored));
  };

  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const addTask = () => {
    if (task.trim() === "") return;

    LayoutAnimation.easeInEaseOut();

    const newTask = {
      id: Date.now().toString(),
      title: task,
      completed: false,
    };

    setTaskList([...taskList, newTask]);
    setTask("");
  };

  const deleteTask = (id) => {
    LayoutAnimation.easeInEaseOut();
    setTaskList(taskList.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    LayoutAnimation.easeInEaseOut();
    setTaskList(
      taskList.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const saveEdit = (id) => {
    LayoutAnimation.easeInEaseOut();
    setTaskList(
      taskList.map((t) =>
        t.id === id ? { ...t, title: editingText } : t
      )
    );
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Jemal's To-Do App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a new task..."
        value={task}
        onChangeText={setTask}
      />

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={taskList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            {editingId === item.id ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={editingText}
                  onChangeText={setEditingText}
                />
                <TouchableOpacity onPress={() => saveEdit(item.id)}>
                  <Text style={styles.saveBtn}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.taskText,
                    item.completed && styles.completedTask,
                  ]}
                >
                  {item.title}
                </Text>

                <View style={styles.buttonsRow}>
                  <TouchableOpacity onPress={() => {
                    setEditingId(item.id);
                    setEditingText(item.title);
                  }}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => toggleComplete(item.id)}>
                    <Text style={styles.doneBtn}>
                      {item.completed ? "Undo" : "Done"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Text style={styles.deleteBtn}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

// BEAUTIFUL UI STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa",
    padding: 20,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 20,
    color: "#2d2d2d",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  // Task Card
  taskCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  taskText: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "gray",
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 10,
  },

  editBtn: {
    color: "blue",
    fontWeight: "bold",
  },
  doneBtn: {
    color: "green",
    fontWeight: "bold",
  },
  deleteBtn: {
    color: "red",
    fontWeight: "bold",
  },
  saveBtn: {
    color: "purple",
    fontWeight: "bold",
  },
  editInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "60%",
  },
});
