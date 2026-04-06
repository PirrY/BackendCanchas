import { HorarioDTO, ReservaRequestDTO } from "@/src/dtos/ReservaDTO";
import { apiClient } from "@/src/services/ApiClient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ReservaDetalleScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [cancelando, setCancelando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [dateObj, setDateObj] = useState(new Date(params.fecha as string));
  const [nuevaFecha, setNuevaFecha] = useState(params.fecha as string);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState<HorarioDTO[]>(
    [],
  );
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<number | null>(
    null,
  );
  const [buscandoHorarios, setBuscandoHorarios] = useState(false);
  const [guardandoCambios, setGuardandoCambios] = useState(false);

  const confirmarCancelacion = () => {
    Alert.alert("¿Cancelar Reserva?", "Esta acción no se puede deshacer.", [
      { text: "No", style: "cancel" },
      {
        text: "Sí",
        style: "destructive",
        onPress: procesarCancelacion,
      },
    ]);
  };

  const procesarCancelacion = async () => {
    setCancelando(true);
    try {
      await apiClient.delete(`/reservas/${params.id}`, true);
      Alert.alert("Cancelada", "Tu reserva ha sido cancelada.");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.mensaje || "No se pudo cancelar",
      );
    } finally {
      setCancelando(false);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setMostrarDatePicker(false);
    if (event.type === "set" && selectedDate) {
      setDateObj(selectedDate);
      setNuevaFecha(selectedDate.toISOString().split("T")[0]);
      setHorariosDisponibles([]);
      setHorarioSeleccionado(null);
    }
  };

  const buscarDisponibilidad = async () => {
    setBuscandoHorarios(true);
    try {
      // Dependiendo de si estás en Detalle Cancha (usa `id`) o Detalle Reserva (usa `params.canchaId`)
      const idCanchaAEnviar = params.canchaId;
      const fechaAEnviar = nuevaFecha;

      console.log("=== DEBUG API ===");
      console.log(
        `URL a consultar: /canchas/${idCanchaAEnviar}/horarios-disponibles?fecha=${fechaAEnviar}`,
      );

      const data = await apiClient.get<HorarioDTO[]>(
        `/canchas/${idCanchaAEnviar}/horarios-disponibles?fecha=${fechaAEnviar}`,
        true,
      );

      setHorariosDisponibles(data);
      setHorarioSeleccionado(null);
    } catch (error: any) {
      console.log("Error detallado:", error.response?.data);
      Alert.alert(
        "Error",
        error.response?.data?.mensaje || "No se pudieron cargar los horarios",
      );
    } finally {
      setBuscandoHorarios(false);
    }
  };

  const procesarEdicion = async () => {
    if (!horarioSeleccionado) return;
    setGuardandoCambios(true);
    try {
      const request: ReservaRequestDTO = {
        canchaId: Number(params.canchaId),
        horarioId: horarioSeleccionado,
        fecha: nuevaFecha,
      };
      // Llamamos a nuestro nuevo endpoint PUT
      await apiClient.put(`/reservas/${params.id}`, request, true);
      Alert.alert("¡Actualizada!", "Tu reserva fue reprogramada con éxito.");
      setModoEdicion(false); // Salimos del modo edición
      router.back(); // Volvemos a la lista para forzar el refresco
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.mensaje || "No se pudo actualizar",
      );
    } finally {
      setGuardandoCambios(false);
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* --- CABECERA --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.botonVolver}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Detalle de Reserva</Text>

        {/* Botón para alternar Modo Edición */}
        <TouchableOpacity onPress={() => setModoEdicion(!modoEdicion)}>
          <Ionicons
            name={modoEdicion ? "close-circle" : "create"}
            size={24}
            color="#e10000"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: params.imagenUrlCancha as string }}
          style={styles.imagen}
        />

        <View style={styles.infoContenedor}>
          <Text style={styles.tituloCancha}>{params.nombreCancha}</Text>
          <Text style={styles.sede}>{params.nombreSede}</Text>

          {/* VISTA NORMAL (NO EDICIÓN) */}
          {!modoEdicion ? (
            <>
              <View style={styles.filaDato}>
                <View style={styles.iconoDato}>
                  <Ionicons name="calendar" size={20} color="#e10000" />
                </View>
                <View>
                  <Text style={styles.labelDato}>Fecha programada</Text>
                  <Text style={styles.valorDato}>{params.fecha}</Text>
                </View>
              </View>

              <View style={styles.filaDato}>
                <View style={styles.iconoDato}>
                  <Ionicons name="time" size={20} color="#e10000" />
                </View>
                <View>
                  <Text style={styles.labelDato}>Horario</Text>
                  <Text style={styles.valorDato}>
                    {params.horaInicio} - {params.horaFin}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            /* VISTA MODO EDICIÓN */
            <View style={styles.seccionEdicion}>
              <Text style={styles.seccionTitulo}>Reprogramar Reserva</Text>

              <TouchableOpacity
                style={styles.selectorFecha}
                onPress={() => setMostrarDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#e10000" />
                <Text style={styles.fechaActual}>
                  Nueva Fecha: {nuevaFecha}
                </Text>
              </TouchableOpacity>

              {mostrarDatePicker && (
                <DateTimePicker
                  value={dateObj}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={onChangeDate}
                />
              )}

              <TouchableOpacity
                style={styles.botonBuscar}
                onPress={buscarDisponibilidad}
              >
                <Text style={styles.textoBotonBuscar}>Ver horarios libres</Text>
              </TouchableOpacity>

              {buscandoHorarios && (
                <ActivityIndicator style={{ marginTop: 10 }} />
              )}

              {horariosDisponibles.length > 0 && (
                <View style={styles.grillaHorarios}>
                  {horariosDisponibles.map((h) => (
                    <TouchableOpacity
                      key={h.id}
                      style={[
                        styles.horarioBadge,
                        horarioSeleccionado === h.id &&
                          styles.horarioSeleccionado,
                      ]}
                      onPress={() => setHorarioSeleccionado(h.id)}
                    >
                      <Text
                        style={
                          horarioSeleccionado === h.id
                            ? styles.textoHorarioSel
                            : styles.textoHorario
                        }
                      >
                        {h.horaInicio.substring(0, 5)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {horarioSeleccionado && (
                <TouchableOpacity
                  style={[
                    styles.botonGuardar,
                    guardandoCambios && styles.botonDesactivadoGuardar,
                  ]}
                  onPress={procesarEdicion}
                  disabled={guardandoCambios}
                >
                  <Text style={styles.textoBotonGuardar}>
                    {guardandoCambios ? "Guardando..." : "Guardar Cambios"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {/* BOTÓN CANCELAR (Solo se muestra en modo normal) */}
      {!modoEdicion && (
        <TouchableOpacity
          style={[styles.botonCancelar, cancelando && styles.botonDesactivado]}
          onPress={confirmarCancelacion}
          disabled={cancelando}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color="#fff"
            style={styles.iconoBoton}
          />
          <Text style={styles.textoBotonCancelar}>
            {cancelando ? "Cancelando..." : "Cancelar Reserva"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  botonVolver: { padding: 4 },
  tituloHeader: { fontSize: 18, fontWeight: "bold", color: "#333" },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imagen: { width: "100%", height: 160, backgroundColor: "#ccc" },
  infoContenedor: { padding: 20 },
  tituloCancha: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  sede: { fontSize: 16, color: "#666", marginBottom: 20 },
  filaDato: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  iconoDato: {
    backgroundColor: "#fdf0f0",
    padding: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  labelDato: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  valorDato: { fontSize: 16, color: "#333", fontWeight: "500", marginTop: 2 },
  botonCancelar: {
    flexDirection: "row",
    backgroundColor: "#dc3545",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    marginBottom: 30,
  },
  botonDesactivado: { backgroundColor: "#e98b96" },
  iconoBoton: { marginRight: 8 },
  textoBotonCancelar: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  // Estilos de Edición
  seccionEdicion: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 16,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  selectorFecha: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdf0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f5c6c6",
  },
  fechaActual: {
    fontSize: 16,
    color: "#e10000",
    fontWeight: "bold",
    marginLeft: 10,
  },
  botonBuscar: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotonBuscar: { color: "#fff", fontWeight: "bold" },
  grillaHorarios: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  horarioBadge: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  horarioSeleccionado: { backgroundColor: "#e10000", borderColor: "#e10000" },
  textoHorario: { color: "#333" },
  textoHorarioSel: { color: "#fff", fontWeight: "bold" },
  botonGuardar: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  botonDesactivadoGuardar: { backgroundColor: "#88d399" },
  textoBotonGuardar: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
