import { Text } from 'react-native';
import { equivalentes } from '../cotacao';
import { formatarMoeda } from '../util';
import { cores, fonte } from '../theme';

export default function Equivale({ valorReal, cotacoes, style }) {
  const valores = equivalentes(valorReal, cotacoes);
  if (!valores) return null;
  return (
    <Text style={[{ ...fonte, fontSize: 12, color: cores.textoSuave, marginTop: 2 }, style]}>
      {formatarMoeda(valores.usd, 'USD')} · {formatarMoeda(valores.eur, 'EUR')}
    </Text>
  );
}
