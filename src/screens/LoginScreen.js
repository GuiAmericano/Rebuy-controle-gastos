import { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import Campo from '../components/Campo';
import CampoSenha from '../components/CampoSenha';
import Botao from '../components/Botao';
import Aviso from '../components/Aviso';
import { cores, fonte } from '../theme';

export default function LoginScreen({ onEntrar, onIrParaCadastro, mensagem = '', emailInicial = '' }) {
  const [email, setEmail] = useState(emailInicial);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async () => {
    if (enviando) return;

    const emailLimpo = email.trim().toLowerCase();
    if (emailLimpo === '' || senha === '') {
      setErro('Preencha e-mail e senha.');
      return;
    }

    setEnviando(true);
    setErro('');
    const falha = await onEntrar(emailLimpo, senha);
    if (falha) {
      setErro(falha);
      setEnviando(false);
    }
  };

  return (
    <AuthLayout
      selo="Bem-vindo de volta"
      titulo="O mês inteiro,"
      destaque="em um só olhar."
      subtitulo="Entre para ver saldo, despesas e metas."
      pontos={['Sua conta', 'Dados no Firebase', 'Cotação do dia']}
    >
      {mensagem !== '' && <Aviso tipo="ok">{mensagem}</Aviso>}

      <Campo
        rotulo="E-mail"
        icone="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={{ marginTop: mensagem !== '' ? 14 : 0 }}
      />
      <CampoSenha rotulo="Senha" value={senha} onChangeText={setSenha} placeholder="Sua senha" />

      {erro !== '' && <Aviso>{erro}</Aviso>}

      <Botao titulo={enviando ? 'Entrando...' : 'Entrar'} icone="arrow-forward" onPress={entrar} style={{ marginTop: 22 }} />

      <TouchableOpacity style={styles.link} onPress={onIrParaCadastro}>
        <Text style={styles.linkCinza}>Não tem conta? </Text>
        <Text style={styles.linkTexto}>Cadastre-se</Text>
      </TouchableOpacity>

      <Text style={styles.dica}>Entre com o e-mail cadastrado. A conta fica salva no Firebase.</Text>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  link: { flexDirection: 'row', justifyContent: 'center', marginTop: 18, padding: 6 },
  linkCinza: { ...fonte, color: cores.textoSuave, fontSize: 14 },
  linkTexto: { ...fonte, color: cores.lima, fontSize: 14, fontWeight: '800' },
  dica: { ...fonte, textAlign: 'center', color: cores.textoClaro, marginTop: 4, fontSize: 12, lineHeight: 18 },
});
