import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MOEDAS } from '../cotacao';
import { cores, fonte, olho } from '../theme';

export default function SeletorMoeda({ valor, onChange }) {
  return (
    <View>
      <Text style={styles.rotulo}>Moeda</Text>
      <View style={styles.linha}>
        {MOEDAS.map((moeda) => {
          const ativa = valor === moeda.codigo;
          return (
            <TouchableOpacity
              key={moeda.codigo}
              style={[styles.chip, ativa && styles.chipAtiva]}
              onPress={() => onChange(moeda.codigo)}
            >
              <Text style={[styles.texto, ativa && styles.textoAtivo]}>{moeda.rotulo}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: { ...olho, marginTop: 18, marginBottom: 10 },
  linha: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: cores.borda,
    marginRight: 8,
    marginBottom: 8,
  },
  chipAtiva: { backgroundColor: cores.lima, borderColor: cores.lima },
  texto: { ...fonte, fontWeight: '700', fontSize: 13, color: cores.textoSuave },
  textoAtivo: { color: cores.tinta },
});
