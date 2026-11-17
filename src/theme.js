import { Platform } from 'react-native';

export const cores = {
  lima: '#C6F54A',
  limaSuave: 'rgba(198,245,74,0.12)',
  limaBorda: 'rgba(198,245,74,0.32)',
  tinta: '#10160F',
  primaria: '#C6F54A',
  primariaEscura: '#9BCF22',
  primariaClara: 'rgba(198,245,74,0.12)',
  fundo: '#070908',
  fundoElevado: '#0C100E',
  cartao: '#101612',
  texto: '#F4F7F1',
  textoSuave: '#95A296',
  textoClaro: '#667268',
  borda: 'rgba(255,255,255,0.08)',
  receita: '#C6F54A',
  receitaFundo: 'rgba(198,245,74,0.12)',
  despesa: '#FF6B6B',
  despesaFundo: 'rgba(255,107,107,0.12)',
  destaque: '#C6F54A',
};

export const LAYOUT = {
  drawer: 280,
  permanente: 1100,
};

export const fonte = Platform.select({
  web: { fontFamily: 'Outfit, sans-serif' },
  default: {},
});

export const fonteSerif = Platform.select({
  web: { fontFamily: '"Instrument Serif", Georgia, serif' },
  default: {},
});

export const olho = {
  ...fonte,
  fontSize: 11,
  fontWeight: '700',
  letterSpacing: 1.8,
  textTransform: 'uppercase',
  color: cores.textoSuave,
};

export const tituloCartao = {
  ...fonte,
  fontSize: 16,
  fontWeight: '800',
  letterSpacing: -0.3,
  color: cores.texto,
};

export const moldura = {
  backgroundColor: cores.cartao,
  borderRadius: 22,
  borderWidth: 1,
  borderColor: cores.borda,
};

export const sombra = Platform.select({
  web: { boxShadow: '0 18px 50px rgba(0,0,0,0.38)' },
  default: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
});

export const brilho = Platform.select({
  web: { boxShadow: '0 0 28px rgba(198,245,74,0.38)' },
  default: {
    shadowColor: '#C6F54A',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
});

export const semContorno = Platform.select({
  web: { outlineStyle: 'none' },
  default: {},
});

if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('identidade-visual')) {
  const link = document.createElement('link');
  link.id = 'identidade-visual';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);

  const estilo = document.createElement('style');
  estilo.textContent = `
    html, body, #root { background: #070908; min-height: 100%; }
    body { margin: 0; -webkit-font-smoothing: antialiased; caret-color: #C6F54A; }
    ::selection { background: rgba(198,245,74,0.35); color: #10160F; }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: #F4F7F1;
      caret-color: #C6F54A;
      transition: background-color 9999s ease-out;
      box-shadow: 0 0 0 1000px #0C100E inset;
    }
    * { scrollbar-width: thin; scrollbar-color: #2A3828 transparent; }
  `;
  document.head.appendChild(estilo);
}
