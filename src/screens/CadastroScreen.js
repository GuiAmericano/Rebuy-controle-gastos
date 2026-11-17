import { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import Campo from '../components/Campo';
import CampoSenha from '../components/CampoSenha';
import Botao from '../components/Botao';
import Aviso from '../components/Aviso';
import { cores, fonte } from '../theme';
import { SENHA_MINIMA } from '../util';

export default function CadastroScreen({ onCadastrar, onVoltar }) {
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cadastrar = async () => {
    if (enviando) return;

    const nomeLimpo = nome.trim();
    const usuarioLimpo = usuario.trim().toLowerCase();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !usuarioLimpo || !emailLimpo || !senha || !confirmacao) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!/^[a-z0-9_.]{3,}$/.test(usuarioLimpo)) {
      setErro('O usuário deve ter ao menos 3 caracteres (letras, números, "_" ou ".").');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (senha.length < SENHA_MINIMA) {
      setErro(`A senha deve ter pelo menos ${SENHA_MINIMA} caracteres.`);
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }

    setEnviando(true);
    setErro('');
    const falha = await onCadastrar({ nome: nomeLimpo, usuario: usuarioLimpo, email: emailLimpo, senha });
    if (falha) {
      setErro(falha);
      setEnviando(false);
    }
  };

  return (
    <AuthLayout
      selo="Nova conta"
      titulo="Comece a registrar"
      destaque="o que importa."
      subtitulo="Leva menos de um minuto."
    >
      <Campo
        rotulo="Nome completo"
        icone="person-outline"
        value={nome}
        onChangeText={setNome}
        placeholder="Ex.: Maria Silva"
        autoCapitalize="words"
        style={{ marginTop: 0 }}
      />
      <Campo
        rotulo="Usuário"
        icone="at-outline"
        value={usuario}
        onChangeText={setUsuario}
        placeholder="Ex.: maria.silva"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Campo
        rotulo="E-mail"
        icone="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="Ex.: maria@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <CampoSenha rotulo="Senha" value={senha} onChangeText={setSenha} placeholder={`Mínimo ${SENHA_MINIMA} caracteres`} />
      <CampoSenha rotulo="Confirmar senha" value={confirmacao} onChangeText={setConfirmacao} placeholder="Repita a senha" />

      {erro !== '' && <Aviso>{erro}</Aviso>}

      <Botao titulo={enviando ? 'Criando conta...' : 'Cadastrar'} icone="arrow-forward" onPress={cadastrar} style={{ marginTop: 22 }} />

      <TouchableOpacity style={styles.link} onPress={onVoltar}>
        <Text style={styles.linkCinza}>Já tem conta? </Text>
        <Text style={styles.linkTexto}>Entrar</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  link: { flexDirection: 'row', justifyContent: 'center', marginTop: 18, padding: 6 },
  linkCinza: { ...fonte, color: cores.textoSuave, fontSize: 14 },
  linkTexto: { ...fonte, color: cores.lima, fontSize: 14, fontWeight: '800' },
});
