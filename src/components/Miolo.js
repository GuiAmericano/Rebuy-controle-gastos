import { View } from 'react-native';

export default function Miolo({ children, largura = 1120, style }) {
  return <View style={[{ width: '100%', maxWidth: largura, alignSelf: 'center' }, style]}>{children}</View>;
}
