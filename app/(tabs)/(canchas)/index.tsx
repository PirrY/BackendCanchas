import CanchaCardComponent from "@/src/components/CanchaCardComponent/CanchaCardComponent";
import { CanchaOutDTO } from "@/src/dtos/CanchaDTO";
import { apiClient } from "@/src/services/ApiClient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CanchasScreen() {
  const [canchas, setCanchas] = useState<CanchaOutDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        const data = await apiClient.get<CanchaOutDTO[]>("/canchas", true);
        setCanchas(data);
      } catch (error) {
        console.error("Error cargando canchas", error);
      } finally {
        setCargando(false);
      }
    };
    cargarCanchas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.tituloHeader}>Explorar Canchas</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#e10000" style={styles.loader} />
      ) : (
        <FlatList
          data={canchas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CanchaCardComponent cancha={item} />}
          contentContainerStyle={styles.listaPadding}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay canchas disponibles.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  tituloHeader: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  loader: { marginTop: 40 },
  listaPadding: { paddingBottom: 20 },
  empty: { textAlign: "center", marginTop: 40, color: "#888", fontSize: 16 },
});
