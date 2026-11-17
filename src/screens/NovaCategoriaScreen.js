import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import Aviso from '../components/Aviso';
import SeletorMoeda from '../components/SeletorMoeda';
import Miolo from '../components/Miolo';
import { cores, fonte, moldura, olho } from '../theme';
import { ICONES_CATEGORIA, CORES_CATEGORIA, formatarMoeda, formatarReal, paraNumero } from '../util';
import { valorEmReal } from '../cotacao';
import { useCotacoes } from '../useCotacoes';
import { useCategorias } from '../CategoriasContext';

const USOS = [
  { chave: 'despesa', rotulo: 'Despesa' },
  { chave: 'receita', rotulo: 'Receita' },
  { chave: 'ambos', rotulo: 'Ambas' },
];

const estilosUso = {
  despesa: { backgroundColor: cores.despesaFundo, borderColor: 'rgba(255,107,107,0.45)' },
  receita: { backgroundColor: cores.receitaFundo, borderColor: cores.limaBorda },
  ambos: { backgroundColor: cores.limaSuave, borderColor: cores.limaBorda },
};

const textosUso = {
  despesa: { color: cores.despesa },
  receita: { color: cores.lima },
  ambos: { color: cores.lima },
};

function tintaDoFundo(hex) {
  const n = parseInt(String(hex).replace('#', ''), 16);
  if (!Number.isFinite(n)) return '#FFFFFF';
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.62 ? cores.tinta : '#FFFFFF';
}

export default function NovaCategoriaScreen({ navigation, adicionarCategoria }) {
  const { existe } = useCategorias();

  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState(ICONES_CATEGORIA[0]);
  const [cor, setCor] = useState(CORES_CATEGORIA[0]);
  const [teto, setTeto] = useState('');
  const [moeda, setMoeda] = useState('BRL');
  const [uso, setUso] = useState('despesa');
  const [erro, setErro] = useState('');
  const { cotacoes } = useCotacoes();

  const limpar = () => {
    setNome('');
    setIcone(ICONES_CATEGORIA[0]);
    setCor(CORES_CATEGORIA[0]);
    setTeto('');
    setMoeda('BRL');
    setUso('despesa');
    setErro('');
  };

  const tetoNumero = paraNumero(teto);
  const tetoEmReal = Number.isFinite(tetoNumero) ? valorEmReal(tetoNumero, moeda, cotacoes) : null;

  const salvar = async () => {
    const nomeLimpo = nome.trim();

    if (nomeLimpo === '') {
      setErro('Dê um nome para a categoria.');
      return;
    }
    if (existe(nomeLimpo)) {
      setErro('Já existe uma categoria com esse nome.');
      return;
    }

    const dados = { nome: nomeLimpo, icone, cor, uso };
    if (uso !== 'receita' && teto.trim() !== '') {
      const valorTeto = paraNumero(teto);
      if (!valorTeto || valorTeto <= 0) {
        setErro('O teto do mês precisa ser maior que zero, ou deixe o campo vazio.');
        return;
      }
      dados.orcamento = valorTeto;
      dados.moeda = moeda;
    }

    const ok = await adicionarCategoria(dados);
    if (!ok) return;
    limpar();
    navigation.navigate('Categorias');
  };

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Miolo largura={640}>
        <View style={styles.previa}>
          <View style={[styles.previaIcone, { backgroundColor: cor + '22', borderColor: cor }]}>
            <Ionicons name={icone} size={32} color={cor} />
          </View>
          <Text style={styles.previaNome}>{nome.trim() === '' ? 'Nome da categoria' : nome.trim()}</Text>
        </View>

        <View style={styles.cartao}>
          <Campo rotulo="Nome" icone="pricetag-outline" value={nome} onChangeText={setNome} placeholder="Ex.: Pets" maxLength={20} style={{ marginTop: 0 }} />

          <Text style={styles.rotulo}>Aparece em</Text>
          <View style={styles.usos}>
            {USOS.map((opcao) => {
              const ativo = uso === opcao.chave;
              return (
                <TouchableOpacity
                  key={opcao.chave}
                  style={[styles.uso, ativo && estilosUso[opcao.chave]]}
                  onPress={() => setUso(opcao.chave)}
                >
                  <Text style={[styles.usoTexto, ativo && textosUso[opcao.chave]]}>
                    {opcao.rotulo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {uso !== 'receita' && <SeletorMoeda valor={moeda} onChange={setMoeda} />}
          {uso !== 'receita' && (
            <Campo
              rotulo={`Teto do mês (${moeda === 'USD' ? 'US$' : moeda === 'EUR' ? '€' : 'R$'}), opcional`}
              icone="speedometer-outline"
              value={teto}
              onChangeText={setTeto}
              keyboardType="decimal-pad"
              placeholder="Ex.: 400,00"
            />
          )}
          {uso !== 'receita' && moeda !== 'BRL' && tetoEmReal != null && teto.trim() !== '' && (
            <Text style={styles.equivalente}>
              Hoje, {formatarMoeda(tetoNumero, moeda)} equivalem a {formatarReal(tetoEmReal)}. O teto em real muda com a cotação.
            </Text>
          )}

          <Text style={styles.rotulo}>Ícone</Text>
          <View style={styles.grade}>
            {ICONES_CATEGORIA.map((nomeIcone) => {
              const ativo = icone === nomeIcone;
              return (
                <TouchableOpacity
                  key={nomeIcone}
                  style={[styles.icone, ativo && { backgroundColor: cor, borderColor: cor }]}
                  onPress={() => setIcone(nomeIcone)}
                >
                  <Ionicons name={nomeIcone} size={20} color={ativo ? tintaDoFundo(cor) : cores.textoSuave} />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.rotulo}>Cor</Text>
          <View style={styles.grade}>
            {CORES_CATEGORIA.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.cor, { backgroundColor: c }, cor === c && styles.corAtiva]}
                onPress={() => setCor(c)}
              >
                {cor === c && <Ionicons name="checkmark" size={18} color={tintaDoFundo(c)} />}
              </TouchableOpacity>
            ))}
          </View>

          {erro !== '' && <Aviso>{erro}</Aviso>}

          <Botao titulo="Criar categoria" icone="checkmark-circle-outline" onPress={salvar} style={{ marginTop: 22 }} />
          <Botao
            titulo="Cancelar"
            variante="suave"
            onPress={() => {
              limpar();
              navigation.navigate('Categorias');
            }}
            style={{ marginTop: 10 }}
          />
        </View>
      </Miolo>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  container: { padding: 20, paddingBottom: 40 },
  previa: { alignItems: 'center', marginBottom: 16 },
  previaIcone: {
    width: 76,
    height: 76,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previaNome: { ...fonte, fontSize: 18, fontWeight: '800', color: cores.texto, marginTop: 12 },
  cartao: { ...moldura, padding: 20 },
  rotulo: { ...olho, marginTop: 18, marginBottom: 10 },
  usos: { flexDirection: 'row', flexWrap: 'wrap' },
  uso: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: cores.borda,
    marginRight: 8,
    marginBottom: 8,
  },
  usoTexto: { ...fonte, fontWeight: '700', fontSize: 13, color: cores.textoSuave },
  grade: { flexDirection: 'row', flexWrap: 'wrap' },
  icone: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.fundoElevado,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  cor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  corAtiva: { borderWidth: 2, borderColor: cores.texto },
  equivalente: { ...fonte, color: cores.lima, fontSize: 13, marginTop: 8, lineHeight: 18 },
});
