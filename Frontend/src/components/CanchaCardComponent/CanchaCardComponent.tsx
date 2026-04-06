import { CanchaOutDTO } from "@/src/dtos/CanchaDTO";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  cancha: CanchaOutDTO;
}

export default function CanchaCardComponent({ cancha }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
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
      <Image source={{ uri: cancha.imagenUrl }} style={styles.imagen} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{cancha.nombre}</Text>
        <Text style={styles.sede}>{cancha.sede.nombre}</Text>
        <View style={styles.fila}>
          <Text style={styles.tipo}>{cancha.tipoCanchaDTO.nombre}</Text>
          <View style={styles.capacidadBadge}>
            <Ionicons name="people" size={14} color="#666" />
            <Text style={styles.capacidad}> {cancha.capacidad}</Text>
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
  imagen: { width: "100%", height: 160, backgroundColor: "#ccc" },
  info: { padding: 14 },
  nombre: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sede: { color: "#666", marginTop: 4 },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  tipo: { color: "#e10000", fontWeight: "600" },
  capacidadBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  capacidad: { color: "#666", fontSize: 13 },
});
