import { useAuth } from "@/src/context/AuthContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PerfilScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Mi Perfil</Text>
        <Text style={styles.subtitulo}>Has iniciado sesión correctamente.</Text>

        <TouchableOpacity style={styles.botonLogout} onPress={logout}>
          <Text style={styles.textoBoton}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#333" },
  subtitulo: { fontSize: 16, color: "#666", marginBottom: 30 },
  botonLogout: {
    backgroundColor: "#e10000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  textoBoton: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
