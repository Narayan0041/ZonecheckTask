import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useNavigation } from "@react-navigation/native";

export default function AuthScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check existing session on app load
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigation.replace("TasksScreen", { user: session.user });
      }
    }
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigation.replace("TasksScreen", { user: session.user });
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function signIn() {
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("hkjbjksjkbjj",data);
    
    setLoading(false);

    if (error) {
      if (error.message.includes("email not confirmed")) {
        Alert.alert(
          "Email not confirmed",
          "Please check your email and confirm your account before signing in."
        );
      } else {
        Alert.alert("Sign In Error", error.message);
      }
    } else {
      // Successful login, user is in data.user
      navigation.replace("TasksScreen", { user: data.user });
    }
  }

  async function signUp() {
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert("Sign Up Error", error.message);
    } else {
      Alert.alert(
        "Sign Up Successful",
        "Check your email to confirm your account before logging in."
      );
      // After signup, don't auto-navigate; wait for email confirmation
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#4a90e2" style={{ marginBottom: 20 }} />}

      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={signUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "#50c878",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
