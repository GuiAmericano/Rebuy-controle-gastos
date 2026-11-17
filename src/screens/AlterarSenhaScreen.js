import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CampoSenha from '../components/CampoSenha';
import Botao from '../components/Botao';
import Aviso from '../components/Aviso';
import Miolo from '../components/Miolo';
import { cores, moldura } from '../theme';
import { SENHA_MINIMA } from '../util';

export default function AlterarSenhaScreen({ navigation, alterarSenha }) {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const limpar = () => {
    setAtual('');
    setNova('');
    setConfirmacao('');
    setErro('');
  };

  const salvar = async () => {
    if (enviando) return;
    setSucesso('');

    if (!atual || !nova || !confirmacao) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (nova.length < SENHA_MINIMA) {
      setErro(`A nova senha deve ter pelo menos ${SENHA_MINIMA} caracteres.`);
      return;
    }
    if (nova === atual) {
      setErro('A nova senha deve ser diferente da atual.');
      return;
    }
    if (nova !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }

    setEnviando(true);
    setErro('');
    const falha = await alterarSenha(atual, nova);
    setEnviando(false);
    if (falha) {
      setErro(falha);
      return;
    }
    limpar();
    setSucesso('Senha alterada com sucesso!');
  };

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Miolo largura={640}>
        <View style={styles.cartao}>
          <CampoSenha rotulo="Senha atual" value={atual} onChangeText={setAtual} placeholder="Sua senha atual" />
          <CampoSenha rotulo="Nova senha" value={nova} onChangeText={setNova} placeholder={`Mínimo ${SENHA_MINIMA} caracteres`} />
          <CampoSenha rotulo="Confirmar nova senha" value={confirmacao} onChangeText={setConfirmacao} placeholder="Repita a nova senha" />

          {erro !== '' && <Aviso>{erro}</Aviso>}
          {sucesso !== '' && <Aviso tipo="ok">{sucesso}</Aviso>}

          <Botao titulo={enviando ? 'Salvando...' : 'Salvar nova senha'} icone="key-outline" onPress={salvar} style={{ marginTop: 22 }} />
          <Botao
            titulo="Voltar ao perfil"
            variante="suave"
            onPress={() => {
              limpar();
              setSucesso('');
              navigation.navigate('Perfil');
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
});
