import CanchaCardComponent from "@/src/components/CanchaCardComponent/CanchaCardComponent";
import FiltrosComponent from "@/src/components/FiltrosComponent/FiltrosComponent";
import { CanchaOutDTO, SedeDTO, TipoCanchaDTO } from "@/src/dtos/CanchaDTO";
import { apiClient } from "@/src/services/ApiClient";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function CanchasScreen() {
  const [canchas, setCanchas] = useState<CanchaOutDTO[]>([]);
  const [sedes, setSedes] = useState<SedeDTO[]>([]);
  const [tipos, setTipos] = useState<TipoCanchaDTO[]>([]);

  const [sedeSeleccionada, setSedeSeleccionada] = useState<number | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const sedesData = await apiClient.get<SedeDTO[]>(
          "/canchas/sedes",
          true,
        );
        const tiposData = await apiClient.get<TipoCanchaDTO[]>(
          "/canchas/tipos",
          true,
        );
        setSedes(sedesData);
        setTipos(tiposData);
      } catch (error) {
        console.error("Error cargando catálogos", error);
      }
    };
    cargarCatalogos();
  }, []);

  const cargarCanchas = useCallback(async () => {
    setCargando(true);
    try {
      let url = "/canchas?";
      if (sedeSeleccionada) url += `sedeId=${sedeSeleccionada}&`;
      if (tipoSeleccionado) url += `tipoCanchaId=${tipoSeleccionado}`;

      const data = await apiClient.get<CanchaOutDTO[]>(url, true);
      setCanchas(data);
    } catch (error) {
      console.error("Error cargando canchas", error);
    } finally {
      setCargando(false);
    }
  }, [sedeSeleccionada, tipoSeleccionado]);

  useEffect(() => {
    cargarCanchas();
  }, [cargarCanchas]);

  return (
    <View style={styles.container}>
      <Text style={styles.tituloHeader}>Explorar Canchas</Text>

      <FiltrosComponent
        sedes={sedes}
        tipos={tipos}
        sedeSeleccionada={sedeSeleccionada}
        tipoSeleccionado={tipoSeleccionado}
        onSedeChange={setSedeSeleccionada}
        onTipoChange={setTipoSeleccionado}
      />

      {cargando ? (
        <ActivityIndicator size="large" color="#e10000" style={styles.loader} />
      ) : (
        <FlatList
          data={canchas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CanchaCardComponent cancha={item} />}
          contentContainerStyle={styles.listaPadding}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay canchas con esos filtros.</Text>
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
