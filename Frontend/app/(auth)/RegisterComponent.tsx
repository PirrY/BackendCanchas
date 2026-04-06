import { RegisterInDTO } from "@/src/dtos/AuthDTO";
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

export default function RegisterComponent() {
  const router = useRouter();
  // Usamos los nombres exactos que espera Spring Boot
  const [form, setForm] = useState<RegisterInDTO>({
    nombre: "",
    correo: "",
    password: "",
  });
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    // Validación básica
    if (!form.nombre || !form.correo || !form.password) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setCargando(true);
    try {
      // Mandamos false en el 3er parámetro porque esta ruta es pública (no necesita token)
      await apiClient.post("/auth/registro", form, false);
      Alert.alert(
        "¡Éxito!",
        "Cuenta creada correctamente. Ya puedes iniciar sesión.",
      );
      router.back(); // Regresamos al login
    } catch (error: any) {
      // Gracias al GlobalExceptionHandler del backend, si el correo ya existe, nos enviará el mensaje limpio
      const mensajeError =
        error.response?.data?.mensaje || "Ocurrió un error al registrarse";
      Alert.alert("Error", mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Tu nombre completo"
        placeholderTextColor="#999"
        value={form.nombre}
        onChangeText={(v) => setForm({ ...form, nombre: v })}
      />

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
        onPress={handleRegistro}
        disabled={cargando}
      >
        <Text style={styles.buttonText}>
          {cargando ? "Registrando..." : "Registrarse"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// Puedes reutilizar los mismos styles que tenías en tu código base original
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
