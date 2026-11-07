(() => {
  'use strict';
  const rules = window.TinyFrontiersRules;
  const book = 'Livro';
  const campaign = 'Criação da campanha';
  const lore = {
    human: {source:book,page:23,origin:'Humanos estão espalhados por muitos mundos e se adaptam a condições muito diferentes, de regiões geladas a desertos. Formam grandes cidades ou vivem de modo nômade.',appearance:'Há grande variedade de tamanhos, formas e temperamentos. A estatura média fica entre aproximadamente 1,5 e 1,8 m.',culture:'A adaptabilidade e a determinação fazem com que apareçam em muitos tipos de sociedade.'},
    gens: {source:book,page:24,origin:'Foram criados por engenharia genética como humanos modificados e antigos supersoldados. A vida nas rotas espaciais e em outros planetas levou ao desenvolvimento de uma cultura própria.',appearance:'Costumam ser mais altos, têm pele muito uniforme e mantêm excelente condição física.',culture:'São reservados e podem ser difíceis de conquistar. Muitos se consideram superiores aos humanos comuns.'},
    autoborg: {source:book,page:25,origin:'Construtos artificiais inteligentes, fabricados em massa e equipados com inteligências artificiais voltadas para uma função.',appearance:'Em geral têm cerca de 1,8 m, corpo metálico largo e pesado; alguns incorporam componentes tecnológicos ao próprio corpo.',culture:'Propósito e responsabilidade têm grande peso na sociedade Autoborg. São vistos como confiáveis, mas inflexíveis.'},
    khalumra: {source:book,page:26,origin:'Vivem em asteroides convertidos em comunidades móveis e viajam pela galáxia como comerciantes.',appearance:'Pequenos, com três olhos, cabeça larga, orelhas parecidas com as de morcego e dedos preênseis nas mãos e nos pés.',culture:'Curiosos, brincalhões e facilmente distraídos por novidades. Costumam ser bem-intencionados e gostam de companhia.'},
    salimar: {source:book,page:27,origin:'Preferem ambientes aquáticos ou úmidos, adequados à sua natureza anfíbia. São conhecidos como comerciantes firmes, mas justos.',appearance:'Têm corpo alongado, pernas curtas e cauda grossa. A pele lisa e brilhante varia entre tons escuros, brancos, prateados e cinzentos.',culture:'São inteligentes e dignos, com grande interesse por cultura. Vestir-se bem é sinal de riqueza e posição. Algumas linhagens se curam com fogo natural; outras, com frio natural.'},
    invex: {source:book,page:28,origin:'Exploradores do espaço profundo e mercenários conhecidos por sua resistência e tenacidade.',appearance:'Insetoides altos, com corpo alongado e protegido por bio carbono compacto, além de várias pernas finas e garras ou outros membros. A carapaça pode ter camuflagem reativa.',culture:'Tendem a manter foco intenso em um problema, às vezes até de forma obsessiva.'},
    tyranax: {source:book,page:29,origin:'Vêm do império espacial Tyranus Imperious e viajam pela galáxia como soldados, caçadores de recompensa e, ocasionalmente, assassinos.',appearance:'Muito altos, com quatro braços, pele escamosa e espinhos nas costas e nos braços. Os braços inferiores são menores e usados em tarefas delicadas.',culture:'A força, a violência e a dominação marcam a cultura Tyranax.'},
    ilvian: {source:book,page:30,origin:'Tecno gnósticos que buscam iluminação universal por meio de cibernética e tecnologia.',appearance:'Têm porte parecido com o humano, pele azul clara, olhos brancos leitosos e não têm pelos. É comum apresentarem implantes cibernéticos.',culture:'Muitos vivem de forma solitária e se dedicam à busca de conhecimento e aprimoramento tecnológico.'},
    jkheri: {source:book,page:31,origin:'Vieram de um sistema estelar desconhecido e escondido. Ninguém sabe ao certo por que deixam seu mundo natal.',appearance:'Humanoides esguios, sem cabelos, com quatro olhos, pele cor de areia e cerca de 2,1 m de altura.',culture:'Não têm gênero fixo e podem adotar diferentes identidades. O nome pessoal é essencial para preservar quem são; sua cultura permanece um segredo.'},
    splinter: {source:book,page:32,origin:'Sua origem é desconhecida. Há indícios de que não vieram da galáxia, mas não se sabe como chegaram até ela.',appearance:'Têm menos de 1 m, formas angulosas, roupas estranhas e nenhum órgão sensorial facilmente visível.',culture:'O nome “Splinter” começou como apelido dado por outras pessoas, mas a própria espécie também passou a usá-lo. Costumam aparecer sem explicar de onde vieram.'},
    nain: {source:book,page:33,origin:'Uma das mais antigas espécies interestelares, hoje presente em grande parte da população galáctica.',appearance:'Baixos, largos e robustos, com pele em tons de violeta ou azul e corpo muito musculoso.',culture:'São inventores habilidosos e pioneiros em cibernética, motores de naves, armas, armaduras e outras tecnologias.'},
    ahleghiri: {source:book,page:34,origin:'Evoluíram para aproveitar a luz e a fotossíntese de modo incomum entre as espécies galácticas.',appearance:'À distância podem parecer humanos; de perto, revelam pele vermelha, cascos e chifres curvados. Têm cerca de 2 m de altura.',culture:'Apesar da aparência que pode assustar, são amistosos, prestativos e têm um jeito cativante.'},
    hologram: {source:book,page:35,origin:'São inteligências artificiais que viajam e interagem por meio de projeções de luz sólida. A IA reside em um pequeno orbe flutuante.',appearance:'Podem escolher quase qualquer aparência, ligeiramente translúcida e ondulante. Durante a recarga, parecem uma esfera metálica prateada.',culture:'São relativamente raros, mas conhecidos em muitos lugares. Precisam recarregar diariamente.'},
    grunka: {source:book,page:36,origin:'Muitos trabalham como capangas, brutamontes ou fora da lei. Grupos podem disputar domínio de uma cidade em ciclos de rivalidade.',appearance:'Grandes, de pele cinzenta e corpo maciço, com aparência vagamente humanoide e traços que lembram um elefante.',culture:'Têm fama de violentos e de guardar rancor; até outros Grunka podem não gostar de conviver com eles.'},
    bilk: {source:book,page:37,origin:'Entidades psíquicas de regiões remotas do espaço que se ligam a um hospedeiro. Preferem hospedeiros humanos, cuja forma é mais fácil de adaptar.',appearance:'Podem parecer com o hospedeiro, mas a fusão cria uma forma de vida distinta.',culture:'A projeção psíquica pode deixar outras pessoas desconfortáveis. A percepção limitada do futuro faz alguns Bilks serem malvistos em jogos de azar. A fusão também pode suprimir habilidades inatas do hospedeiro. Mesmo que pareçam outra espécie, usam apenas os PV e traços próprios dos Bilks.'},
    replicant: {source:campaign,page:null,origin:'Seres bioengenheirados criados para funções específicas. Alguns recebem memórias implantadas; sua vida útil é de apenas 3 anos.',appearance:'Podem ter aparência humana ou traços animais, sempre com postura bípede. As variantes mantêm a mesma inteligência dos demais Replicantes.',culture:'A relação entre identidade, memória e propósito costuma marcar suas histórias.'},
    voidwalker: {source:campaign,page:null,origin:'Evoluíram em um planeta anão errante, quase sem gravidade e sem orbitar uma estrela.',appearance:'Extremamente pálidos, esguios e de membros longos.',culture:'Não precisam de oxigênio para sobreviver e se movimentam com facilidade em microgravidade.'},
    sintossauro: {source:campaign,page:null,origin:'Há séculos, um zoológico em Marte encomendou dinossauros biossintéticos para suas atrações. Transportar animais da Terra era difícil, e muitos não sobreviviam às condições marcianas. Os Sintossauros foram projetados para viver ali, alimentando-se e transformando nutrientes e minerais em tecido vivo e pequenas estruturas metálicas. Com o passar de centenas de anos, desenvolveram consciência, linguagem e inteligência, organizaram sua libertação e deixaram de ser propriedade do zoológico. A República reconheceu-os como um povo consciente, com direitos e cidadania.',appearance:'Cada linhagem lembra um grupo de dinossauros: raptores emplumados, ceratopsídeos, estegossauros, hadrossauros ou saurópodes. Escamas, penas, chifres e caudas convivem com placas metálicas discretas crescidas pelo próprio corpo. Todos possuem boca e sistema digestivo funcionais; a proporção de tecido e metal varia entre indivíduos.',culture:'Depois da emancipação, formaram comunidades próprias em Marte e se espalharam por outros mundos. Preservam a memória do cativeiro, mas seus caminhos e costumes são diversos. O direito de escolher onde viver e o que fazer com o próprio corpo tem valor especial para muitos Sintossauros.'}
  };
  const galleries = Object.fromEntries(Object.keys(rules.heritages).map(id => [id, [
    {src:`assets/heritages/${id}.png`,alt:`Ilustração de ${rules.heritages[id].name}`},
    {src:`assets/heritages/${id}-2.jpg`,alt:`Outra representação de ${rules.heritages[id].name}`},
    {src:`assets/heritages/${id}-3.jpg`,alt:`Outra representação de ${rules.heritages[id].name}`}
  ]]));
  galleries.replicant = [
    {src:'assets/heritages/replicant.png',alt:'Replicante humanoide'},
    {src:'assets/heritages/replicant-animal.png',alt:'Replicante bípede com traços animais'},
    {src:'assets/heritages/replicant-3.jpg',alt:'Replicante mulher idosa com corpo de fisiculturista'}
  ];
  galleries.sintossauro = [
    {src:'assets/heritages/sintossauro.png',alt:'Sintossauro com aparência de raptor emplumado'},
    {src:'assets/heritages/sintossauro-ceratopsideo.png',alt:'Sintossauro com aparência de ceratopsídeo'},
    {src:'assets/heritages/sintossauro-estegossauro.png',alt:'Sintossauro com aparência de estegossauro'},
    {src:'assets/heritages/sintossauro-parassaurolofo.png',alt:'Sintossauro com aparência de parassaurolofo'},
    {src:'assets/heritages/sintossauro-braquiossauro.png',alt:'Sintossauro com aparência de braquiossauro'}
  ];
  const grid = document.getElementById('species-grid');
  const search = document.getElementById('species-search');
  const count = document.getElementById('species-count');
  const empty = document.getElementById('species-empty');
  const dialog = document.getElementById('species-dialog');
  const dialogContent = document.getElementById('species-dialog-content');
  const entries = Object.entries(rules.heritages).map(([id,heritage]) => ({id,heritage,info:lore[id]}));
  let moveGallery = null;

  function node(tag,className,text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }
  function addLore(article,title,text) {
    const section = node('section','species-lore-section');
    section.append(node('h3','',title),node('p','',text));
    article.append(section);
  }
  function makeCard({id,heritage,info}) {
    const article = node('article','species-entry');
    const trigger = node('button','species-entry-trigger');
    trigger.type = 'button';
    const heritageTraits = (heritage.choices || heritage.traits || []).flatMap(([name,description])=>[name,description]);
    article.dataset.search = [heritage.name,heritage.description,info.origin,info.appearance,info.culture,...heritageTraits].join(' ').toLocaleLowerCase('pt-BR');
    trigger.setAttribute('aria-haspopup','dialog');
    trigger.setAttribute('aria-label',`${heritage.name}, ${heritage.hp} pontos de vida. Abrir detalhes da espécie.`);
    const image = node('img','species-image');
    image.src = `assets/heritages/${id}.png`;
    image.alt = '';
    image.loading = 'lazy';
    const body = node('span','species-entry-body');
    const top = node('span','species-entry-top');
    const heading = node('span','species-card-heading');
    const title = node('span','species-card-title',heritage.name);
    title.setAttribute('role','heading');
    title.setAttribute('aria-level','2');
    heading.append(title,node('span','species-origin-label',info.source));
    top.append(heading,node('span','species-hp',`${heritage.hp} PV`));
    body.append(top,node('span','species-open-hint','Abrir descrição e características ↗'));
    trigger.append(image,body);
    trigger.addEventListener('click',()=>openDetails({id,heritage,info}));
    article.append(trigger);
    return article;
  }
  function makeCarousel(id,heritage) {
    const slides = galleries[id] || [{src:`assets/heritages/${id}.png`,alt:`Ilustração de ${heritage.name}`}];
    let current = 0;
    const carousel = node('div','species-carousel');
    const image = node('img','species-modal-image');
    const controls = node('div','species-carousel-controls');
    const previous = node('button','species-carousel-arrow','←');
    const counter = node('span','species-carousel-counter');
    const next = node('button','species-carousel-arrow','→');
    const indicators = node('div','species-carousel-indicators');
    const dots = slides.map((slide,index)=>{
      const dot = node('button','species-carousel-dot');
      dot.type = 'button';
      dot.setAttribute('aria-label',`Mostrar imagem ${index+1} de ${slides.length}`);
      dot.addEventListener('click',()=>show(index));
      indicators.append(dot);
      return dot;
    });
    previous.type = 'button';
    previous.setAttribute('aria-label','Imagem anterior');
    next.type = 'button';
    next.setAttribute('aria-label','Próxima imagem');
    previous.addEventListener('click',()=>show((current-1+slides.length)%slides.length));
    next.addEventListener('click',()=>show((current+1)%slides.length));

    function show(index) {
      current = index;
      image.src = slides[current].src;
      image.alt = slides[current].alt || `Ilustração de ${heritage.name}`;
      counter.textContent = `${current+1} de ${slides.length}`;
      dots.forEach((dot,dotIndex)=>{
        dot.setAttribute('aria-pressed',String(dotIndex===current));
        dot.classList.toggle('active',dotIndex===current);
      });
    }

    if (slides.length > 1) {
      controls.append(previous,counter,next);
      carousel.append(image,controls,indicators);
      moveGallery = (direction)=>show((current+direction+slides.length)%slides.length);
    } else {
      counter.hidden = true;
      carousel.append(image);
      moveGallery = null;
    }
    show(0);
    return carousel;
  }
  function openDetails({id,heritage,info}) {
    const content = node('div','species-modal-body');
    const carousel = makeCarousel(id,heritage);
    const details = node('div','species-modal-details');
    const heading = node('div','species-modal-heading');
    const title = node('h2','',heritage.name);
    title.id = 'species-dialog-title';
    heading.append(node('span','species-origin-label',info.source),title);
    heading.append(node('span','species-hp',`${heritage.hp} PV base`));
    const sections = node('div','species-modal-sections');
    sections.tabIndex = 0;
    sections.setAttribute('role','region');
    sections.setAttribute('aria-label',`Informações sobre ${heritage.name}`);
    addLore(sections,'Origem',info.origin);
    addLore(sections,'Aparência',info.appearance);
    addLore(sections,'Costumes e cultura',info.culture);
    const traits = heritage.choices || heritage.traits || [];
    if (traits.length || heritage.extraTrait) {
      const section = node('section','species-lore-section species-traits');
      section.append(node('h3','','Característica de herança'));
      if (traits.length) {
        const list = node('ul','');
        traits.forEach(([name,description]) => list.append(node('li','',`${name}: ${description}`)));
        section.append(list);
      }
      if (heritage.extraTrait) section.append(node('p','','Humanos também escolhem uma característica adicional.'));
      sections.append(section);
    }
    if (info.page) sections.append(node('p','species-page-ref',`Tiny Frontiers: Revised · pág. ${info.page}`));
    details.append(heading,sections);
    content.append(carousel,details);
    dialogContent.replaceChildren(content);
    dialog.showModal();
  }
  entries.forEach(entry => grid.append(makeCard(entry)));

  function filterEntries() {
    const query = search.value.trim().toLocaleLowerCase('pt-BR');
    let visible = 0;
    grid.querySelectorAll('.species-entry').forEach(card => {
      const matches = card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? 'espécie' : 'espécies'}`;
    empty.hidden = visible > 0;
  }
  document.getElementById('species-dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown',event=>{
    if (!moveGallery) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveGallery(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveGallery(1); }
  });
  search.addEventListener('input',filterEntries);
  filterEntries();
})();
