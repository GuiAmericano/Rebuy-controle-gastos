import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { mensagemErro } from './errosFirebase';
import { gerarLancamentosExemplo, METAS_EXEMPLO } from './dadosExemplo';

function avisar(erro) {
  Alert.alert('Não foi possível salvar', mensagemErro(erro));
}

export function useDadosUsuario(uid) {
  const [gastos, setGastos] = useState([]);
  const [metas, setMetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(Boolean(uid));

  useEffect(() => {
    if (!uid || !db) {
      setGastos([]);
      setMetas([]);
      setCategorias([]);
      setCarregandoDados(false);
      return undefined;
    }

    let restantes = 3;
    let avisou = false;
    const marcar = () => {
      restantes -= 1;
      if (restantes === 0) setCarregandoDados(false);
    };

    const escutar = (nome, definir) => {
      let primeiro = true;
      return onSnapshot(
        query(collection(db, nome), where('uid', '==', uid)),
        (snap) => {
          definir(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
          if (primeiro) {
            primeiro = false;
            marcar();
          }
        },
        (erro) => {
          if (primeiro) {
            primeiro = false;
            marcar();
          }
          if (!avisou) {
            avisou = true;
            avisar(erro);
          }
        }
      );
    };

    setCarregandoDados(true);
    const cancelar = [
      escutar('lancamentos', setGastos),
      escutar('metas', setMetas),
      escutar('categorias', setCategorias),
    ];

    return () => cancelar.forEach((fn) => fn());
  }, [uid]);

  const gravar = async (acao) => {
    try {
      await acao();
      return true;
    } catch (erro) {
      avisar(erro);
      return false;
    }
  };

  const adicionar = (gasto) => gravar(() => addDoc(collection(db, 'lancamentos'), { ...gasto, uid }));

  const remover = (id) => gravar(() => deleteDoc(doc(db, 'lancamentos', id)));

  const editar = (id, dados) => gravar(() => updateDoc(doc(db, 'lancamentos', id), dados));

  const adicionarMeta = (meta) => gravar(() => addDoc(collection(db, 'metas'), { ...meta, uid }));

  const depositarMeta = (id, valor) =>
    gravar(() => updateDoc(doc(db, 'metas', id), { atual: increment(valor) }));

  const removerMeta = (id) => gravar(() => deleteDoc(doc(db, 'metas', id)));

  const adicionarCategoria = (categoria) =>
    gravar(() => addDoc(collection(db, 'categorias'), { ...categoria, uid }));

  const removerCategoria = (id) => gravar(() => deleteDoc(doc(db, 'categorias', id)));

  const carregarExemplos = () =>
    gravar(async () => {
      const lote = writeBatch(db);
      gerarLancamentosExemplo().forEach((item) => {
        const { id, ...resto } = item;
        lote.set(doc(collection(db, 'lancamentos')), { ...resto, uid });
      });
      if (metas.length === 0) {
        METAS_EXEMPLO.forEach((item) => {
          const { id, ...resto } = item;
          lote.set(doc(collection(db, 'metas')), { ...resto, uid });
        });
      }
      await lote.commit();
    });

  return {
    gastos,
    metas,
    categorias,
    carregandoDados,
    adicionar,
    remover,
    editar,
    adicionarMeta,
    depositarMeta,
    removerMeta,
    adicionarCategoria,
    removerCategoria,
    carregarExemplos,
  };
}
