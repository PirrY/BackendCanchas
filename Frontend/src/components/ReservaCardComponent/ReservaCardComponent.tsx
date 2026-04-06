import { ReservaResponseDTO } from "@/src/dtos/ReservaDTO";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  reserva: ReservaResponseDTO;
}

export default function ReservaCardComponent({ reserva }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(reservas)/[id]",
          params: {
            id: reserva.idReserva,
            nombreCancha: reserva.nombreCancha,
            nombreSede: reserva.nombreSede,
            imagenUrlCancha: reserva.imagenUrlCancha,
            fecha: reserva.fecha,
            horaInicio: reserva.horaInicio,
            horaFin: reserva.horaFin,
            canchaId: reserva.canchaId,
          },
        })
      }
    >
      <Image source={{ uri: reserva.imagenUrlCancha }} style={styles.imagen} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{reserva.nombreCancha}</Text>
        <Text style={styles.sede}>{reserva.nombreSede}</Text>
        <View style={styles.fila}>
          <View style={styles.dato}>
            <Ionicons name="calendar" size={16} color="#e10000" />
            <Text style={styles.textoDato}> {reserva.fecha}</Text>
          </View>
          <View style={styles.dato}>
            <Ionicons name="time" size={16} color="#e10000" />
            <Text style={styles.textoDato}>
              {" "}
              {reserva.horaInicio} - {reserva.horaFin}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imagen: { width: "100%", height: 130, backgroundColor: "#ccc" },
  info: { padding: 14 },
  nombre: { fontSize: 16, fontWeight: "bold", color: "#333" },
  sede: { color: "#888", marginTop: 2, fontSize: 14 },
  fila: { flexDirection: "row", gap: 16, marginTop: 10 },
  dato: { flexDirection: "row", alignItems: "center" },
  textoDato: { color: "#555", fontSize: 14 },
});
