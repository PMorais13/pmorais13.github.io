(() => {
  'use strict';

  // Os verbetes do cenário ficam juntos para facilitar a expansão do atlas.
  const locations = [
    {
      id: 'earth', name: 'Terra', type: 'Planeta', region: 'Sistema Solar',
      summary: 'O mundo natal da humanidade voltou a florescer e concentra decisões que repercutem muito além do Sistema Solar.',
      environment: 'Em 2613, a Terra é um planeta recuperado. Grandes corredores verdes atravessam antigas áreas urbanas, rios e costas foram restaurados e cidades densas convivem com regiões protegidas. Nos céus, o trânsito orbital lembra que ela também é um ponto de partida para o espaço.',
      life: 'É um centro cultural e político: delegações de muitos mundos se encontram aqui, enquanto universidades, arquivos, museus e mercados preservam e reinventam tradições. A recuperação não apagou as diferenças entre regiões nem as disputas sobre quem decide o futuro do planeta.',
      history: ''
    },
    {
      id: 'moon', name: 'Lua', type: 'Lua', region: 'Órbita da Terra',
      summary: 'Porto de passagem entre a Terra e o restante do Sistema Solar.',
      environment: 'O lado voltado para a Terra reúne terminais, docas e habitats sob a superfície. Fora das rotas iluminadas, o terreno continua silencioso, coberto de poeira fina e marcado por crateras antigas.',
      life: 'Tripulações, técnicos, viajantes e comerciantes se cruzam por pouco tempo. Quem mora aqui aprende a reconhecer uma nave pelo som de seus sistemas e a tratar ar, água e espaço como recursos compartilhados.',
      history: ''
    },
    {
      id: 'mars', name: 'Marte', type: 'Planeta', region: 'Sistema Solar',
      summary: 'Um mundo de desertos vermelhos, cidades protegidas e horizontes enormes.',
      environment: 'Mesmo em 2613, a superfície marciana continua fria e pouco acolhedora. Assentamentos abrigados e passagens subterrâneas permitem viver e trabalhar perto de vales, cânions e antigos leitos de água.',
      life: 'A distância entre comunidades favorece redes de apoio e uma cultura de manutenção cuidadosa. Arte, engenharia e exploração caminham juntas: cada expansão precisa respeitar os limites do ambiente.',
      history: 'Há séculos, um zoológico marciano criou dinossauros biossintéticos porque animais trazidos da Terra dificilmente sobreviviam ali. Com o tempo, os Sintossauros desenvolveram consciência e inteligência, organizaram sua libertação e foram reconhecidos pela República como um povo com direitos e cidadania.'
    },
    {
      id: 'ceres', name: 'Ceres', type: 'Planeta anão', region: 'Cinturão de asteroides',
      summary: 'Entre rocha, gelo e rotas comerciais, Ceres é uma parada importante do Cinturão.',
      environment: 'Habitações escavadas e docas pressurizadas se espalham por uma paisagem de crateras. A baixa gravidade muda o ritmo de qualquer caminhada; no exterior, a escuridão só é cortada por faróis e motores.',
      life: 'Muitas pessoas trabalham com transporte, reparos e processamento de recursos. Informações sobre rotas e disponibilidade de peças podem valer tanto quanto uma carga inteira.',
      history: ''
    },
    {
      id: 'europa', name: 'Europa', type: 'Lua', region: 'Órbita de Júpiter',
      summary: 'Gelo na superfície, um oceano oculto e instalações que vivem de perguntas.',
      environment: 'A crosta congelada de Europa é marcada por longas fraturas. Habitats isolados observam o gelo e investigam o oceano abaixo dele, sempre atentos ao frio, à radiação e à distância das rotas mais movimentadas.',
      life: 'Equipes pequenas dependem umas das outras para manter energia, comunicação e segurança. Descobertas científicas atraem visitantes, mas cada expedição exige preparo e paciência.',
      history: ''
    },
    {
      id: 'khalumra', name: 'Caravana Khalumra', type: 'Comunidade móvel', region: 'Rotas interestelares',
      summary: 'Asteroides adaptados viajam juntos, formando um mercado que nunca permanece no mesmo lugar.',
      environment: 'Túneis escavados ligam moradias, oficinas e docas improvisadas. Luzes, cabos e módulos novos transformam a silhueta dos asteroides a cada parada.',
      life: 'As comunidades Khalumra do guia de espécies viajam e negociam pela galáxia. Aqui, curiosidade e comércio aproximam viajantes de origens distintas; a caravana também troca histórias, peças e favores.',
      history: ''
    }
  ];

  const grid = document.getElementById('locations-grid');
  const search = document.getElementById('locations-search');
  const count = document.getElementById('locations-count');
  const empty = document.getElementById('locations-empty');
  const dialog = document.getElementById('locations-dialog');
  const dialogContent = document.getElementById('locations-dialog-content');

  function node(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value) element.textContent = value;
    return element;
  }

  function searchable(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  }

  function artwork(location, modal = false) {
    const image = node('img', modal ? 'species-modal-image location-modal-image' : 'species-image location-image');
    image.src = `assets/locations/${location.id}.png`;
    image.alt = `Ilustração de ${location.name} vista do espaço`;
    if (!modal) image.loading = 'lazy';
    return image;
  }

  function addSection(parent, title, body, empty = false) {
    const section = node('section', 'species-lore-section');
    const text = node('p', `location-lore-text${empty ? ' location-history-empty' : ''}`, body);
    section.append(node('h3', '', title), text);
    parent.append(section);
  }

  function openDetails(location) {
    const content = node('div', 'species-modal-body');
    const details = node('div', 'species-modal-details');
    const heading = node('div', 'species-modal-heading');
    const title = node('h2', '', location.name);
    title.id = 'locations-dialog-title';
    heading.append(node('span', 'species-origin-label', `${location.type} · ${location.region}`), title, node('span', 'species-hp', 'ANO 2613'));
    details.append(heading);
    addSection(details, 'Panorama', location.summary);
    addSection(details, 'Ambiente', location.environment);
    addSection(details, 'Vida local', location.life);
    addSection(details, 'História', location.history || 'História ainda não registrada.', !location.history);
    content.append(artwork(location, true), details);
    dialogContent.replaceChildren(content);
    dialog.showModal();
    details.querySelectorAll('.location-lore-text').forEach(text => {
      if (text.scrollHeight > text.clientHeight) text.tabIndex = 0;
    });
  }

  function makeCard(location) {
    const article = node('article', 'species-entry');
    article.dataset.search = searchable([location.name, location.type, location.region, location.summary, location.environment, location.life, location.history].join(' '));
    const trigger = node('button', 'species-entry-trigger');
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-label', `${location.name}, ${location.type}. Abrir detalhes da localização.`);
    const body = node('span', 'species-entry-body');
    const top = node('span', 'species-entry-top');
    const heading = node('span', 'species-card-heading');
    const title = node('span', 'species-card-title', location.name);
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '2');
    heading.append(title, node('span', 'species-origin-label', location.region));
    top.append(heading, node('span', 'species-hp', location.type));
    body.append(top, node('span', 'location-card-summary', location.summary), node('span', 'species-open-hint', 'Abrir descrição ↗'));
    trigger.append(artwork(location), body);
    trigger.addEventListener('click', () => openDetails(location));
    article.append(trigger);
    return article;
  }

  locations.forEach(location => grid.append(makeCard(location)));

  function filterEntries() {
    const query = searchable(search.value.trim());
    let visible = 0;
    grid.querySelectorAll('.species-entry').forEach(card => {
      const matches = card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? 'localização' : 'localizações'}`;
    empty.hidden = visible > 0;
  }

  document.getElementById('locations-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  search.addEventListener('input', filterEntries);
  filterEntries();
})();
