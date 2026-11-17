import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import Miolo from '../components/Miolo';
import { cores, fonte, moldura, olho } from '../theme';
import { formatarReal, totalPorTipo } from '../util';

export default function PerfilScreen({ navigation, usuario, gastos, metas, sair, carregarExemplos }) {
  const saldo = totalPorTipo(gastos, 'receita') - totalPorTipo(gastos, 'despesa');

  const Linha = ({ icone, titulo, descricao, onPress }) => (
    <TouchableOpacity style={styles.linha} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.linhaIcone}>
        <Ionicons name={icone} size={18} color={cores.lima} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.linhaTitulo}>{titulo}</Text>
        {descricao ? <Text style={styles.linhaDescricao}>{descricao}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={cores.textoClaro} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <Miolo largura={720} style={{ gap: 14 }}>
        <View style={styles.topo}>
          <View style={styles.blob} />
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.usuario}>@{usuario.usuario}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>

        <View style={styles.grade}>
          <View style={styles.estatistica}>
            <Text style={olho}>Lançamentos</Text>
            <Text style={styles.estatisticaValor}>{gastos.length}</Text>
          </View>
          <View style={styles.estatistica}>
            <Text style={olho}>Metas</Text>
            <Text style={styles.estatisticaValor}>{metas.length}</Text>
          </View>
        </View>
        <View style={styles.saldo}>
          <Text style={olho}>Saldo total</Text>
          <Text style={[styles.saldoValor, { color: saldo < 0 ? cores.despesa : cores.lima }]}>{formatarReal(saldo)}</Text>
        </View>

        <View style={styles.menu}>
          <Linha
            icone="key-outline"
            titulo="Alterar senha"
            descricao="Mantenha sua conta segura"
            onPress={() => navigation.navigate('AlterarSenha')}
          />
          {gastos.length === 0 && (
            <Linha
              icone="sparkles-outline"
              titulo="Carregar dados de exemplo"
              descricao="Preenche o app com lançamentos de teste"
              onPress={carregarExemplos}
            />
          )}
          <Linha
            icone="flag-outline"
            titulo="Minhas metas"
            descricao="Acompanhe seus objetivos"
            onPress={() => navigation.navigate('Metas')}
          />
        </View>

        <Botao titulo="Sair da conta" icone="log-out-outline" variante="perigo" onPress={sair} />
      </Miolo>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  container: { padding: 20, paddingBottom: 40 },
  topo: { ...moldura, alignItems: 'center', paddingVertical: 32, overflow: 'hidden' },
  blob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(198,245,74,0.1)',
    top: -110,
  },
  nome: { ...fonte, color: cores.texto, fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  usuario: { ...fonte, color: cores.lima, fontSize: 14, marginTop: 4, fontWeight: '700' },
  email: { ...fonte, color: cores.textoSuave, fontSize: 14, marginTop: 2 },
  grade: { flexDirection: 'row', gap: 12 },
  estatistica: { ...moldura, flex: 1, padding: 16 },
  estatisticaValor: { ...fonte, fontSize: 28, fontWeight: '800', color: cores.texto, marginTop: 8, letterSpacing: -0.6 },
  saldo: { ...moldura, padding: 16 },
  saldoValor: { ...fonte, fontSize: 28, fontWeight: '800', marginTop: 8, letterSpacing: -0.8 },
  menu: { ...moldura, overflow: 'hidden' },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  linhaIcone: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: cores.limaSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linhaTitulo: { ...fonte, fontSize: 15, fontWeight: '700', color: cores.texto },
  linhaDescricao: { ...fonte, fontSize: 13, color: cores.textoSuave, marginTop: 2 },
});
