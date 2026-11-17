// ---------- Categorias ----------
export const CATEGORIAS = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Outros'];
export const CATEGORIAS_RECEITA = ['Salário', 'Freelance', 'Investimentos', 'Outros'];
export const categoriasDoTipo = (tipo) => (tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS);

export const INFO_CATEGORIAS = {
  'Alimentação': { icone: 'restaurant-outline', cor: '#FFB020' },
  'Transporte': { icone: 'car-outline', cor: '#4CC3FF' },
  'Moradia': { icone: 'home-outline', cor: '#C084FC' },
  'Saúde': { icone: 'heart-outline', cor: '#FF6B6B' },
  'Educação': { icone: 'school-outline', cor: '#3DDC97' },
  'Lazer': { icone: 'game-controller-outline', cor: '#E8F25A' },
  'Compras': { icone: 'bag-handle-outline', cor: '#FF5CA8' },
  'Salário': { icone: 'cash-outline', cor: '#C6F54A' },
  'Freelance': { icone: 'laptop-outline', cor: '#2EE6A6' },
  'Investimentos': { icone: 'trending-up-outline', cor: '#7AA2FF' },
  'Outros': { icone: 'ellipsis-horizontal-circle-outline', cor: '#8B978C' },
};
export const infoCategoria = (nome) => INFO_CATEGORIAS[nome] || INFO_CATEGORIAS.Outros;

// ---------- Senha / números ----------
export const SENHA_MINIMA = 6;

export const formatarReal = (valor) => {
  const negativo = valor < 0;
  const [inteiro, centavos] = Math.abs(valor).toFixed(2).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negativo ? '-' : ''}R$ ${comMilhar},${centavos}`;
};

const SIMBOLO_MOEDA = { BRL: 'R$', USD: 'US$', EUR: '€' };

export const formatarMoeda = (valor, moeda = 'BRL') => {
  const numero = Number(valor) || 0;
  const negativo = numero < 0;
  const [inteiro, centavos] = Math.abs(numero).toFixed(2).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negativo ? '-' : ''}${SIMBOLO_MOEDA[moeda] || 'R$'} ${comMilhar},${centavos}`;
};

// Converte "45,90" ou "45.90" em número (NaN se inválido)
export const paraNumero = (texto) => parseFloat(String(texto).replace(',', '.'));

export const primeiroNome = (nome) => nome.trim().split(' ')[0];

// ---------- Datas (guardadas como "AAAA-MM-DD") ----------
const pad = (n) => String(n).padStart(2, '0');

export const NOMES_MES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
export const ABREV_MES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const paraISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const hojeISO = () => paraISO(new Date());
export const ontemISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return paraISO(d);
};

export const isoParaBR = (iso) => {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

// "25/12/2026" -> "2026-12-25" (ou null se a data não existir)
export const brParaISO = (br) => {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br.trim());
  if (!partes) return null;
  const dia = +partes[1], mes = +partes[2], ano = +partes[3];
  const d = new Date(ano, mes - 1, dia);
  if (d.getFullYear() !== ano || d.getMonth() !== mes - 1 || d.getDate() !== dia) return null;
  return `${ano}-${pad(mes)}-${pad(dia)}`;
};

// Vai colocando as barras enquanto a pessoa digita: 25122026 -> 25/12/2026
export const mascaraData = (texto) => {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length > 4) return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
  if (n.length > 2) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return n;
};

export const rotuloDia = (iso) => {
  if (iso === hojeISO()) return 'Hoje';
  if (iso === ontemISO()) return 'Ontem';
  const [a, m, d] = iso.split('-');
  const base = `${+d} de ${NOMES_MES[+m - 1].toLowerCase()}`;
  return +a === new Date().getFullYear() ? base : `${base} de ${a}`;
};

// ---------- Meses ----------
export const mesAtual = () => {
  const d = new Date();
  return { ano: d.getFullYear(), mes: d.getMonth() };
};
export const moverMes = ({ ano, mes }, delta) => {
  const total = ano * 12 + mes + delta;
  return { ano: Math.floor(total / 12), mes: total % 12 };
};
export const chaveMes = ({ ano, mes }) => `${ano}-${pad(mes + 1)}`;
export const rotuloMes = ({ ano, mes }) => `${NOMES_MES[mes]} ${ano}`;

// ---------- Cálculos ----------
export const doMes = (gastos, m) => gastos.filter((g) => (g.data || '').slice(0, 7) === chaveMes(m));

export const totalPorTipo = (lista, tipo) =>
  lista.filter((g) => g.tipo === tipo).reduce((soma, g) => soma + g.valor, 0);

// [{ categoria, total, quantidade }] só de despesas, do maior para o menor
export const totaisPorCategoria = (lista) => {
  const mapa = {};
  lista
    .filter((g) => g.tipo === 'despesa')
    .forEach((g) => {
      mapa[g.categoria] = mapa[g.categoria] || { categoria: g.categoria, total: 0, quantidade: 0 };
      mapa[g.categoria].total += g.valor;
      mapa[g.categoria].quantidade += 1;
    });
  return Object.values(mapa).sort((a, b) => b.total - a.total);
};

export const ordenarRecentes = (lista) =>
  [...lista].sort((a, b) => (b.data || '').localeCompare(a.data || '') || b.id.localeCompare(a.id));

// ---------- Categorias personalizadas ----------
export const ICONES_CATEGORIA = [
  'paw-outline', 'fitness-outline', 'cafe-outline', 'musical-notes-outline',
  'cart-outline', 'medkit-outline', 'construct-outline', 'phone-portrait-outline',
  'shirt-outline', 'book-outline', 'camera-outline', 'bus-outline',
  'pizza-outline', 'gift-outline', 'flash-outline', 'film-outline', 'football-outline',
];

export const CORES_CATEGORIA = [
  '#C6F54A', '#4CC3FF', '#C084FC', '#FF6B6B', '#3DDC97',
  '#FFB020', '#FF5CA8', '#7AA2FF', '#2EE6A6', '#E8F25A',
];
