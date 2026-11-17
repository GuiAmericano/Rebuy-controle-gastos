import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SectionList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SeletorMes from '../components/SeletorMes';
import ItemLancamento from '../components/ItemLancamento';
import EstadoVazio from '../components/EstadoVazio';
import Fab from '../components/Fab';
import Miolo from '../components/Miolo';
import { cores, fonte, moldura, olho, semContorno } from '../theme';
import { formatarReal, mesAtual, doMes, totalPorTipo, rotuloDia, ordenarRecentes } from '../util';

const FILTROS = [
  { chave: 'todos', rotulo: 'Todos' },
  { chave: 'despesa', rotulo: 'Despesas' },
  { chave: 'receita', rotulo: 'Receitas' },
];

export default function LancamentosScreen({ navigation, gastos, remover }) {
  const [mes, setMes] = useState(mesAtual());
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');

  const doPeriodo = doMes(gastos, mes);
  const receitas = totalPorTipo(doPeriodo, 'receita');
  const despesas = totalPorTipo(doPeriodo, 'despesa');

  const termo = busca.trim().toLowerCase();
  const filtrados = ordenarRecentes(
    doPeriodo.filter(
      (g) =>
        (filtro === 'todos' || g.tipo === filtro) &&
        (termo === '' || g.descricao.toLowerCase().includes(termo) || g.categoria.toLowerCase().includes(termo))
    )
  );

  const grupos = {};
  filtrados.forEach((g) => {
    (grupos[g.data] = grupos[g.data] || []).push(g);
  });
  const secoes = Object.keys(grupos)
    .sort()
    .reverse()
    .map((dia) => ({
      titulo: rotuloDia(dia),
      saldo: grupos[dia].reduce((s, g) => s + (g.tipo === 'receita' ? g.valor : -g.valor), 0),
      data: grupos[dia],
    }));

  const cabecalho = (
    <Miolo largura={860} style={{ marginBottom: 8 }}>
      <SeletorMes mes={mes} onChange={setMes} />

      <View style={styles.totais}>
        <View style={styles.total}>
          <Text style={olho}>Receitas</Text>
          <Text style={[styles.totalValor, { color: cores.lima }]}>{formatarReal(receitas)}</Text>
        </View>
        <View style={styles.total}>
          <Text style={olho}>Despesas</Text>
          <Text style={[styles.totalValor, { color: cores.despesa }]}>{formatarReal(despesas)}</Text>
        </View>
      </View>

      <View style={styles.busca}>
        <Ionicons name="search-outline" size={18} color={cores.textoClaro} />
        <TextInput
          style={styles.buscaInput}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por descrição ou categoria"
          placeholderTextColor={cores.textoClaro}
        />
        {busca !== '' && (
          <TouchableOpacity onPress={() => setBusca('')} accessibilityLabel="Limpar busca">
            <Ionicons name="close-circle" size={18} color={cores.textoClaro} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtros}>
        {FILTROS.map((f) => {
          const ativo = filtro === f.chave;
          return (
            <TouchableOpacity key={f.chave} style={[styles.filtro, ativo && styles.filtroAtivo]} onPress={() => setFiltro(f.chave)}>
              <Text style={[styles.filtroTexto, ativo && { color: cores.tinta }]}>{f.rotulo}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Miolo>
  );

  return (
    <View style={styles.tela}>
      <SectionList
        style={styles.tela}
        sections={secoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          <Miolo largura={860}>
            <EstadoVazio
              icone="receipt-outline"
              titulo="Nenhum lançamento encontrado"
              texto={
                gastos.length === 0
                  ? 'Toque em Novo para registrar seu primeiro lançamento.'
                  : 'Tente outro mês, mude o filtro ou limpe a busca.'
              }
            />
          </Miolo>
        }
        renderSectionHeader={({ section }) => (
          <Miolo largura={860}>
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>{section.titulo}</Text>
              <Text style={[styles.secaoSaldo, { color: section.saldo < 0 ? cores.despesa : cores.lima }]}>
                {formatarReal(section.saldo)}
              </Text>
            </View>
          </Miolo>
        )}
        renderItem={({ item }) => (
          <Miolo largura={860}>
            <ItemLancamento
              item={item}
              onEditar={() => navigation.navigate('Editar', { id: item.id })}
              onExcluir={() => remover(item.id)}
            />
          </Miolo>
        )}
      />
      <Fab onPress={() => navigation.navigate('Novo')} />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  lista: { padding: 20, paddingBottom: 120 },
  totais: { flexDirection: 'row', gap: 10, marginTop: 14 },
  total: { ...moldura, flex: 1, borderRadius: 18, padding: 14 },
  totalValor: { ...fonte, fontSize: 18, fontWeight: '800', marginTop: 6, letterSpacing: -0.4 },
  busca: {
    ...moldura,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 12,
    backgroundColor: cores.fundoElevado,
  },
  buscaInput: { ...fonte, ...semContorno, flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 15, color: cores.texto },
  filtros: { flexDirection: 'row', marginTop: 12 },
  filtro: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: cores.borda,
    marginRight: 8,
  },
  filtroAtivo: { backgroundColor: cores.lima, borderColor: cores.lima },
  filtroTexto: { ...fonte, fontWeight: '700', fontSize: 13, color: cores.textoSuave },
  secao: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 8, paddingHorizontal: 4 },
  secaoTitulo: { ...olho },
  secaoSaldo: { ...fonte, fontSize: 13, fontWeight: '800' },
});
