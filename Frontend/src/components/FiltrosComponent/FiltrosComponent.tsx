import { SedeDTO, TipoCanchaDTO } from "@/src/dtos/CanchaDTO";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  sedes: SedeDTO[];
  tipos: TipoCanchaDTO[];
  sedeSeleccionada: number | null;
  tipoSeleccionado: number | null;
  onSedeChange: (id: number | null) => void;
  onTipoChange: (id: number | null) => void;
}

export default function FiltrosComponent({
  sedes,
  tipos,
  sedeSeleccionada,
  tipoSeleccionado,
  onSedeChange,
  onTipoChange,
}: Props) {
  return (
    <View style={styles.contenedor}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fila}
      >
        <TouchableOpacity
          style={[styles.chip, !sedeSeleccionada && styles.chipActivo]}
          onPress={() => onSedeChange(null)}
        >
          <Text style={[styles.chipTexto, !sedeSeleccionada && styles.chipTextoActivo]}>
            Todas las sedes
          </Text>
        </TouchableOpacity>
        {sedes.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.chip, sedeSeleccionada === s.id && styles.chipActivo]}
            onPress={() => onSedeChange(sedeSeleccionada === s.id ? null : s.id)}
          >
            <Text style={[styles.chipTexto, sedeSeleccionada === s.id && styles.chipTextoActivo]}>
              {s.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fila}
      >
        <TouchableOpacity
          style={[styles.chip, !tipoSeleccionado && styles.chipActivo]}
          onPress={() => onTipoChange(null)}
        >
          <Text style={[styles.chipTexto, !tipoSeleccionado && styles.chipTextoActivo]}>
            Todos los tipos
          </Text>
        </TouchableOpacity>
        {tipos.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.chip, tipoSeleccionado === t.id && styles.chipActivo]}
            onPress={() => onTipoChange(tipoSeleccionado === t.id ? null : t.id)}
          >
            <Text style={[styles.chipTexto, tipoSeleccionado === t.id && styles.chipTextoActivo]}>
              {t.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  fila: { paddingHorizontal: 12, gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  chipActivo: { backgroundColor: "#e10000", borderColor: "#e10000" },
  chipTexto: { fontSize: 14, color: "#555" },
  chipTextoActivo: { color: "#fff", fontWeight: "bold" },
});
