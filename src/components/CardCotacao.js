import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte, moldura, olho, tituloCartao } from '../theme';
import { formatarReal } from '../util';
import { useCotacoes } from '../useCotacoes';

function textoVariacao(valor) {
  const sinal = valor > 0 ? '+' : '';
  return `${sinal}${valor.toFixed(2).replace('.', ',')}%`;
}

export default function CardCotacao() {
  const { cotacoes, erro, carregando, recarregar } = useCotacoes();

  return (
    <View style={styles.cartao}>
      <View style={styles.topo}>
        <View style={{ flex: 1 }}>
          <Text style={olho}>Mercado</Text>
          <Text style={styles.titulo}>Cotação agora</Text>
        </View>
        <TouchableOpacity style={styles.atualizar} onPress={recarregar} disabled={carregando} accessibilityLabel="Atualizar cotação">
          <Ionicons name="refresh" size={18} color={cores.lima} />
        </TouchableOpacity>
      </View>

      {carregando && <ActivityIndicator color={cores.lima} style={{ marginTop: 16 }} />}
      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      {cotacoes &&
        cotacoes.map((item) => {
          const subiu = item.variacao >= 0;
          return (
            <View key={item.codigo} style={styles.linha}>
              <View style={styles.badge}>
                <Text style={styles.badgeTexto}>{item.codigo}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.hora}>{item.atualizado}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.valor}>{formatarReal(item.compra)}</Text>
                <Text style={[styles.variacao, { color: subiu ? cores.lima : cores.despesa }]}>
                  {textoVariacao(item.variacao)}
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: { ...moldura, padding: 18 },
  topo: { flexDirection: 'row', alignItems: 'center' },
  titulo: { ...tituloCartao, marginTop: 4 },
  atualizar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.limaSuave,
    borderWidth: 1,
    borderColor: cores.limaBorda,
  },
  erro: { ...fonte, color: cores.despesa, marginTop: 12 },
  linha: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: cores.limaSuave,
    borderWidth: 1,
    borderColor: cores.limaBorda,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeTexto: { ...fonte, color: cores.lima, fontWeight: '800', fontSize: 12, letterSpacing: 0.6 },
  nome: { ...fonte, fontSize: 15, fontWeight: '700', color: cores.texto },
  hora: { ...fonte, fontSize: 12, color: cores.textoSuave, marginTop: 2 },
  valor: { ...fonte, fontSize: 16, fontWeight: '800', color: cores.texto },
  variacao: { ...fonte, fontSize: 13, fontWeight: '700', marginTop: 2 },
});
