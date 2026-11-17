import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte, moldura } from '../theme';
import { formatarReal, isoParaBR } from '../util';
import { useCategorias } from '../CategoriasContext';

export default function ItemLancamento({ item, onEditar, onExcluir, mostrarData = false }) {
  const { info: infoCat } = useCategorias();
  const info = infoCat(item.categoria);
  const receita = item.tipo === 'receita';
  const temAcoes = onEditar || onExcluir;

  return (
    <View style={[styles.item, { borderLeftColor: receita ? cores.lima : cores.despesa }]}>
      <View style={[styles.icone, { backgroundColor: info.cor + '22' }]}>
        <Ionicons name={info.icone} size={20} color={info.cor} />
      </View>

      <View style={{ flex: 1, marginRight: 8 }}>
        <Text numberOfLines={1} style={styles.descricao}>{item.descricao}</Text>
        <Text style={styles.sub}>
          {item.categoria}
          {mostrarData && item.data ? `  ·  ${isoParaBR(item.data).slice(0, 5)}` : ''}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.valor, { color: receita ? cores.lima : cores.despesa }]}>
          {receita ? '+ ' : '− '}{formatarReal(item.valor)}
        </Text>
        {temAcoes && (
          <View style={styles.acoes}>
            {onEditar && (
              <TouchableOpacity style={styles.acao} onPress={onEditar} accessibilityLabel="Editar">
                <Ionicons name="pencil-outline" size={16} color={cores.lima} />
              </TouchableOpacity>
            )}
            {onExcluir && (
              <TouchableOpacity style={styles.acao} onPress={onExcluir} accessibilityLabel="Excluir">
                <Ionicons name="trash-outline" size={16} color={cores.despesa} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    ...moldura,
    borderRadius: 18,
    borderLeftWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  icone: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  descricao: { ...fonte, fontSize: 15, fontWeight: '700', color: cores.texto },
  sub: { ...fonte, fontSize: 12, color: cores.textoSuave, marginTop: 2 },
  valor: { ...fonte, fontSize: 14, fontWeight: '800' },
  acoes: { flexDirection: 'row', marginTop: 6 },
  acao: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 6,
    marginLeft: 6,
  },
});
