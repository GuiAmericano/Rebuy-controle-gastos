// Cotação do dólar e do euro em real, via AwesomeAPI (serviço externo, sem chave).
const URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL';
const CINCO_MINUTOS = 5 * 60 * 1000;

const NOMES = { USD: 'Dólar', EUR: 'Euro' };

export const MOEDAS = [
  { codigo: 'BRL', rotulo: 'Real' },
  { codigo: 'USD', rotulo: 'Dólar' },
  { codigo: 'EUR', rotulo: 'Euro' },
];

let memoria = null;
let memoriaEm = 0;

export function valorEmReal(valor, moeda, cotacoes) {
  const numero = Number(valor) || 0;
  if (!moeda || moeda === 'BRL') return numero;
  const item = (cotacoes || []).find((cotacao) => cotacao.codigo === moeda);
  if (!item || !(item.compra > 0)) return null;
  return numero * item.compra;
}

export function equivalentes(valorReal, cotacoes) {
  const usd = (cotacoes || []).find((cotacao) => cotacao.codigo === 'USD');
  const eur = (cotacoes || []).find((cotacao) => cotacao.codigo === 'EUR');
  if (!usd || !eur || !(usd.compra > 0) || !(eur.compra > 0)) return null;
  return { usd: valorReal / usd.compra, eur: valorReal / eur.compra };
}

export async function buscarCotacoes({ forcar = false } = {}) {
  if (!forcar && memoria && Date.now() - memoriaEm < CINCO_MINUTOS) return memoria;
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), 12000);

  try {
    const resposta = await fetch(URL, { signal: controle.signal });
    if (!resposta.ok) {
      throw new Error('A AwesomeAPI não respondeu. Tente de novo.');
    }

    const json = await resposta.json();
    const itens = [json.USDBRL, json.EURBRL].filter(Boolean).map((item) => ({
      codigo: item.code,
      nome: NOMES[item.code] || item.code,
      compra: Number(item.bid),
      variacao: Number(item.pctChange),
      atualizado: item.create_date,
    }));
    if (itens.length === 0) {
      throw new Error('A cotação veio vazia.');
    }
    memoria = itens;
    memoriaEm = Date.now();
    return itens;
  } catch (erro) {
    if (erro.name === 'AbortError') {
      throw new Error('A consulta da cotação demorou demais.');
    }
    if (erro.message && erro.message.startsWith('A ')) throw erro;
    throw new Error('Não foi possível consultar a cotação. Verifique a internet.');
  } finally {
    clearTimeout(timer);
  }
}
