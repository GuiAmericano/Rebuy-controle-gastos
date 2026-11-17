import { useWindowDimensions } from 'react-native';
import { LAYOUT } from './theme';

export default function useArea() {
  const { width } = useWindowDimensions();
  const permanente = width >= LAYOUT.permanente;
  const area = permanente ? width - LAYOUT.drawer : width;
  return { width, area, largo: area >= 860, permanente };
}
