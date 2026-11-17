import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from '../components/Botao';
import EstadoVazio from '../components/EstadoVazio';
import Aviso from '../components/Aviso';
import Anel from '../components/Anel';
import Miolo from '../components/Miolo';
import { cores, fonte, moldura, olho, semContorno } from '../theme';
import useArea from '../useArea';
import { formatarMoeda, formatarReal, paraNumero } from '../util';
import { valorEmReal } from '../cotacao';
import { useCotacoes } from '../useCotacoes';

export default function MetasScreen({ navigation, metas, depositar, remover }) {
  const [depositandoId, setDepositandoId] = useState(null);
  const [valorDeposito, setValorDeposito] = useState('');
  const [erro, setErro] = useState('');
  const { cotacoes, carregando: carregandoCotacao } = useCotacoes();
  const { largo } = useArea();

  const abrirDeposito = (id) => {
    setDepositandoId(id);
    setValorDeposito('');
    setErro('');
  };

  const fecharDeposito = () => {
    setDepositandoId(null);
    setValorDeposito('');
    setErro('');
  };

  const confirmarDeposito = async (id) => {
    const numero = paraNumero(valorDeposito);
    if (!numero || numero <= 0) {
      setErro('Informe um valor maior que zero.');
      return;
    }
    const ok = await depositar(id, numero);
    if (ok) fecharDeposito();
  };

  const comAlvo = metas.map((meta) => ({
    meta,
    moeda: meta.moeda || 'BRL',
    alvoReal: valorEmReal(meta.alvo, meta.moeda || 'BRL', cotacoes),
  }));
  const totalGuardado = metas.reduce((s, m) => s + m.atual, 0);
  const totalAlvo = comAlvo.reduce((s, item) => s + (item.alvoReal || 0), 0);
  const algumaSemCotacao = comAlvo.some((item) => item.alvoReal == null);
  const progressoGeral = totalAlvo > 0 ? Math.min(totalGuardado / totalAlvo, 1) : 0;
  const concluidas = comAlvo.filter((item) => item.alvoReal != null && item.meta.atual >= item.alvoReal).length;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Miolo largura={1040} style={{ gap: 14 }}>
        {metas.length === 0 ? (
          <EstadoVazio
            icone="flag-outline"
            titulo="Nenhuma meta ainda"
            texto="Defina objetivos como uma viagem, uma reserva de emergência ou uma compra grande e acompanhe seu progresso."
          >
            <Botao titulo="Criar primeira meta" icone="add" onPress={() => navigation.navigate('NovaMeta')} />
          </EstadoVazio>
        ) : (
          <>
            <View style={styles.hero}>
              <View style={styles.blob} />
              <View style={styles.heroTopo}>
                <View style={{ flex: 1 }}>
                  <Text style={olho}>Total guardado</Text>
                  <Text style={styles.heroValor}>{formatarReal(totalGuardado)}</Text>
                  <Text style={styles.heroSub}>
                    de {formatarReal(totalAlvo)} · {concluidas} de {metas.length} {metas.length === 1 ? 'meta concluída' : 'metas concluídas'}
                  </Text>
                </View>
                <Anel progresso={progressoGeral} tamanho={86}>
                  <Text style={styles.anelTexto}>{Math.round(progressoGeral * 100)}%</Text>
                </Anel>
              </View>
              {comAlvo.some((item) => item.moeda !== 'BRL') && (
                <Text style={styles.heroNota}>
                  {carregandoCotacao
                    ? 'Consultando a cotação para converter dólar e euro.'
                    : algumaSemCotacao
                      ? 'Uma meta em dólar ou euro ficou de fora do total porque a cotação não carregou.'
                      : 'Metas em dólar ou euro entram neste total pela cotação de hoje.'}
                </Text>
              )}
              <View style={styles.heroTrilho}>
                <View style={[styles.heroPreenchido, { width: `${progressoGeral * 100}%` }]} />
              </View>
            </View>

            <Botao titulo="Nova meta" icone="add" variante="secundario" onPress={() => navigation.navigate('NovaMeta')} />

            <View style={styles.lista}>
              {comAlvo.map(({ meta, moeda, alvoReal }) => {
                const semCotacao = alvoReal == null;
                const progresso = !semCotacao && alvoReal > 0 ? Math.min(meta.atual / alvoReal, 1) : 0;
                const atingida = !semCotacao && meta.atual >= alvoReal;
                const falta = semCotacao ? null : Math.max(alvoReal - meta.atual, 0);

                return (
                  <View key={meta.id} style={[styles.itemWrap, largo && styles.itemWrapLargo]}>
                    <View style={styles.cartao}>
                      <View style={styles.topo}>
                        <Anel progresso={progresso} tamanho={72}>
                          <Text style={styles.anelTexto}>{Math.round(progresso * 100)}%</Text>
                        </Anel>
                        <View style={{ flex: 1, marginLeft: 14 }}>
                          <View style={styles.tituloLinha}>
                            <Ionicons name={meta.icone || 'flag-outline'} size={16} color={cores.lima} />
                            <Text style={styles.titulo}>{meta.titulo}</Text>
                          </View>
                          <Text style={styles.faltam}>
                            {semCotacao
                              ? `Alvo de ${formatarMoeda(meta.alvo, moeda)}. ${carregandoCotacao ? 'Consultando a cotação...' : 'A cotação não carregou.'}`
                              : atingida
                                ? 'Meta atingida!'
                                : `Faltam ${formatarReal(falta)}`}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.trilho}>
                        <View style={[styles.preenchido, { width: `${progresso * 100}%` }]} />
                      </View>
                      <Text style={styles.valores}>
                        {semCotacao
                          ? `${formatarReal(meta.atual)} guardados · alvo de ${formatarMoeda(meta.alvo, moeda)}`
                          : moeda === 'BRL'
                            ? `${formatarReal(meta.atual)} de ${formatarReal(meta.alvo)}`
                            : `${formatarReal(meta.atual)} de ${formatarReal(alvoReal)} · alvo de ${formatarMoeda(meta.alvo, moeda)}`}
                      </Text>

                      {depositandoId === meta.id ? (
                        <View style={{ marginTop: 12 }}>
                          <TextInput
                            style={styles.input}
                            value={valorDeposito}
                            onChangeText={setValorDeposito}
                            keyboardType="decimal-pad"
                            placeholder="Depósito em reais. Ex.: 150,00"
                            placeholderTextColor={cores.textoClaro}
                            autoFocus
                          />
                          {erro !== '' && <Aviso>{erro}</Aviso>}
                          <View style={styles.botoes}>
                            <Botao titulo="Confirmar" icone="checkmark" compacto onPress={() => confirmarDeposito(meta.id)} style={{ marginRight: 8 }} />
                            <Botao titulo="Cancelar" variante="suave" compacto onPress={fecharDeposito} />
                          </View>
                        </View>
                      ) : (
                        <View style={styles.botoes}>
                          <Botao titulo="Depositar" icone="add" compacto onPress={() => abrirDeposito(meta.id)} style={{ marginRight: 8 }} />
                          <Botao titulo="Excluir" icone="trash-outline" variante="perigo" compacto onPress={() => remover(meta.id)} />
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </Miolo>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  container: { padding: 20, paddingBottom: 40 },
  hero: { ...moldura, padding: 22, overflow: 'hidden' },
  blob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(198,245,74,0.1)',
    top: -80,
    right: -40,
  },
  heroTopo: { flexDirection: 'row', alignItems: 'center' },
  heroValor: { ...fonte, color: cores.lima, fontSize: 34, fontWeight: '800', letterSpacing: -1, marginTop: 6 },
  heroSub: { ...fonte, color: cores.textoSuave, fontSize: 13, marginTop: 6, lineHeight: 18 },
  heroNota: { ...fonte, color: cores.textoSuave, fontSize: 12, marginTop: 10, lineHeight: 17 },
  heroTrilho: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, marginTop: 16, overflow: 'hidden' },
  heroPreenchido: { height: 8, backgroundColor: cores.lima, borderRadius: 4 },
  anelTexto: { ...fonte, color: cores.texto, fontSize: 12, fontWeight: '800' },
  lista: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  itemWrap: { width: '100%', paddingHorizontal: 6 },
  itemWrapLargo: { width: '50%' },
  cartao: { ...moldura, padding: 16, marginBottom: 12 },
  topo: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  tituloLinha: { flexDirection: 'row', alignItems: 'center' },
  titulo: { ...fonte, fontSize: 16, fontWeight: '800', color: cores.texto, marginLeft: 6, flex: 1 },
  faltam: { ...fonte, fontSize: 13, color: cores.textoSuave, marginTop: 4, lineHeight: 18 },
  trilho: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' },
  preenchido: { height: 6, backgroundColor: cores.lima, borderRadius: 3 },
  valores: { ...fonte, fontSize: 13, color: cores.textoSuave, marginTop: 8, lineHeight: 18 },
  input: {
    ...fonte,
    ...semContorno,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: cores.fundoElevado,
    color: cores.texto,
  },
  botoes: { flexDirection: 'row', marginTop: 14, flexWrap: 'wrap' },
});
