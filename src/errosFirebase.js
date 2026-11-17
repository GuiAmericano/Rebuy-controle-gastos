const TEXTOS = {
  'auth/email-already-in-use': 'Já existe uma conta com esse e-mail.',
  'auth/invalid-email': 'Digite um e-mail válido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Espere um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão. Verifique a internet.',
  'auth/requires-recent-login': 'Entre de novo na conta para alterar a senha.',
  'usuario-em-uso': 'Esse nome de usuário já está em uso.',
  'permission-denied': 'O Firebase recusou o acesso. Publique as regras do arquivo firestore.rules.',
  unavailable: 'Sem conexão com o Firebase. Verifique a internet.',
};

export function mensagemErro(erro) {
  if (!erro) return 'Algo deu errado. Tente de novo.';
  return TEXTOS[erro.code] || 'Algo deu errado. Tente de novo.';
}
