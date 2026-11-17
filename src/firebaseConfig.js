// Credenciais do app Web.
// Firebase Console → Configurações do projeto → Seus aplicativos → Web.
// Troque cada COLE_AQUI pelo valor correspondente. O app só conecta depois disso.

export const firebaseConfig = {
  apiKey: "AIzaSyCkoGNToVgxIn7xRPUnfpvzq4AqMibW2gM",
  authDomain: "controle-gastos-ff6d9.firebaseapp.com",
  projectId: "controle-gastos-ff6d9",
  storageBucket: "controle-gastos-ff6d9.firebasestorage.app",
  messagingSenderId: "1006644929679",
  appId: "1:1006644929679:web:560f5908ae6f7d0d23fcfa",
  measurementId: "G-S4MHN3ZEB0"
};

const obrigatorias = ['apiKey', 'authDomain', 'projectId', 'appId'];

export const firebaseConfigurado = obrigatorias.every((chave) => {
  const valor = firebaseConfig[chave];
  return Boolean(valor) && !String(valor).includes('COLE_AQUI');
});
