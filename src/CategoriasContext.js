import { createContext, useContext } from 'react';
import { CATEGORIAS, CATEGORIAS_RECEITA, INFO_CATEGORIAS } from './util';

// Junta as categorias padrão com as que o usuário criou.
// Assim qualquer tela consegue pedir "a lista de categorias" ou "o ícone/cor de X"
// sem precisar receber isso por props.
export function criarContextoCategorias(personalizadas = []) {
  const padrao = (tipo) => (tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS);

  const servePara = (categoria, tipo) => {
    const uso = categoria.uso || 'ambos';
    return uso === 'ambos' || uso === tipo;
  };

  return {
    personalizadas,

    nomesDoTipo: (tipo) => [
      ...padrao(tipo).filter((n) => n !== 'Outros'),
      ...personalizadas.filter((c) => servePara(c, tipo)).map((c) => c.nome),
      'Outros',
    ],

    // { icone, cor } de qualquer categoria (padrão ou criada pelo usuário)
    info: (nome) => {
      const custom = personalizadas.find((c) => c.nome === nome);
      if (custom) return { icone: custom.icone, cor: custom.cor };
      return INFO_CATEGORIAS[nome] || INFO_CATEGORIAS.Outros;
    },

    // Já existe uma categoria com esse nome? (ignora maiúsculas)
    existe: (nome) => {
      const alvo = nome.trim().toLowerCase();
      return [...CATEGORIAS, ...CATEGORIAS_RECEITA, ...personalizadas.map((c) => c.nome)]
        .some((n) => n.toLowerCase() === alvo);
    },
  };
}

export const CategoriasContext = createContext(criarContextoCategorias([]));
export const useCategorias = () => useContext(CategoriasContext);
