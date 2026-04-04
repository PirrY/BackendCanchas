import { CanchaOutDTO } from "@/src/dtos/CanchaDTO";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  cancha: CanchaOutDTO;
}

export default function CanchaCardComponent({ cancha }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(canchas)/[id]",
          params: {
            id: cancha.id,
            nombre: cancha.nombre,
            descripcion: cancha.descripcion,
            capacidad: cancha.capacidad,
            imagenUrl: cancha.imagenUrl,
          },
        })
      }
    >
      <Text style={styles.nombre}>{cancha.nombre}</Text>
      <Text style={styles.sede}>{cancha.sede.nombre}</Text>
      <Text style={styles.tipo}>{cancha.tipoCanchaDTO.nombre}</Text>
      <Text style={styles.capacidad}>Capacidad: {cancha.capacidad} personas</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  nombre: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sede: { color: "#666", marginTop: 4 },
  tipo: { color: "#e10000", marginTop: 2 },
  capacidad: { color: "#888", marginTop: 4 },
});
