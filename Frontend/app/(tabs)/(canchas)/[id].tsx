import NotaPersonalComponent from "@/src/components/NotaPersonalComponent/NotaPersonalComponent";
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

export default function CanchaDetalleScreen() {
  const { id, nombre, imagenUrl, descripcion, capacidad } =
    useLocalSearchParams();
  const router = useRouter();

  const [dateObj, setDateObj] = useState(new Date());
  const [fechaReserva, setFechaReserva] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  const [horariosDisponibles, setHorariosDisponibles] = useState<HorarioDTO[]>(
    [],
  );
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<number | null>(
    null,
  );
  const [buscandoHorarios, setBuscandoHorarios] = useState(false);
  const [procesandoReserva, setProcesandoReserva] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setMostrarDatePicker(false);
    }

    if (event.type === "set" && selectedDate) {
      setDateObj(selectedDate);
      setFechaReserva(selectedDate.toISOString().split("T")[0]);
      setHorariosDisponibles([]);
      setHorarioSeleccionado(null);
    }
  };

  const buscarDisponibilidad = async () => {
    setBuscandoHorarios(true);
    try {
      const data = await apiClient.get<HorarioDTO[]>(
        `/canchas/${id}/horarios-disponibles?fecha=${fechaReserva}`,
        true,
      );
      setHorariosDisponibles(data);
      setHorarioSeleccionado(null);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los horarios");
    } finally {
      setBuscandoHorarios(false);
    }
  };

  const confirmarReserva = async () => {
    if (!horarioSeleccionado) return;
    setProcesandoReserva(true);
    try {
      const request: ReservaRequestDTO = {
        canchaId: Number(id),
        horarioId: horarioSeleccionado,
        fecha: fechaReserva,
      };
      await apiClient.post("/reservas", request, true);
      Alert.alert("¡Reserva confirmada!", "Tu cancha te está esperando.", [
        {
          text: "Ir a Mis Reservas",
          onPress: () => router.push("/(tabs)/(reservas)"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.mensaje || "No se pudo realizar la reserva",
      );
    } finally {
      setProcesandoReserva(false);
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.imagenContenedor}>
        <Image
          source={{ uri: imagenUrl as string }}
          style={styles.imagenHero}
        />
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contenidoTarjeta}>
        <View style={styles.headerInfo}>
          <Text style={styles.titulo}>{nombre}</Text>
          <View style={styles.badgeCapacidad}>
            <Ionicons name="people" size={16} color="#666" />
            <Text style={styles.textoCapacidad}>{capacidad} personas</Text>
          </View>
        </View>
        <Text style={styles.descripcion}>{descripcion}</Text>

        <View style={styles.separador} />

        <Text style={styles.seccionTitulo}>Programar Reserva</Text>

        <TouchableOpacity
          style={styles.selectorFecha}
          onPress={() => setMostrarDatePicker(true)}
        >
          <Ionicons name="calendar" size={20} color="#e10000" />
          <Text style={styles.fechaActual}>Fecha: {fechaReserva}</Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#999"
            style={{ marginLeft: "auto" }}
          />
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
          <Text style={styles.textoBotonBuscar}>Ver horarios disponibles</Text>
        </TouchableOpacity>

        {buscandoHorarios && (
          <ActivityIndicator style={{ marginTop: 20 }} color="#e10000" />
        )}

        {horariosDisponibles.length > 0 && (
          <View style={styles.grillaHorarios}>
            {horariosDisponibles.map((h) => (
              <TouchableOpacity
                key={h.id}
                style={[
                  styles.horarioBadge,
                  horarioSeleccionado === h.id && styles.horarioSeleccionado,
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

        {horariosDisponibles.length === 0 && !buscandoHorarios && (
          <Text style={styles.textoVacio}>
            Toca el botón para ver la disponibilidad.
          </Text>
        )}

        {horarioSeleccionado && (
          <TouchableOpacity
            style={[
              styles.botonConfirmar,
              procesandoReserva && styles.botonDisabled,
            ]}
            onPress={confirmarReserva}
            disabled={procesandoReserva}
          >
            <Text style={styles.textoBotonConfirmar}>
              {procesandoReserva ? "Procesando..." : "Confirmar Reserva"}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.separador} />

        <NotaPersonalComponent canchaId={Number(id)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  imagenContenedor: { width: "100%", height: 280, position: "relative" },
  imagenHero: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#ccc",
  },
  botonVolver: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  contenidoTarjeta: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 24,
    minHeight: 500,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#333", flex: 1 },
  badgeCapacidad: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  textoCapacidad: { marginLeft: 6, color: "#666", fontWeight: "bold" },
  descripcion: { fontSize: 16, color: "#555", lineHeight: 24 },
  separador: { height: 1, backgroundColor: "#eee", marginVertical: 24 },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
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
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotonBuscar: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  grillaHorarios: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  horarioBadge: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  horarioSeleccionado: { backgroundColor: "#e10000", borderColor: "#e10000" },
  textoHorario: { color: "#333", fontSize: 16 },
  textoHorarioSel: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  textoVacio: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontStyle: "italic",
  },
  botonConfirmar: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  botonDisabled: { backgroundColor: "#88d399", shadowOpacity: 0 },
  textoBotonConfirmar: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
