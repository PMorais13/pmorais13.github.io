# Exploradores — Tiny Frontiers

Gerador de fichas de personagem para **Tiny Frontiers: Revised (TinyD6)**. Funciona como aplicação estática, sem conta, servidor ou compilação.

## Como usar

1. Abra `index.html` no navegador do celular ou computador.
2. Na tela inicial, escolha **Criar nova ficha** ou abra uma ficha salva. Avance pelas seis etapas: espécie, vida e características, armas e equipamento, função e ofício familiar, história, e identidade. A espécie determina sua vida inicial e capacidade própria antes das demais escolhas.
3. Use **Guia de espécies** para consultar origem, aparência, costumes e características das espécies, **Localizações** para explorar os lugares da campanha em 2613, **Regras rápidas** para ver um resumo do jogo, **Visualizar ficha** para conferir os dados e **Exportar PDF** para baixar a ficha A4.
4. Cada ficha é salva automaticamente no armazenamento local do navegador. Ao reabrir a página no mesmo navegador, elas aparecem na tela inicial.

Na etapa **Identidade**, você pode escolher uma imagem para o avatar do personagem. A imagem é recortada, reduzida e salva junto com a ficha neste navegador; também aparece na visualização e no PDF. Sem avatar próprio, a ilustração da espécie continua sendo usada.

**Limpar ficha** esvazia a ficha aberta após confirmação. Na tela inicial, **Excluir** remove uma ficha após confirmação. Os dados ficam somente no navegador usado; limpar os dados do navegador também pode removê-los. Uma ficha salva pela versão anterior é importada automaticamente.

## Arquivos

- `index.html`: estrutura do formulário e da visualização.
- `especies.html`: guia das espécies, com origem, aparência, costumes e características.
- `localizacoes.html`: atlas da campanha em 2613, com busca e detalhes de cada destino.
- `regras.html`: resumo curto das regras básicas, incluindo testes, turnos, dano e queda.
- `css/style.css`: interface responsiva.
- `css/rules.css`: visual da página de regras.
- `css/species.css`: visual do guia de espécies.
- `css/locations.css`: ajustes das imagens e dos textos do atlas; reutiliza os componentes de `css/species.css`.
- `assets/locations/`: seis ilustrações geradas para os destinos do atlas, com cada corpo celeste mostrado inteiro.
- `js/app.js`: estado, validação, visualização e salvamento.
- `js/species.js`: conteúdo e busca do guia de espécies.
- `js/rules.js`: heranças, características e armas adaptadas e traduzidas do PDF incluído no projeto.
- `js/locations.js`: verbetes de 2613 e busca do atlas; adicione lugares ao array `locations` no início do arquivo e preencha o campo `history` de cada um quando sua história estiver definida.
- `assets/heritages/`: miniaturas das ilustrações de espécies extraídas das páginas 24–38 do PDF incluído no projeto e ilustrações originais dos Replicantes, Errantes do Vácuo e Sintossauros.
- `js/pdf.js`: composição do PDF.
- `js/portraits.js`: retratos compactos embutidos para exportar PDF mesmo ao abrir `index.html` por `file://`.
- `scripts/build-portraits.ps1`: regenera os retratos embutidos a partir de `assets/heritages/*.png`.
- `js/vendor/jspdf.umd.min.js`: jsPDF 2.5.2, distribuído sob licença MIT ([projeto](https://github.com/parallax/jsPDF)).

Nesta campanha, a função escolhida define automaticamente o ofício e sua vantagem em testes ligados à especialidade. Essa é uma adaptação para evitar duas escolhas redundantes; no livro, o ofício familiar é criado separadamente pelo jogador e o mestre decide quando se aplica. Ataques continuam seguindo as regras de proficiência e domínio de armas. A vida inicial, os bônus de características, os 10 GalCreds e o Kit do Explorador são aplicados automaticamente. Crença e história continuam livres.

A ficha usa as regras básicas de armadura: a armadura comum não reduz dano. Com a característica Mestre da Armadura e uma armadura selecionada, a ficha mostra 3 pontos de proteção separados dos PV. A redução de dano por armaduras leve, média e pesada faz parte das regras opcionais e não é calculada.

As armas mostram a categoria, o teste de ataque, o dano básico, o alcance descrito pelo livro e a regra de munição. O livro não atribui dano ou alcance numérico próprio a cada modelo de arma; nas regras básicas, todo acerto causa 1 PV. A ficha também informa as opções de zonas e dano variável sem aplicá-las automaticamente.
