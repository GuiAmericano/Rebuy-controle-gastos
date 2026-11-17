import { paraISO } from './util';

// Modelos de lançamentos que se repetem a cada mês.
// "meses" limita a quais meses atrás o lançamento aparece (0 = mês atual, 1 = mês passado...).
// "variacao" faz o valor oscilar um pouco de mês para mês.
const MODELOS = [
  // ----- Receitas -----
  { descricao: 'Salário', valor: 5200, tipo: 'receita', categoria: 'Salário', dia: 5 },
  { descricao: 'Projeto de design (freelance)', valor: 850, tipo: 'receita', categoria: 'Freelance', dia: 18, variacao: 150, meses: [0, 2, 4] },
  { descricao: 'Rendimento CDB', valor: 118.4, tipo: 'receita', categoria: 'Investimentos', dia: 25, variacao: 20 },
  { descricao: 'Venda de item usado', valor: 230, tipo: 'receita', categoria: 'Outros', dia: 14, meses: [1, 3] },

  // ----- Moradia -----
  { descricao: 'Aluguel', valor: 1450, tipo: 'despesa', categoria: 'Moradia', dia: 10 },
  { descricao: 'Condomínio', valor: 320, tipo: 'despesa', categoria: 'Moradia', dia: 10 },
  { descricao: 'Conta de luz', valor: 187.4, tipo: 'despesa', categoria: 'Moradia', dia: 15, variacao: 30 },
  { descricao: 'Internet fibra', valor: 99.9, tipo: 'despesa', categoria: 'Moradia', dia: 12 },

  // ----- Alimentação -----
  { descricao: 'Supermercado', valor: 310, tipo: 'despesa', categoria: 'Alimentação', dia: 3, variacao: 60 },
  { descricao: 'Mercado do bairro', valor: 180, tipo: 'despesa', categoria: 'Alimentação', dia: 17, variacao: 40 },
  { descricao: 'Feira', valor: 62, tipo: 'despesa', categoria: 'Alimentação', dia: 24, variacao: 15 },
  { descricao: 'iFood', valor: 62.9, tipo: 'despesa', categoria: 'Alimentação', dia: 8, variacao: 15 },
  { descricao: 'Almoço de domingo', valor: 118, tipo: 'despesa', categoria: 'Alimentação', dia: 20, variacao: 30 },
  { descricao: 'Padaria', valor: 24.5, tipo: 'despesa', categoria: 'Alimentação', dia: 6, variacao: 8 },

  // ----- Transporte -----
  { descricao: 'Combustível', valor: 220, tipo: 'despesa', categoria: 'Transporte', dia: 7, variacao: 40 },
  { descricao: 'Uber', valor: 38.6, tipo: 'despesa', categoria: 'Transporte', dia: 16, variacao: 12 },
  { descricao: 'Manutenção do carro', valor: 350, tipo: 'despesa', categoria: 'Transporte', dia: 21, meses: [2, 5] },

  // ----- Saúde -----
  { descricao: 'Academia', valor: 99, tipo: 'despesa', categoria: 'Saúde', dia: 5 },
  { descricao: 'Farmácia', valor: 76.8, tipo: 'despesa', categoria: 'Saúde', dia: 19, variacao: 30 },
  { descricao: 'Consulta médica', valor: 180, tipo: 'despesa', categoria: 'Saúde', dia: 22, meses: [1, 4] },

  // ----- Educação -----
  { descricao: 'Curso de inglês', valor: 189, tipo: 'despesa', categoria: 'Educação', dia: 9 },
  { descricao: 'Livros', valor: 89.9, tipo: 'despesa', categoria: 'Educação', dia: 23, meses: [0, 3] },

  // ----- Lazer -----
  { descricao: 'Netflix', valor: 55.9, tipo: 'despesa', categoria: 'Lazer', dia: 14 },
  { descricao: 'Spotify', valor: 21.9, tipo: 'despesa', categoria: 'Lazer', dia: 14 },
  { descricao: 'Cinema', valor: 64, tipo: 'despesa', categoria: 'Lazer', dia: 13, meses: [0, 2, 4] },
  { descricao: 'Bar com amigos', valor: 140, tipo: 'despesa', categoria: 'Lazer', dia: 26, variacao: 50 },

  // ----- Compras / Outros -----
  { descricao: 'Roupas', valor: 249.9, tipo: 'despesa', categoria: 'Compras', dia: 11, meses: [1, 2, 4] },
  { descricao: 'Presente de aniversário', valor: 120, tipo: 'despesa', categoria: 'Compras', dia: 28, meses: [2] },
  { descricao: 'Fone de ouvido', valor: 399, tipo: 'despesa', categoria: 'Compras', dia: 27, meses: [3] },
  { descricao: 'Cabeleireiro', valor: 60, tipo: 'despesa', categoria: 'Outros', dia: 4 },
  { descricao: 'Pet shop', valor: 85, tipo: 'despesa', categoria: 'Outros', dia: 15, variacao: 15 },
];

// Gera lançamentos dos últimos 6 meses, sempre relativos à data de hoje
export function gerarLancamentosExemplo() {
  const hoje = new Date();
  const prefixo = `ex${Date.now()}`;
  const lista = [];

  for (let i = 0; i < 6; i++) {
    const ref = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const ultimoDia = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();

    MODELOS.forEach((m) => {
      if (m.meses && !m.meses.includes(i)) return;

      const dia = Math.min(m.dia, ultimoDia);
      if (i === 0 && dia > hoje.getDate()) return; // não cria lançamentos no futuro

      let valor = m.valor;
      if (m.variacao) {
        const desvio = ((i * 17 + m.dia * 7 + Math.floor(m.valor)) % (2 * m.variacao + 1)) - m.variacao;
        valor = Math.round((m.valor + desvio) * 100) / 100;
      }

      lista.push({
        id: `${prefixo}-${lista.length}`,
        descricao: m.descricao,
        valor,
        tipo: m.tipo,
        categoria: m.categoria,
        data: paraISO(new Date(ref.getFullYear(), ref.getMonth(), dia)),
      });
    });
  }

  return lista.sort((a, b) => b.data.localeCompare(a.data));
}

export const METAS_EXEMPLO = [
  { id: 'm1', titulo: 'Reserva de emergência', atual: 4200, alvo: 10000, moeda: 'BRL', icone: 'shield-checkmark-outline' },
  { id: 'm2', titulo: 'Viagem de férias', atual: 1800, alvo: 800, moeda: 'EUR', icone: 'airplane-outline' },
  { id: 'm3', titulo: 'Notebook novo', atual: 3200, alvo: 3500, moeda: 'BRL', icone: 'laptop-outline' },
  { id: 'm4', titulo: 'Intercâmbio de inglês', atual: 600, alvo: 2500, moeda: 'USD', icone: 'school-outline' },
];

export const ICONES_META = [
  'flag-outline', 'airplane-outline', 'home-outline', 'car-sport-outline',
  'laptop-outline', 'school-outline', 'gift-outline', 'shield-checkmark-outline',
];
