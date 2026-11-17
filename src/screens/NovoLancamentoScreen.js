import { useState } from 'react';
import FormLancamento from '../components/FormLancamento';

export default function NovoLancamentoScreen({ navigation, adicionar }) {
  // Mudar a "key" recria o formulário do zero (limpa os campos depois de salvar)
  const [versao, setVersao] = useState(0);

  return (
    <FormLancamento
      key={versao}
      textoBotao="Salvar lançamento"
      onSalvar={async (dados) => {
        const ok = await adicionar(dados);
        if (!ok) return;
        setVersao((v) => v + 1);
        navigation.navigate('Lancamentos');
      }}
    />
  );
}
