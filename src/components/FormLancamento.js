import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Botao from './Botao';
import Campo from './Campo';
import Aviso from './Aviso';
import Miolo from './Miolo';
import { cores, fonte, moldura, olho, semContorno } from '../theme';
import { paraNumero, hojeISO, ontemISO, isoParaBR, brParaISO, mascaraData } from '../util';
import { useCategorias } from '../CategoriasContext';

export default function FormLancamento({ inicial, textoBotao, onSalvar, onCancelar }) {
  const { nomesDoTipo, info: infoCat } = useCategorias();
  const [tipo, setTipo] = useState(inicial ? inicial.tipo : 'despesa');
  const [valor, setValor] = useState(inicial ? inicial.valor.toFixed(2).replace('.', ',') : '');
  const [descricao, setDescricao] = useState(inicial ? inicial.descricao : '');
  const [categoria, setCategoria] = useState(inicial ? inicial.categoria : nomesDoTipo('despesa')[0]);
  const [data, setData] = useState(isoParaBR(inicial && inicial.data ? inicial.data : hojeISO()));
  const [erro, setErro] = useState('');

  const receita = tipo === 'receita';
  const corTipo = receita ? cores.lima : cores.despesa;

  const trocarTipo = (novoTipo) => {
    setTipo(novoTipo);
    if (!nomesDoTipo(novoTipo).includes(categoria)) {
      setCategoria(nomesDoTipo(novoTipo)[0]);
    }
  };

  const salvar = () => {
    const numero = paraNumero(valor);
    const dataISO = brParaISO(data);

    if (!numero || numero <= 0) {
      setErro('Informe um valor maior que zero.');
      return;
    }
    if (descricao.trim() === '') {
      setErro('Escreva uma descrição.');
      return;
    }
    if (!dataISO) {
      setErro('Data inválida. Use o formato DD/MM/AAAA.');
      return;
    }
    if (dataISO > hojeISO()) {
      setErro('A data não pode ser no futuro.');
      return;
    }

    setErro('');
    onSalvar({ descricao: descricao.trim(), valor: numero, tipo, categoria, data: dataISO });
  };

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Miolo largura={640} style={{ gap: 0 }}>
        <View style={styles.linha}>
          <TouchableOpacity
            style={[styles.tipo, !receita && styles.tipoDespesa]}
            onPress={() => trocarTipo('despesa')}
          >
            <Ionicons name="arrow-down-circle-outline" size={20} color={!receita ? cores.despesa : cores.textoClaro} />
            <Text style={[styles.tipoTexto, !receita && { color: cores.despesa }]}>Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tipo, receita && styles.tipoReceita]}
            onPress={() => trocarTipo('receita')}
          >
            <Ionicons name="arrow-up-circle-outline" size={20} color={receita ? cores.lima : cores.textoClaro} />
            <Text style={[styles.tipoTexto, receita && { color: cores.lima }]}>Receita</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.valorCaixa}>
          <Text style={olho}>Valor</Text>
          <View style={styles.valorLinha}>
            <Text style={[styles.cifrao, { color: corTipo }]}>R$</Text>
            <TextInput
              style={[styles.valorInput, { color: corTipo }]}
              value={valor}
              onChangeText={setValor}
              keyboardType="decimal-pad"
              placeholder="0,00"
              placeholderTextColor={cores.textoClaro}
            />
          </View>
        </View>

        <Campo rotulo="Descrição" icone="create-outline" value={descricao} onChangeText={setDescricao} placeholder="Ex.: Mercado" />

        <Campo
          rotulo="Data"
          icone="calendar-outline"
          value={data}
          onChangeText={(t) => setData(mascaraData(t))}
          keyboardType="number-pad"
          placeholder="DD/MM/AAAA"
          maxLength={10}
        />
        <View style={styles.atalhos}>
          <TouchableOpacity style={styles.atalho} onPress={() => setData(isoParaBR(hojeISO()))}>
            <Text style={styles.atalhoTexto}>Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.atalho} onPress={() => setData(isoParaBR(ontemISO()))}>
            <Text style={styles.atalhoTexto}>Ontem</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rotulo}>Categoria</Text>
        <View style={styles.chips}>
          {nomesDoTipo(tipo).map((c) => {
            const info = infoCat(c);
            const ativa = categoria === c;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.chip, ativa && { backgroundColor: info.cor + '22', borderColor: info.cor }]}
                onPress={() => setCategoria(c)}
              >
                <Ionicons name={info.icone} size={15} color={ativa ? info.cor : cores.textoSuave} />
                <Text style={[styles.chipTexto, ativa && { color: info.cor }]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {erro !== '' && <Aviso>{erro}</Aviso>}

        <Botao titulo={textoBotao} icone="checkmark-circle-outline" onPress={salvar} style={{ marginTop: 24 }} />
        {onCancelar && <Botao titulo="Cancelar" variante="suave" onPress={onCancelar} style={{ marginTop: 10 }} />}
      </Miolo>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  container: { padding: 20, paddingBottom: 40 },
  linha: { flexDirection: 'row', gap: 8 },
  tipo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
  },
  tipoDespesa: { backgroundColor: cores.despesaFundo, borderColor: 'rgba(255,107,107,0.45)' },
  tipoReceita: { backgroundColor: cores.receitaFundo, borderColor: cores.limaBorda },
  tipoTexto: { ...fonte, fontSize: 15, fontWeight: '700', color: cores.textoClaro, marginLeft: 8 },
  valorCaixa: { ...moldura, padding: 18, marginTop: 16 },
  valorLinha: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cifrao: { ...fonte, fontSize: 28, fontWeight: '800', marginRight: 8 },
  valorInput: { ...fonte, ...semContorno, flex: 1, fontSize: 40, fontWeight: '800', paddingVertical: 4 },
  rotulo: { ...olho, marginTop: 18, marginBottom: 10 },
  atalhos: { flexDirection: 'row', marginTop: 10 },
  atalho: {
    backgroundColor: cores.limaSuave,
    borderWidth: 1,
    borderColor: cores.limaBorda,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  atalhoTexto: { ...fonte, color: cores.lima, fontWeight: '700', fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
    marginRight: 8,
    marginBottom: 8,
  },
  chipTexto: { ...fonte, fontSize: 13, color: cores.textoSuave, fontWeight: '700', marginLeft: 6 },
});
