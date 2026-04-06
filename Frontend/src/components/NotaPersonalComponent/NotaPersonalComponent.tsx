import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  canchaId: number;
}

const getKey = (id: number) => `nota_cancha_${id}`;

export default function NotaPersonalComponent({ canchaId }: Props) {
  const [nota, setNota] = useState("");
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(getKey(canchaId)).then((v) => {
      if (v) setNota(v);
    });
  }, [canchaId]);

  const guardarNota = async () => {
    await AsyncStorage.setItem(getKey(canchaId), nota);
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <View>
      <Text style={styles.titulo}>Nota Personal</Text>

      {editando ? (
        <>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Escribe tus notas sobre esta cancha..."
            placeholderTextColor="#bbb"
            value={nota}
            onChangeText={setNota}
          />
          <TouchableOpacity style={styles.botonGuardar} onPress={guardarNota}>
            <Text style={styles.textoBoton}>Guardar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.notaContenedor}
          onPress={() => setEditando(true)}
        >
          <Text style={nota ? styles.textoNota : styles.textoVacio}>
            {nota || "Toca aquí para añadir una nota personal..."}
          </Text>
        </TouchableOpacity>
      )}

      {guardado && (
        <Text style={styles.guardadoMsg}>¡Nota guardada!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  notaContenedor: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 14,
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#eee",
  },
  textoNota: { color: "#333", fontSize: 15, lineHeight: 22 },
  textoVacio: { color: "#bbb", fontStyle: "italic" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
    color: "#333",
  },
  botonGuardar: {
    backgroundColor: "#e10000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBoton: { color: "#fff", fontWeight: "bold" },
  guardadoMsg: {
    textAlign: "center",
    color: "#28a745",
    marginTop: 8,
    fontWeight: "bold",
  },
});
