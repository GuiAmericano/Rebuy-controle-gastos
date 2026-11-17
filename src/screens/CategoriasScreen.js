import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SeletorMes from '../components/SeletorMes';
import EstadoVazio from '../components/EstadoVazio';
import Botao from '../components/Botao';
import Equivale from '../components/Equivale';
import Anel from '../components/Anel';
import Miolo from '../components/Miolo';
import { cores, fonte, moldura, olho } from '../theme';
import useArea from '../useArea';
import { formatarMoeda, formatarReal, mesAtual, moverMes, doMes, totalPorTipo, totaisPorCategoria } from '../util';
import { valorEmReal } from '../cotacao';
import { useCotacoes } from '../useCotacoes';
import { useCategorias } from '../CategoriasContext';

function rotuloUso(uso) {
  if (uso === 'receita') return 'Receita';
  if (uso === 'despesa') return 'Despesa';
  return 'Despesa e receita';
}

function TetoCategoria({ categoria, gasto, cotacoes }) {
  const moeda = categoria.moeda || 'BRL';
  const tetoReal = valorEmReal(categoria.orcamento, moeda, cotacoes);

  if (tetoReal == null) {
    return <Text style={styles.aviso}>O teto em real aparece quando a cotação carregar.</Text>;
  }

  const progresso = tetoReal > 0 ? Math.min(gasto / tetoReal, 1) : 0;
  const estourou = gasto > tetoReal;
  const diferenca = Math.abs(tetoReal - gasto);

  return (
    <View style={{ marginTop: 12 }}>
      <View style={styles.trilho}>
        <View style={[styles.preenchido, { width: `${progresso * 100}%`, backgroundColor: estourou ? cores.despesa : cores.lima }]} />
      </View>
      <Text style={styles.tetoTexto}>
        {moeda === 'BRL'
          ? `Gastou ${formatarReal(gasto)} de ${formatarReal(tetoReal)}.`
          : `Gastou ${formatarReal(gasto)} de ${formatarReal(tetoReal)} · teto de ${formatarMoeda(categoria.orcamento, moeda)} na cotação de hoje.`}
        {' '}
        {estourou ? `Passou ${formatarReal(diferenca)} do teto.` : `Ainda pode gastar ${formatarReal(diferenca)}.`}
      </Text>
    </View>
  );
}

export default function CategoriasScreen({ navigation, gastos, removerCategoria }) {
  const { info, personalizadas } = useCategorias();
  const { cotacoes } = useCotacoes();
  const { largo } = useArea();
  const [mes, setMes] = useState(mesAtual());
  const [aviso, setAviso] = useState(null);

  const lista = doMes(gastos, mes);
  const totais = totaisPorCategoria(lista);
  const totalMes = totalPorTipo(lista, 'despesa');
  const totalAnterior = totalPorTipo(doMes(gastos, moverMes(mes, -1)), 'despesa');
  const variacao = totalAnterior > 0 ? ((totalMes - totalAnterior) / totalAnterior) * 100 : null;

  const tentarExcluir = (cat) => {
    const emUso = gastos.filter((g) => g.categoria === cat.nome).length;
    if (emUso > 0) {
      setAviso({
        id: cat.id,
        texto: `Não dá para excluir: ${emUso} ${emUso === 1 ? 'lançamento usa' : 'lançamentos usam'} esta categoria.`,
      });
      return;
    }
    setAviso(null);
    removerCategoria(cat.id);
  };

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <Miolo largura={1040} style={{ gap: 14 }}>
        <Botao titulo="Nova categoria" icone="add" variante="secundario" onPress={() => navigation.navigate('NovaCategoria')} />
        <SeletorMes mes={mes} onChange={setMes} />

        {totais.length === 0 ? (
          <EstadoVazio
            icone="pie-chart-outline"
            titulo="Sem despesas neste mês"
            texto="Quando você registrar despesas, elas aparecem aqui separadas por categoria."
          />
        ) : (
          <>
            <View style={styles.resumo}>
              <Text style={olho}>Total de despesas</Text>
              <Text style={styles.resumoValor}>{formatarReal(totalMes)}</Text>
              <Equivale valorReal={totalMes} cotacoes={cotacoes} />

              {variacao !== null && (
                <View style={styles.variacaoLinha}>
                  <Ionicons
                    name={variacao > 0 ? 'trending-up' : 'trending-down'}
                    size={15}
                    color={variacao > 0 ? cores.despesa : cores.lima}
                  />
                  <Text style={[styles.variacao, { color: variacao > 0 ? cores.despesa : cores.lima }]}>
                    {Math.abs(variacao).toFixed(0)}% {variacao > 0 ? 'a mais' : 'a menos'} que no mês anterior
                  </Text>
                </View>
              )}

              <View style={styles.barraEmpilhada}>
                {totais.map((t, indice) => (
                  <View
                    key={t.categoria}
                    style={{
                      flex: t.total,
                      backgroundColor: info(t.categoria).cor,
                      marginLeft: indice ? 3 : 0,
                      borderRadius: 5,
                    }}
                  />
                ))}
              </View>
            </View>

            <View style={styles.lista}>
              {totais.map((t) => {
                const infoCat = info(t.categoria);
                const pct = totalMes > 0 ? t.total / totalMes : 0;
                return (
                  <View key={t.categoria} style={[styles.itemWrap, largo && styles.itemWrapLargo]}>
                    <View style={styles.item}>
                      <View style={styles.itemTopo}>
                        <Anel tamanho={62} progresso={pct} cor={infoCat.cor}>
                          <Ionicons name={infoCat.icone} size={16} color={infoCat.cor} />
                        </Anel>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.nome}>{t.categoria}</Text>
                          <Text style={styles.qtd}>
                            {t.quantidade} {t.quantidade === 1 ? 'lançamento' : 'lançamentos'}
                          </Text>
                          <Equivale valorReal={t.total} cotacoes={cotacoes} />
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.valor}>{formatarReal(t.total)}</Text>
                          <Text style={[styles.pct, { color: infoCat.cor }]}>{(pct * 100).toFixed(0)}%</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <Text style={styles.secaoTitulo}>Minhas categorias</Text>
        {personalizadas.length === 0 ? (
          <Text style={styles.semCategorias}>
            Você ainda não criou nenhuma categoria. Toque em "Nova categoria" para criar a sua.
          </Text>
        ) : (
          personalizadas.map((cat) => (
            <View key={cat.id} style={styles.itemSolto}>
              <View style={styles.itemTopo}>
                <View style={[styles.icone, { backgroundColor: cat.cor + '22' }]}>
                  <Ionicons name={cat.icone} size={20} color={cat.cor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nome}>{cat.nome}</Text>
                  <Text style={styles.qtd}>{rotuloUso(cat.uso)}</Text>
                  {cat.orcamento > 0 && cat.uso !== 'receita' && (
                    <Text style={styles.qtd}>Teto de {formatarMoeda(cat.orcamento, cat.moeda || 'BRL')}</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.excluir} onPress={() => tentarExcluir(cat)} accessibilityLabel="Excluir categoria">
                  <Ionicons name="trash-outline" size={16} color={cores.despesa} />
                </TouchableOpacity>
              </View>
              {cat.orcamento > 0 && (
                <TetoCategoria
                  categoria={cat}
                  gasto={totais.find((t) => t.categoria === cat.nome)?.total || 0}
                  cotacoes={cotacoes}
                />
              )}
              {aviso && aviso.id === cat.id && <Text style={styles.aviso}>{aviso.texto}</Text>}
            </View>
          ))
        )}
      </Miolo>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  container: { padding: 20, paddingBottom: 40 },
  resumo: { ...moldura, padding: 18 },
  resumoValor: { ...fonte, fontSize: 34, fontWeight: '800', color: cores.texto, letterSpacing: -1, marginTop: 6 },
  variacaoLinha: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  variacao: { ...fonte, fontSize: 13, fontWeight: '700', marginLeft: 6 },
  barraEmpilhada: { flexDirection: 'row', height: 10, marginTop: 16 },
  lista: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  itemWrap: { width: '100%', paddingHorizontal: 6, marginBottom: 12 },
  itemWrapLargo: { width: '50%' },
  item: { ...moldura, padding: 14 },
  itemSolto: { ...moldura, padding: 14 },
  itemTopo: { flexDirection: 'row', alignItems: 'center' },
  icone: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  nome: { ...fonte, fontSize: 16, fontWeight: '700', color: cores.texto },
  qtd: { ...fonte, fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  valor: { ...fonte, fontSize: 15, fontWeight: '800', color: cores.texto },
  pct: { ...fonte, fontSize: 13, fontWeight: '800', marginTop: 2 },
  trilho: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  preenchido: { height: 6, borderRadius: 3 },
  secaoTitulo: { ...fonte, fontSize: 18, fontWeight: '800', color: cores.texto, letterSpacing: -0.3, marginTop: 12 },
  semCategorias: { ...fonte, color: cores.textoSuave, lineHeight: 20 },
  excluir: {
    backgroundColor: cores.despesaFundo,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
    padding: 10,
  },
  aviso: { ...fonte, color: cores.despesa, fontSize: 13, marginTop: 10, lineHeight: 18 },
  tetoTexto: { ...fonte, color: cores.textoSuave, fontSize: 13, marginTop: 8, lineHeight: 18 },
});
