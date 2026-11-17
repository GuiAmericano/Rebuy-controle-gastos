import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from './firebase';

export function observarAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function cadastrarUsuario({ nome, usuario, email, senha }) {
  const credencial = await createUserWithEmailAndPassword(auth, email, senha);

  try {
    const repetido = await getDocs(query(collection(db, 'usuarios'), where('usuario', '==', usuario)));
    if (!repetido.empty) {
      const erro = new Error('usuario-em-uso');
      erro.code = 'usuario-em-uso';
      throw erro;
    }
    await setDoc(doc(db, 'usuarios', credencial.user.uid), { nome, usuario, email });
  } catch (erro) {
    try {
      await credencial.user.delete();
    } catch {
      await signOut(auth);
    }
    throw erro;
  }
}

export function entrarComEmail(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
}

export function sairConta() {
  return signOut(auth);
}

export async function alterarSenhaConta(senhaAtual, novaSenha) {
  const usuario = auth.currentUser;
  const credencial = EmailAuthProvider.credential(usuario.email, senhaAtual);
  await reauthenticateWithCredential(usuario, credencial);
  await updatePassword(usuario, novaSenha);
}

export async function carregarPerfil(usuarioAuth) {
  const referencia = doc(db, 'usuarios', usuarioAuth.uid);

  try {
    let snap = await getDoc(referencia);
    for (let tentativa = 0; !snap.exists() && tentativa < 8; tentativa += 1) {
      await new Promise((resolver) => setTimeout(resolver, 250));
      snap = await getDoc(referencia);
    }

    const dados = snap.data() || {};
    return {
      uid: usuarioAuth.uid,
      email: usuarioAuth.email,
      nome: dados.nome || 'Usuário',
      usuario: dados.usuario || '',
    };
  } catch {
    return {
      uid: usuarioAuth.uid,
      email: usuarioAuth.email,
      nome: 'Usuário',
      usuario: '',
    };
  }
}
