import ReservaCardComponent from "@/src/components/ReservaCardComponent/ReservaCardComponent";
import { ReservaResponseDTO } from "@/src/dtos/ReservaDTO";
import { apiClient } from "@/src/services/ApiClient";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ReservasScreen() {
  const [reservas, setReservas] = useState<ReservaResponseDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const cargarMisReservas = async () => {
        setCargando(true);
        try {
          const data = await apiClient.get<ReservaResponseDTO[]>(
            "/reservas/mis-reservas",
            true,
          );
          setReservas(data);
        } catch (error) {
          console.error("Error cargando reservas", error);
        } finally {
          setCargando(false);
        }
      };

      cargarMisReservas();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tituloHeader}>Mi Historial</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#e10000" style={styles.loader} />
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.idReserva.toString()}
          renderItem={({ item }) => <ReservaCardComponent reserva={item} />}
          contentContainerStyle={styles.listaPadding}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Aún no tienes reservas programadas.
            </Text>
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
  listaPadding: { paddingBottom: 20, paddingTop: 10 },
  empty: { textAlign: "center", marginTop: 40, color: "#888", fontSize: 16 },
});
