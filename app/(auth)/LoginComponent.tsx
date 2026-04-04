import { useAuth } from "@/src/context/AuthContext";
import { LoginInDTO, LoginOutDTO } from "@/src/dtos/AuthDTO";
import { apiClient } from "@/src/services/ApiClient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginComponent() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<LoginInDTO>({ correo: "", password: "" });
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!form.correo || !form.password) {
      Alert.alert("Aviso", "Ingresa tu correo y contraseña");
      return;
    }

    setCargando(true);
    try {
      const response = await apiClient.post<LoginOutDTO, LoginInDTO>(
        "/auth/login",
        form,
        false,
      );

      await login(response.token);
    } catch (error: any) {
      const mensajeError =
        error.response?.data?.mensaje || "Credenciales incorrectas";
      Alert.alert("Error de acceso", mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.correo}
        onChangeText={(v) => setForm({ ...form, correo: v })}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={form.password}
        onChangeText={(v) => setForm({ ...form, password: v })}
      />

      <TouchableOpacity
        style={[styles.button, cargando && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={cargando}
      >
        <Text style={styles.buttonText}>
          {cargando ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/RegisterComponent")}
      >
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 32 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#e10000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: { backgroundColor: "#ff6666" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#e10000", fontSize: 14 },
});
