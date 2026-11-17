import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte } from '../theme';

const VARIANTES = {
  primario: { fundo: cores.lima, texto: cores.tinta, borda: cores.lima },
  secundario: { fundo: 'transparent', texto: cores.lima, borda: cores.limaBorda },
  suave: { fundo: 'rgba(255,255,255,0.05)', texto: cores.textoSuave, borda: cores.borda },
  perigo: { fundo: cores.despesaFundo, texto: cores.despesa, borda: 'rgba(255,107,107,0.28)' },
};

export default function Botao({ titulo, onPress, variante = 'primario', icone, compacto = false, style }) {
  const v = VARIANTES[variante];
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.botao,
        compacto && styles.compacto,
        { backgroundColor: v.fundo, borderColor: v.borda },
        style,
      ]}
    >
      {icone && <Ionicons name={icone} size={compacto ? 16 : 18} color={v.texto} style={{ marginRight: 8 }} />}
      <Text style={[styles.texto, compacto && { fontSize: 13 }, { color: v.texto }]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  compacto: { paddingVertical: 9, paddingHorizontal: 14 },
  texto: { ...fonte, fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },
});
