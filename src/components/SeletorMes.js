import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte, moldura } from '../theme';
import { rotuloMes, moverMes, chaveMes, mesAtual } from '../util';

export default function SeletorMes({ mes, onChange }) {
  const ehAtual = chaveMes(mes) === chaveMes(mesAtual());

  return (
    <View style={styles.caixa}>
      <TouchableOpacity style={styles.seta} onPress={() => onChange(moverMes(mes, -1))} accessibilityLabel="Mês anterior">
        <Ionicons name="chevron-back" size={18} color={cores.lima} />
      </TouchableOpacity>
      <Text style={styles.texto}>{rotuloMes(mes)}</Text>
      <TouchableOpacity
        style={[styles.seta, ehAtual && { opacity: 0.28 }]}
        disabled={ehAtual}
        onPress={() => onChange(moverMes(mes, 1))}
        accessibilityLabel="Próximo mês"
      >
        <Ionicons name="chevron-forward" size={18} color={cores.lima} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    ...moldura,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  seta: { padding: 12 },
  texto: { ...fonte, fontSize: 15, fontWeight: '700', color: cores.texto },
});
