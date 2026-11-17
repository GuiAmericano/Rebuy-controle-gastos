import { useCallback, useEffect, useState } from 'react';
import { buscarCotacoes } from './cotacao';

export function useCotacoes() {
  const [cotacoes, setCotacoes] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async (forcar = false) => {
    setCarregando(true);
    setErro('');
    try {
      setCotacoes(await buscarCotacoes({ forcar }));
    } catch (falha) {
      setCotacoes(null);
      setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar(false);
  }, [carregar]);

  return { cotacoes, erro, carregando, recarregar: () => carregar(true) };
}
