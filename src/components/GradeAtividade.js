import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { cores, fonte, moldura, olho } from '../theme';
import { doMes, mesAtual, paraISO, NOMES_MES } from '../util';

const SEMANAS = 14;
const ROTULOS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const NIVEIS = ['rgba(255,255,255,0.07)', 'rgba(198,245,74,0.32)', 'rgba(198,245,74,0.62)', '#C6F54A'];

function segundaDaSemana(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  const dia = d.getDay();
  d.setDate(d.getDate() - (dia === 0 ? 6 : dia - 1));
  return d;
}

function construir(gastos) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const inicio = segundaDaSemana(hoje);
  inicio.setDate(inicio.getDate() - 7 * (SEMANAS - 1));

  const contagem = {};
  gastos.forEach((g) => {
    if (!g.data) return;
    contagem[g.data] = (contagem[g.data] || 0) + 1;
  });

  const colunas = [];
  for (let s = 0; s < SEMANAS; s++) {
    const dias = [];
    for (let d = 0; d < 7; d++) {
      const data = new Date(inicio);
      data.setDate(inicio.getDate() + s * 7 + d);
      const iso = paraISO(data);
      const futuro = data > hoje;
      const n = contagem[iso] || 0;
      const nivel = n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : 3;
      dias.push({ iso, futuro, nivel });
    }
    colunas.push(dias);
  }
  return colunas;
}

export default function GradeAtividade({ gastos }) {
  const { width } = useWindowDimensions();
  const lado = width >= 1100 ? 15 : 11;
  const colunas = useMemo(() => construir(gastos), [gastos]);
  const agora = mesAtual();
  const diasNoMes = new Set(doMes(gastos, agora).map((g) => g.data)).size;

  return (
    <View style={styles.cartao}>
      <View style={styles.topo}>
        <Text style={olho}>Atividade</Text>
        <View style={{ alignItems: 'flex-end', flex: 1, marginLeft: 12 }}>
          <Text style={styles.numero}>{diasNoMes}</Text>
          <Text style={styles.legenda}>dias com registro em {NOMES_MES[agora.mes].toLowerCase()}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 18 }}>
        <View style={styles.grade}>
          <View style={{ marginRight: 8 }}>
            {ROTULOS.map((rotulo, i) => (
              <Text key={`${rotulo}-${i}`} style={[styles.rotulo, { height: lado, marginBottom: 3, lineHeight: lado }]}>
                {rotulo}
              </Text>
            ))}
          </View>
          {colunas.map((dias, s) => (
            <View key={s} style={{ marginRight: 3 }}>
              {dias.map((dia) => (
                <View
                  key={dia.iso}
                  style={{
                    width: lado,
                    height: lado,
                    borderRadius: 3,
                    marginBottom: 3,
                    backgroundColor: dia.futuro ? 'transparent' : NIVEIS[dia.nivel],
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.escala}>
        <Text style={styles.escalaTexto}>Menos</Text>
        {NIVEIS.map((cor) => (
          <View key={cor} style={[styles.amostra, { backgroundColor: cor }]} />
        ))}
        <Text style={styles.escalaTexto}>Mais</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: { ...moldura, padding: 18 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  numero: { ...fonte, fontSize: 32, fontWeight: '800', color: cores.lima, letterSpacing: -1, lineHeight: 34 },
  legenda: { ...fonte, fontSize: 12, color: cores.textoSuave, marginTop: 4, textAlign: 'right', lineHeight: 16 },
  grade: { flexDirection: 'row' },
  rotulo: { ...fonte, fontSize: 9, color: cores.textoClaro, width: 14 },
  escala: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  escalaTexto: { ...fonte, fontSize: 11, color: cores.textoClaro, marginRight: 6 },
  amostra: { width: 11, height: 11, borderRadius: 3, marginRight: 4 },
});
