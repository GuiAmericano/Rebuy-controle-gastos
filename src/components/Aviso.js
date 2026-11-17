import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte } from '../theme';

export default function Aviso({ tipo = 'erro', children }) {
  const erro = tipo === 'erro';
  const cor = erro ? cores.despesa : cores.lima;
  return (
    <View
      style={[
        styles.caixa,
        {
          backgroundColor: erro ? cores.despesaFundo : cores.receitaFundo,
          borderColor: erro ? 'rgba(255,107,107,0.28)' : cores.limaBorda,
        },
      ]}
    >
      <Ionicons name={erro ? 'alert-circle-outline' : 'checkmark-circle'} size={18} color={cor} />
      <Text style={[styles.texto, { color: cor }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 16,
  },
  texto: { ...fonte, marginLeft: 8, flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '600' },
});
