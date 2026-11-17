import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { ActivityIndicator, Platform, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import ResumoScreen from './src/screens/ResumoScreen';
import NovoLancamentoScreen from './src/screens/NovoLancamentoScreen';
import EditarLancamentoScreen from './src/screens/EditarLancamentoScreen';
import LancamentosScreen from './src/screens/LancamentosScreen';
import CategoriasScreen from './src/screens/CategoriasScreen';
import NovaCategoriaScreen from './src/screens/NovaCategoriaScreen';
import MetasScreen from './src/screens/MetasScreen';
import NovaMetaScreen from './src/screens/NovaMetaScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import AlterarSenhaScreen from './src/screens/AlterarSenhaScreen';
import ConfigFirebaseScreen from './src/screens/ConfigFirebaseScreen';
import MenuLateral from './src/components/MenuLateral';
import Marca, { nomeDoApp } from './src/components/Marca';

import { cores, fonte, LAYOUT } from './src/theme';
import { CategoriasContext, criarContextoCategorias } from './src/CategoriasContext';
import { firebaseConfigurado } from './src/firebaseConfig';
import { mensagemErro } from './src/errosFirebase';
import {
  alterarSenhaConta,
  cadastrarUsuario,
  carregarPerfil,
  entrarComEmail,
  observarAuth,
  sairConta,
} from './src/authFirebase';
import { useDadosUsuario } from './src/useDadosUsuario';

const Drawer = createDrawerNavigator();

const temaNavegacao = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: cores.lima,
    background: cores.fundo,
    card: cores.fundo,
    text: cores.texto,
    border: cores.borda,
    notification: cores.lima,
  },
};

const escondidoNoMenu = { drawerItemStyle: { display: 'none' } };

const icone = (nome) => ({ color, size }) => <Ionicons name={nome} color={color} size={size} />;

function Casca({ children }) {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: cores.fundo }}>{children}</View>
    </SafeAreaProvider>
  );
}

function TelaCarregando({ texto }) {
  return (
    <Casca>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundo }}>
        <Marca tamanho={72} />
        <Text style={{ ...fonte, marginTop: 14, color: cores.texto, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }}>{nomeDoApp}</Text>
        <ActivityIndicator size="small" color={cores.lima} style={{ marginTop: 22 }} />
        <Text style={{ ...fonte, marginTop: 12, color: cores.textoSuave }}>{texto}</Text>
      </View>
    </Casca>
  );
}

export default function App() {
  const [telaAuth, setTelaAuth] = useState('login');

  useEffect(() => {
    if (Platform.OS === 'web') document.title = nomeDoApp;
  }, []);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [pronto, setPronto] = useState(false);

  const {
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
  } = useDadosUsuario(usuarioLogado ? usuarioLogado.uid : null);

  useEffect(() => {
    if (!firebaseConfigurado) return undefined;

    let versao = 0;
    return observarAuth(async (usuarioAuth) => {
      const atual = ++versao;
      if (!usuarioAuth) {
        setUsuarioLogado(null);
        setPronto(true);
        return;
      }
      const perfil = await carregarPerfil(usuarioAuth);
      if (atual !== versao) return;
      setUsuarioLogado(perfil);
      setPronto(true);
    });
  }, []);

  const cadastrar = async (novoUsuario) => {
    try {
      await cadastrarUsuario(novoUsuario);
      return null;
    } catch (erro) {
      return mensagemErro(erro);
    }
  };

  const entrar = async (email, senha) => {
    try {
      await entrarComEmail(email, senha);
      return null;
    } catch (erro) {
      return mensagemErro(erro);
    }
  };

  const sair = () => {
    setTelaAuth('login');
    return sairConta();
  };

  const alterarSenha = async (senhaAtual, novaSenha) => {
    try {
      await alterarSenhaConta(senhaAtual, novaSenha);
      return null;
    } catch (erro) {
      return mensagemErro(erro);
    }
  };

  if (!firebaseConfigurado) {
    return (
      <Casca>
        <ConfigFirebaseScreen />
      </Casca>
    );
  }
  if (!pronto || (usuarioLogado && carregandoDados)) return <TelaCarregando texto="Carregando sua conta..." />;

  if (!usuarioLogado) {
    if (telaAuth === 'cadastro') {
      return (
        <Casca>
          <CadastroScreen onCadastrar={cadastrar} onVoltar={() => setTelaAuth('login')} />
        </Casca>
      );
    }
    return (
      <Casca>
        <LoginScreen onEntrar={entrar} onIrParaCadastro={() => setTelaAuth('cadastro')} />
      </Casca>
    );
  }

  return (
    <CategoriasContext.Provider value={criarContextoCategorias(categorias)}>
      <Casca>
      <NavigationContainer theme={temaNavegacao}>
        <AppNavegacao usuarioLogado={usuarioLogado} sair={sair} gastos={gastos} metas={metas} adicionar={adicionar} remover={remover} editar={editar} adicionarMeta={adicionarMeta} depositarMeta={depositarMeta} removerMeta={removerMeta} adicionarCategoria={adicionarCategoria} removerCategoria={removerCategoria} carregarExemplos={carregarExemplos} alterarSenha={alterarSenha} />
      </NavigationContainer>
      </Casca>
    </CategoriasContext.Provider>
  );
}

function AppNavegacao({
  usuarioLogado,
  sair,
  gastos,
  metas,
  adicionar,
  remover,
  editar,
  adicionarMeta,
  depositarMeta,
  removerMeta,
  adicionarCategoria,
  removerCategoria,
  carregarExemplos,
  alterarSenha,
}) {
  const { width } = useWindowDimensions();
  const permanente = width >= LAYOUT.permanente;

  return (
        <Drawer.Navigator
          initialRouteName="Resumo"
          drawerContent={(props) => <MenuLateral {...props} usuario={usuarioLogado} sair={sair} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: cores.fundoElevado,
              borderBottomWidth: 1,
              borderBottomColor: cores.borda,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerShadowVisible: false,
            headerTintColor: cores.texto,
            headerTitleStyle: { ...fonte, fontWeight: '700', fontSize: 17, letterSpacing: -0.2 },
            headerLeft: permanente ? () => null : undefined,
            drawerType: permanente ? 'permanent' : 'front',
            swipeEnabled: !permanente,
            overlayColor: 'rgba(0,0,0,0.62)',
            drawerStyle: {
              backgroundColor: cores.fundo,
              width: LAYOUT.drawer,
              borderRightWidth: 1,
              borderRightColor: cores.borda,
            },
            drawerActiveTintColor: cores.tinta,
            drawerActiveBackgroundColor: cores.lima,
            drawerInactiveTintColor: '#C5D0C6',
            drawerLabelStyle: {
              ...fonte,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              marginLeft: -4,
            },
            drawerItemStyle: { borderRadius: 12, marginHorizontal: 12, marginVertical: 2 },
          }}
        >
          <Drawer.Screen name="Resumo" options={{ title: 'Resumo', drawerIcon: icone('home-outline') }}>
            {(props) => (
              <ResumoScreen {...props} gastos={gastos} usuario={usuarioLogado} carregarExemplos={carregarExemplos} />
            )}
          </Drawer.Screen>

          <Drawer.Screen name="Novo" options={{ title: 'Novo lançamento', drawerIcon: icone('add-circle-outline') }}>
            {(props) => <NovoLancamentoScreen {...props} adicionar={adicionar} />}
          </Drawer.Screen>

          <Drawer.Screen name="Lancamentos" options={{ title: 'Lançamentos', drawerIcon: icone('list-outline') }}>
            {(props) => <LancamentosScreen {...props} gastos={gastos} remover={remover} />}
          </Drawer.Screen>

          <Drawer.Screen name="Categorias" options={{ title: 'Categorias', drawerIcon: icone('pie-chart-outline') }}>
            {(props) => <CategoriasScreen {...props} gastos={gastos} removerCategoria={removerCategoria} />}
          </Drawer.Screen>

          <Drawer.Screen name="Metas" options={{ title: 'Metas', drawerIcon: icone('flag-outline') }}>
            {(props) => <MetasScreen {...props} metas={metas} depositar={depositarMeta} remover={removerMeta} />}
          </Drawer.Screen>

          <Drawer.Screen name="Perfil" options={{ title: 'Perfil', drawerIcon: icone('person-outline') }}>
            {(props) => (
              <PerfilScreen
                {...props}
                usuario={usuarioLogado}
                gastos={gastos}
                metas={metas}
                sair={sair}
                carregarExemplos={carregarExemplos}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen name="Editar" options={{ title: 'Editar lançamento', ...escondidoNoMenu }}>
            {(props) => <EditarLancamentoScreen {...props} gastos={gastos} editar={editar} />}
          </Drawer.Screen>

          <Drawer.Screen name="NovaCategoria" options={{ title: 'Nova categoria', ...escondidoNoMenu }}>
            {(props) => <NovaCategoriaScreen {...props} adicionarCategoria={adicionarCategoria} />}
          </Drawer.Screen>

          <Drawer.Screen name="NovaMeta" options={{ title: 'Nova meta', ...escondidoNoMenu }}>
            {(props) => <NovaMetaScreen {...props} adicionarMeta={adicionarMeta} />}
          </Drawer.Screen>

          <Drawer.Screen name="AlterarSenha" options={{ title: 'Alterar senha', ...escondidoNoMenu }}>
            {(props) => <AlterarSenhaScreen {...props} alterarSenha={alterarSenha} />}
          </Drawer.Screen>
        </Drawer.Navigator>
  );
}
