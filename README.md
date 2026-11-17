# Rebuy

Aplicativo para registrar receitas e despesas, acompanhar o saldo do mês e guardar metas. Cada pessoa entra com a própria conta. O que ela lança fica salvo no Firebase e continua lá depois de fechar o app.

A cotação do dólar e do euro aparece no Resumo e vem de um serviço externo, a AwesomeAPI.

## Antes de usar

O app precisa de um projeto Firebase seu. Sem isso, a primeira tela explica o que falta e nada é gravado.

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e crie um projeto.
2. Em **Authentication → Sign-in method**, ative **E-mail/senha**.
3. Em **Firestore Database**, crie o banco no modo de produção.
4. Em **Firestore → Regras**, apague o conteúdo, cole o arquivo `firestore.rules` deste projeto e clique em **Publicar**. Sem esse passo, o app entra mas não consegue ler nem gravar.
5. Em **Configurações do projeto** (engrenagem), em **Seus aplicativos**, adicione um app **Web** (`</>`).
6. Copie o objeto `firebaseConfig` e substitua os valores em `src/firebaseConfig.js`. Cada campo que ainda estiver `COLE_AQUI` precisa do valor real (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

A chave do app Web pode ficar no código. Quem protege os dados são as regras: cada pessoa só lê e grava o que é dela.

No Snack, confirme também estas dependências:

- `firebase`
- `@react-native-async-storage/async-storage`

No computador, na pasta do projeto:

```bash
npm install
npx expo start
```

Abra no navegador, no Expo Go ou no emulador.

## Criar a conta e entrar

Não existe mais usuário de demonstração dentro do app. A conta passa a ser a sua, no Firebase.

1. Na primeira tela, toque em **Cadastre-se**.
2. Preencha nome, usuário, e-mail e senha. A senha precisa ter pelo menos 6 caracteres. O usuário aceita letras, números, `_` e `.`, com no mínimo 3 caracteres.
3. Toque em **Cadastrar**. Se o e-mail ou o usuário já existirem, a tela avisa. Se der certo, o app abre direto no Resumo.
4. Para sair, abra o menu lateral e toque em **Sair**, ou use **Sair da conta** no Perfil.
5. Para voltar, informe o **e-mail** e a senha na tela de entrada. O nome de usuário não serve para entrar.

Feche o app e abra de novo: a sessão continua e os lançamentos também.

## Resumo

Mostra o saldo do mês, receitas, despesas e o saldo acumulado. Abaixo disso:

- **Cotação agora**: dólar e euro em real, com a variação do dia e o horário da consulta. O ícone de atualizar busca de novo na AwesomeAPI. Se a internet falhar, a própria carta mostra o erro. Esse é o serviço web do app.
- **Últimos 6 meses**: barras de receitas e despesas.
- **Onde você mais gastou**: as três maiores categorias do mês. **Ver tudo** abre Categorias.
- **Últimos lançamentos**: os cinco mais recentes. **Ver todos** abre a lista.

O botão **+** abre um lançamento novo.

Se a conta ainda não tem nada, o Resumo oferece **Novo lançamento** e **Carregar dados de exemplo**. Os exemplos (cerca de seis meses de gastos e quatro metas) são gravados no Firebase dessa conta.

## Lançamentos

1. Abra **Lançamentos** no menu.
2. Use as setas para mudar o mês. Não dá para passar do mês atual.
3. Veja o total de receitas e despesas do mês escolhido.
4. Busque por descrição ou categoria.
5. Filtre por **Todos**, **Despesas** ou **Receitas**.
6. Toque no lápis para editar ou na lixeira para excluir. A exclusão some do Firebase na hora.
7. O **+** também cria um lançamento.

## Novo lançamento e edição

1. Escolha **Despesa** ou **Receita**.
2. Informe valor, descrição, data e categoria.
3. A data aceita `DD/MM/AAAA`. Os atalhos **Hoje** e **Ontem** preenchem sozinhos. Data futura ou inválida não salva.
4. Toque em **Salvar lançamento**. O app volta para a lista.
5. Na edição, **Salvar alterações** grava por cima do mesmo lançamento. **Cancelar** descarta o que não foi salvo.

As categorias personalizadas aparecem aqui assim que são criadas.

## Categorias

1. Abra **Categorias**.
2. O mês mostra o total de despesas, a comparação com o mês anterior e a fatia de cada categoria. Embaixo do total, e em cada categoria, aparece quanto isso compra em dólar e em euro na cotação de hoje.
3. **Nova categoria**: nome, ícone e cor. Não pode repetir um nome que já existe. O teto do mês é opcional e pode ser em real, dólar ou euro. Se a moeda for estrangeira, o limite em real muda quando a cotação muda.
4. Em **Minhas categorias**, a barra mostra o quanto do teto já foi gasto neste mês. A lixeira apaga a categoria. Se algum lançamento ainda a usa, o app recusa e explica quantos lançamentos dependem dela.

## Metas

1. Abra **Metas**.
2. O topo soma o que já foi guardado em real e o alvo também em real. Meta em dólar ou euro entra nesse total pela cotação de hoje.
3. **Nova meta**: ícone, moeda (real, dólar ou euro), nome, valor alvo e, se quiser, quanto já está guardado em real. O que já foi guardado é sempre em real, porque o depósito sai da conta.
4. Em cada meta, **Depositar** soma reais ao que já foi guardado. Se o alvo for em dólar ou euro, a barra e o "faltam R$" usam a cotação atual. A mesma meta pode parecer mais perto ou mais longe no dia seguinte, sem mudar o valor guardado.
5. **Excluir** remove a meta.

## Perfil e senha

O Perfil mostra nome, usuário, e-mail, quantidade de lançamentos, metas e saldo total.

- **Alterar senha**: senha atual, senha nova e confirmação. A senha atual é conferida no Firebase. A nova também precisa ter pelo menos 6 caracteres e ser diferente da atual.
- **Carregar dados de exemplo**: só aparece quando ainda não há lançamentos. Faz o mesmo que o botão do Resumo.
- **Minhas metas** abre a tela de metas.
- **Sair da conta** encerra a sessão neste aparelho. Os dados continuam no Firebase.

## O que fica salvo

| Informação | Onde |
|---|---|
| E-mail e senha | Firebase Authentication |
| Nome e usuário | Firestore, coleção `usuarios` |
| Receitas e despesas | Firestore, coleção `lancamentos` |
| Metas e depósitos | Firestore, coleção `metas` |
| Categorias criadas | Firestore, coleção `categorias` |
| Cotação | Não é salva. É consultada na hora |

Para conferir a persistência: crie um lançamento, feche o app por completo, abra de novo e entre na mesma conta. O lançamento continua na lista. No console do Firebase, as coleções aparecem em Firestore Database.

## Serviço web

O Resumo chama:

`https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL`

Não precisa de chave. A resposta traz o valor de compra (`bid`), a variação do dia (`pctChange`) e a data da cotação. O Resumo mostra dólar e euro em real. Metas e tetos de categoria em dólar ou euro usam essa mesma cotação para calcular o valor em real.

## Se algo falhar

- Tela **Falta conectar o Firebase**: `src/firebaseConfig.js` ainda está com `COLE_AQUI`.
- Mensagem pedindo para publicar as regras: o arquivo `firestore.rules` ainda não foi publicado no Firestore.
- E-mail ou senha incorretos: use o e-mail do cadastro, não o nome de usuário.
- Cotação não carrega: o celular precisa de internet. Toque no ícone de atualizar.
