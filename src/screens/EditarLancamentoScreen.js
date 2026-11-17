import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import FormLancamento from '../components/FormLancamento';
import EstadoVazio from '../components/EstadoVazio';
import Botao from '../components/Botao';
import { cores } from '../theme';

export default function EditarLancamentoScreen({ navigation, route, gastos, editar }) {
  const id = route.params?.id;
  const gasto = gastos.find((g) => g.id === id);

  // Toda vez que a tela ganha foco, recria o formulário com os dados do lançamento escolhido
  const [versao, setVersao] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setVersao((v) => v + 1);
    }, [id])
  );

  if (!gasto) {
    return (
      <View style={{ flex: 1, backgroundColor: cores.fundo, justifyContent: 'center' }}>
        <EstadoVazio
          icone="create-outline"
          titulo="Nenhum lançamento selecionado"
          texto="Escolha um lançamento na lista e toque no lápis para editar."
        >
          <Botao titulo="Ir para Lançamentos" onPress={() => navigation.navigate('Lancamentos')} />
        </EstadoVazio>
      </View>
    );
  }

  return (
    <FormLancamento
      key={`${id}-${versao}`}
      inicial={gasto}
      textoBotao="Salvar alterações"
      onSalvar={async (dados) => {
        const ok = await editar(id, dados);
        if (ok) navigation.navigate('Lancamentos');
      }}
      onCancelar={() => navigation.navigate('Lancamentos')}
    />
  );
}
