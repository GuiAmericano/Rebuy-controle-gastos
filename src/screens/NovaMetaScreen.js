import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import Aviso from '../components/Aviso';
import SeletorMoeda from '../components/SeletorMoeda';
import Miolo from '../components/Miolo';
import { cores, fonte, moldura, olho } from '../theme';
import { formatarMoeda, formatarReal, paraNumero } from '../util';
import { valorEmReal } from '../cotacao';
import { useCotacoes } from '../useCotacoes';
import { ICONES_META } from '../dadosExemplo';

export default function NovaMetaScreen({ navigation, adicionarMeta }) {
  const [titulo, setTitulo] = useState('');
  const [alvo, setAlvo] = useState('');
  const [atual, setAtual] = useState('');
  const [moeda, setMoeda] = useState('BRL');
  const [icone, setIcone] = useState(ICONES_META[0]);
  const [erro, setErro] = useState('');
  const { cotacoes } = useCotacoes();

  const limpar = () => {
    setTitulo('');
    setAlvo('');
    setAtual('');
    setMoeda('BRL');
    setIcone(ICONES_META[0]);
    setErro('');
  };

  const alvoNumero = paraNumero(alvo);
  const alvoEmReal = Number.isFinite(alvoNumero) ? valorEmReal(alvoNumero, moeda, cotacoes) : null;

  const salvar = async () => {
    const valorAlvo = paraNumero(alvo);
    const valorAtual = atual.trim() === '' ? 0 : paraNumero(atual);

    if (titulo.trim() === '') {
      setErro('Dê um nome para a meta.');
      return;
    }
    if (!valorAlvo || valorAlvo <= 0) {
      setErro('Informe um valor alvo maior que zero.');
      return;
    }
    if (isNaN(valorAtual) || valorAtual < 0) {
      setErro('O valor já guardado deve ser zero ou maior.');
      return;
    }

    const ok = await adicionarMeta({
      titulo: titulo.trim(),
      alvo: valorAlvo,
      atual: valorAtual,
      moeda,
      icone,
    });
    if (!ok) return;
    limpar();
    navigation.navigate('Metas');
  };

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Miolo largura={640}>
        <View style={styles.cartao}>
          <Text style={olho}>Escolha um ícone</Text>
          <View style={styles.icones}>
            {ICONES_META.map((nome) => {
              const ativo = icone === nome;
              return (
                <TouchableOpacity
                  key={nome}
                  style={[styles.icone, ativo && styles.iconeAtivo]}
                  onPress={() => setIcone(nome)}
                >
                  <Ionicons name={nome} size={22} color={ativo ? cores.tinta : cores.lima} />
                </TouchableOpacity>
              );
            })}
          </View>

          <Campo rotulo="Nome da meta" icone="flag-outline" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Viagem para Lisboa" />
          <SeletorMoeda valor={moeda} onChange={setMoeda} />
          <Campo
            rotulo={`Valor alvo (${moeda === 'USD' ? 'US$' : moeda === 'EUR' ? '€' : 'R$'})`}
            icone="cash-outline"
            value={alvo}
            onChangeText={setAlvo}
            keyboardType="decimal-pad"
            placeholder={moeda === 'BRL' ? 'Ex.: 3500,00' : 'Ex.: 800,00'}
          />
          {moeda !== 'BRL' && alvoEmReal != null && (
            <Text style={styles.equivalente}>
              Hoje, {formatarMoeda(alvoNumero, moeda)} equivalem a {formatarReal(alvoEmReal)}. O valor em real muda com a cotação.
            </Text>
          )}
          <Campo
            rotulo="Já guardado (R$), opcional"
            icone="wallet-outline"
            value={atual}
            onChangeText={setAtual}
            keyboardType="decimal-pad"
            placeholder="Ex.: 200,00"
          />

          {erro !== '' && <Aviso>{erro}</Aviso>}

          <Botao titulo="Criar meta" icone="checkmark-circle-outline" onPress={salvar} style={{ marginTop: 22 }} />
          <Botao
            titulo="Cancelar"
            variante="suave"
            onPress={() => {
              limpar();
              navigation.navigate('Metas');
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
  cartao: { ...moldura, padding: 20 },
  icones: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  icone: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.fundoElevado,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  iconeAtivo: { backgroundColor: cores.lima, borderColor: cores.lima },
  equivalente: { ...fonte, color: cores.lima, fontSize: 13, marginTop: 8, lineHeight: 18 },
});
