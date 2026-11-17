import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EstadoVazio from '../components/EstadoVazio';
import ItemLancamento from '../components/ItemLancamento';
import Botao from '../components/Botao';
import Fab from '../components/Fab';
import CardCotacao from '../components/CardCotacao';
import GradeAtividade from '../components/GradeAtividade';
import Miolo from '../components/Miolo';
import { cores, fonte, moldura, olho } from '../theme';
import useArea from '../useArea';
import { useCategorias } from '../CategoriasContext';
import {
  formatarReal, primeiroNome, mesAtual, moverMes, chaveMes, rotuloMes,
  doMes, totalPorTipo, totaisPorCategoria, ordenarRecentes, ABREV_MES,
} from '../util';

const ALTURA_GRAFICO = 120;

function Barra({ altura, receita }) {
  if (altura <= 0) return <View style={styles.barra} />;
  return (
    <View
      style={[
        styles.barra,
        {
          height: altura,
          backgroundColor: receita ? cores.lima : cores.despesa,
        },
        Platform.OS === 'web' && receita && { boxShadow: '0 0 14px rgba(198,245,74,0.45)' },
        Platform.OS === 'web' && {
          backgroundImage: receita
            ? 'linear-gradient(to top, #6E9A16, #E4FF8A)'
            : 'linear-gradient(to top, #8E3030, #FF9A90)',
        },
      ]}
    />
  );
}

export default function ResumoScreen({ navigation, gastos, usuario, carregarExemplos }) {
  const { info: infoCat } = useCategorias();
  const { largo } = useArea();

  if (gastos.length === 0) {
    return (
      <View style={styles.tela}>
        <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
          <Miolo style={styles.miolo}>
            <CardCotacao />
            <EstadoVazio
              icone="wallet-outline"
              titulo={`Olá, ${primeiroNome(usuario.nome)}`}
              texto="Você ainda não tem lançamentos. Registre o primeiro ou carregue dados de exemplo para conhecer o app."
            >
              <Botao titulo="Novo lançamento" icone="add" onPress={() => navigation.navigate('Novo')} />
              <Botao
                titulo="Carregar dados de exemplo"
                icone="sparkles-outline"
                variante="secundario"
                onPress={carregarExemplos}
                style={{ marginTop: 10 }}
              />
            </EstadoVazio>
          </Miolo>
        </ScrollView>
      </View>
    );
  }

  const agora = mesAtual();
  const lancamentosMes = doMes(gastos, agora);
  const receitas = totalPorTipo(lancamentosMes, 'receita');
  const despesas = totalPorTipo(lancamentosMes, 'despesa');
  const saldoMes = receitas - despesas;
  const saldoTotal = totalPorTipo(gastos, 'receita') - totalPorTipo(gastos, 'despesa');

  const serie = [-5, -4, -3, -2, -1, 0].map((delta) => {
    const m = moverMes(agora, delta);
    const lista = doMes(gastos, m);
    return {
      chave: chaveMes(m),
      rotulo: ABREV_MES[m.mes],
      receitas: totalPorTipo(lista, 'receita'),
      despesas: totalPorTipo(lista, 'despesa'),
      atual: delta === 0,
    };
  });
  const maximo = Math.max(1, ...serie.flatMap((s) => [s.receitas, s.despesas]));
  const altura = (v) => (v > 0 ? Math.max(4, (v / maximo) * ALTURA_GRAFICO) : 0);
  const saldoAntes = serie[4].receitas - serie[4].despesas;
  const deltaMes = saldoAntes !== 0 ? ((saldoMes - saldoAntes) / Math.abs(saldoAntes)) * 100 : null;

  const categorias = totaisPorCategoria(lancamentosMes).slice(0, 3);
  const recentes = ordenarRecentes(gastos).slice(0, 5);

  return (
    <View style={styles.tela}>
      <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
        <Miolo style={styles.miolo}>
          <CardCotacao />

          <View style={styles.hero}>
            <View style={styles.heroBlob} />
            <Text style={styles.heroSaudacao}>Olá, {primeiroNome(usuario.nome)}</Text>
            <Text style={[olho, { marginTop: 18 }]}>Saldo de {rotuloMes(agora)}</Text>
            <Text style={[styles.heroSaldo, { color: saldoMes < 0 ? cores.despesa : cores.lima }]}>
              {formatarReal(saldoMes)}
            </Text>

            {deltaMes != null && (
              <View style={[styles.delta, { backgroundColor: deltaMes >= 0 ? cores.receitaFundo : cores.despesaFundo }]}>
                <Ionicons
                  name={deltaMes >= 0 ? 'trending-up' : 'trending-down'}
                  size={14}
                  color={deltaMes >= 0 ? cores.lima : cores.despesa}
                />
                <Text style={[styles.deltaTexto, { color: deltaMes >= 0 ? cores.lima : cores.despesa }]}>
                  {deltaMes > 0 ? '+' : ''}{Math.round(deltaMes)}% vs mês anterior
                </Text>
              </View>
            )}

            <View style={styles.heroLinha}>
              <View style={styles.heroBloco}>
                <Text style={styles.heroMini}>Receitas</Text>
                <Text style={[styles.heroValor, { color: cores.lima }]}>{formatarReal(receitas)}</Text>
              </View>
              <View style={styles.heroBloco}>
                <Text style={styles.heroMini}>Despesas</Text>
                <Text style={[styles.heroValor, { color: cores.despesa }]}>{formatarReal(despesas)}</Text>
              </View>
            </View>
            <Text style={styles.heroTotal}>Saldo acumulado  {formatarReal(saldoTotal)}</Text>
          </View>

          <View style={[styles.linhaDupla, largo && styles.linhaDuplaLarga]}>
            <View style={[styles.cartao, largo && styles.blocoMaior]}>
              <Text style={olho}>Últimos 6 meses</Text>
              <View style={styles.legenda}>
                <View style={[styles.ponto, { backgroundColor: cores.lima }]} />
                <Text style={styles.legendaTexto}>Receitas</Text>
                <View style={[styles.ponto, { backgroundColor: cores.despesa, marginLeft: 14 }]} />
                <Text style={styles.legendaTexto}>Despesas</Text>
              </View>
              <View style={styles.grafico}>
                {serie.map((s) => (
                  <View key={s.chave} style={styles.coluna}>
                    <View style={styles.barras}>
                      <Barra altura={altura(s.receitas)} receita />
                      <Barra altura={altura(s.despesas)} />
                    </View>
                    <Text style={[styles.mesRotulo, s.atual && styles.mesAtual]}>{s.rotulo}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.cartao, largo && styles.blocoMenor]}>
              <View style={styles.cartaoCabecalho}>
                <Text style={olho}>Onde você mais gastou</Text>
                <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Categorias')}>
                  <Text style={styles.linkTexto}>Ver tudo</Text>
                  <Ionicons name="arrow-forward" size={13} color={cores.lima} />
                </TouchableOpacity>
              </View>

              {categorias.length === 0 ? (
                <Text style={styles.semDados}>Nenhuma despesa registrada neste mês.</Text>
              ) : (
                categorias.map((c) => {
                  const info = infoCat(c.categoria);
                  const pct = despesas > 0 ? c.total / despesas : 0;
                  return (
                    <View key={c.categoria} style={{ marginTop: 16 }}>
                      <View style={styles.categoriaLinha}>
                        <View style={[styles.categoriaIcone, { backgroundColor: info.cor + '22' }]}>
                          <Ionicons name={info.icone} size={16} color={info.cor} />
                        </View>
                        <Text style={styles.categoriaNome}>{c.categoria}</Text>
                        <Text style={styles.categoriaValor}>{formatarReal(c.total)}</Text>
                      </View>
                      <View style={styles.trilho}>
                        <View style={[styles.preenchido, { width: `${pct * 100}%`, backgroundColor: info.cor }]} />
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>

          <View style={[styles.linhaDupla, largo && styles.linhaDuplaLarga]}>
            <View style={largo ? styles.blocoMenor : null}>
              <GradeAtividade gastos={gastos} />
            </View>
            <View style={largo ? styles.blocoMaior : null}>
              <View style={styles.cartaoCabecalho}>
                <Text style={olho}>Últimos lançamentos</Text>
                <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Lancamentos')}>
                  <Text style={styles.linkTexto}>Ver todos</Text>
                  <Ionicons name="arrow-forward" size={13} color={cores.lima} />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 12 }}>
                {recentes.map((g) => (
                  <ItemLancamento key={g.id} item={g} mostrarData />
                ))}
              </View>
            </View>
          </View>
        </Miolo>
      </ScrollView>
      <Fab onPress={() => navigation.navigate('Novo')} />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  container: { padding: 20, paddingBottom: 120 },
  miolo: { gap: 16 },
  hero: { ...moldura, padding: 22, overflow: 'hidden' },
  heroBlob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(198,245,74,0.1)',
    top: -90,
    right: -50,
  },
  heroSaudacao: { ...fonte, color: cores.textoSuave, fontSize: 15, fontWeight: '600' },
  heroSaldo: { ...fonte, fontSize: 40, fontWeight: '800', letterSpacing: -1.4, marginTop: 6 },
  delta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  deltaTexto: { ...fonte, fontSize: 12, fontWeight: '800', marginLeft: 6 },
  heroLinha: { flexDirection: 'row', gap: 10, marginTop: 18 },
  heroBloco: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 12,
  },
  heroMini: { ...fonte, color: cores.textoSuave, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroValor: { ...fonte, fontSize: 16, fontWeight: '800', marginTop: 4 },
  heroTotal: {
    ...fonte,
    color: cores.textoSuave,
    fontSize: 13,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  linhaDupla: { gap: 16 },
  linhaDuplaLarga: { flexDirection: 'row', alignItems: 'stretch' },
  blocoMaior: { flex: 1.35 },
  blocoMenor: { flex: 1 },
  cartao: { ...moldura, padding: 18 },
  cartaoCabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  link: { flexDirection: 'row', alignItems: 'center' },
  linkTexto: { ...fonte, color: cores.lima, fontWeight: '700', fontSize: 13, marginRight: 4 },
  semDados: { ...fonte, color: cores.textoSuave, marginTop: 14 },
  legenda: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ponto: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendaTexto: { ...fonte, fontSize: 12, color: cores.textoSuave },
  grafico: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 8 },
  coluna: { flex: 1, alignItems: 'center' },
  barras: { height: ALTURA_GRAFICO, flexDirection: 'row', alignItems: 'flex-end' },
  barra: { width: 12, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginHorizontal: 2 },
  mesRotulo: { ...fonte, fontSize: 11, color: cores.textoClaro, marginTop: 8 },
  mesAtual: { color: cores.lima, fontWeight: '800' },
  categoriaLinha: { flexDirection: 'row', alignItems: 'center' },
  categoriaIcone: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  categoriaNome: { ...fonte, flex: 1, fontSize: 14, fontWeight: '700', color: cores.texto },
  categoriaValor: { ...fonte, fontSize: 14, fontWeight: '800', color: cores.texto },
  trilho: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  preenchido: { height: 6, borderRadius: 3 },
});
