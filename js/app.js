(() => {
  'use strict';
  const rules = window.TinyFrontiersRules;
  const STORAGE_KEY = 'tiny-frontiers-characters-v3';
  const legacyStorageKey = 'tiny-frontiers-character-v2';
  const oldStorageKey = 'tiny-frontiers-character-v1';
  const RULES_RETURN_KEY = 'tiny-frontiers-rules-return';
  const editable = ['name','heritage','heritageChoice','heritageBonus','hiddenWeaponType','homeworld','age','gender','appearance','description','role','roleOther','weaponGroup','masteredWeapon','bonusWeapon','equippedWeapon','armorType','armor','otherEquipment','familyTrade','belief','goal','history','notes'];
  // Regra da campanha: a função escolhida determina um único ofício aplicável.
  const roleTrades = {
    'Piloto':['Pilotagem','Vantagem em testes para pilotar veículos ou naves.'],
    'Soldado / Segurança':['Segurança','Vantagem em vigilância, patrulha e procedimentos de segurança; ataques seguem as regras de proficiência e domínio.'],
    'Engenheiro':['Manutenção de máquinas','Vantagem em diagnóstico e reparo de máquinas.'],
    'Especialista em tecnologia / Hacker':['Operação de sistemas','Vantagem para operar e analisar sistemas digitais; isso não substitui a característica Hacker.'],
    'Cientista':['Pesquisa científica','Vantagem em pesquisa e análise científica.'],
    'Médico':['Primeiros socorros','Vantagem em diagnóstico e cuidados médicos; isso não substitui a cura da característica Prodígio Médico.'],
    'Diplomata':['Negociação','Vantagem em negociação e mediação.'],
    'Explorador':['Reconhecimento','Vantagem em orientação e reconhecimento de terreno.']
  };
  const roleDescriptions = {
    'Piloto':'Nas regras opcionais de naves, quem ocupa o Timão também pode repetir uma Esquiva falha por rodada.',
    'Soldado / Segurança':'Combate e proteção da tripulação.',
    'Engenheiro':'Reparos, motores e sistemas mecânicos da nave.',
    'Especialista em tecnologia / Hacker':'Computadores, sistemas e tecnologia.',
    'Cientista':'Pesquisa e investigação científica.',
    'Médico':'Cuidados e atendimento da tripulação.',
    'Diplomata':'Negociação e relações com outros grupos.',
    'Explorador':'Reconhecimento e descoberta de novos lugares.'
  };
  const form = document.getElementById('character-form');
  const feedback = document.getElementById('feedback');
  const saveStatus = document.getElementById('save-status');
  const traitList = document.getElementById('trait-list');
  const inventoryList = document.getElementById('inventory-list');
  const homeView = document.getElementById('home-view');
  const editorView = document.getElementById('editor-view');
  const previewView = document.getElementById('preview-view');
  const characterList = document.getElementById('character-list');
  const avatarInput = document.getElementById('avatar-upload');
  const steps = [
    {heading:'heritage-title',title:'Escolha sua espécie',kicker:'01 — ESPÉCIE'},
    {heading:'traits-title',title:'Vida e características',kicker:'02 — CAPACIDADES'},
    {heading:'combat-title',title:'Prepare sua carga',kicker:'03 — CARGA'},
    {heading:'role-title',title:'Seu lugar na nave',kicker:'04 — A BORDO'},
    {heading:'story-title',title:'Conte sua história',kicker:'05 — HISTÓRIA'},
    {heading:'identity-title',title:'Quem é seu explorador?',kicker:'06 — REGISTRO PESSOAL'}
  ];
  const stepCards = steps.map(step => document.getElementById(step.heading).closest('.card'));
  let currentStep = 0;
  let character = emptyCharacter();
  let characters = [];
  let activeId = null;
  let avatarRequest = 0;

  function emptyCharacter() {
    return {...Object.fromEntries(editable.map(key => [key,''])), avatar:'', traitIds:[], inventory:[]};
  }
  function option(value,label) {
    const node = document.createElement('option');
    node.value = value;
    node.textContent = label;
    return node;
  }
  function setOptions(select, entries, placeholder, value) {
    select.replaceChildren(option('',placeholder), ...entries.map(([key,label]) => option(key,label)));
    select.value = value || '';
    if (select.value !== (value || '')) select.value = '';
    return select.value;
  }
  function showStep(index) {
    currentStep = Math.max(0, Math.min(steps.length-1,index));
    stepCards.forEach((card,i) => { card.hidden = i !== currentStep; });
    document.getElementById('step-kicker').textContent = steps[currentStep].kicker;
    document.getElementById('step-title').textContent = steps[currentStep].title;
    document.getElementById('step-count').textContent = `Etapa ${currentStep+1} de ${steps.length}`;
    document.getElementById('progress-fill').style.width = `${(currentStep+1)/steps.length*100}%`;
    document.querySelector('.required-note').hidden = currentStep !== steps.length-1;
    document.getElementById('previous-step').hidden = currentStep === 0;
    document.getElementById('next-step').hidden = currentStep === steps.length-1;
    document.querySelector('.step-actions').classList.toggle('single',currentStep === 0 || currentStep === steps.length-1);
    document.getElementById('final-actions').hidden = currentStep !== steps.length-1;
  }
  function showFeedback(message,isError=false) {
    feedback.textContent = message;
    feedback.classList.toggle('error-message',isError);
    feedback.hidden = false;
    feedback.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function cleanCharacter(data) {
      if (!data || typeof data !== 'object' || Array.isArray(data)) return emptyCharacter();
      const clean = emptyCharacter();
      editable.forEach(key => { if (typeof data[key] === 'string') clean[key] = data[key]; });
      if (typeof data.avatar === 'string' && /^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(data.avatar) && data.avatar.length < 700000) clean.avatar = data.avatar;
      if (!rules.heritages[clean.heritage]) {
        const match = Object.entries(rules.heritages).find(([,item]) => item.name.toLowerCase() === clean.heritage.toLowerCase());
        clean.heritage = match ? match[0] : '';
      }
      clean.traitIds = Array.isArray(data.traitIds) ? data.traitIds.filter(id => rules.traits[id] || rules.cyberTraits[id]).slice(0,4) : [];
      if (!clean.traitIds.length) {
        for (let i=1;i<=3;i++) {
          const label = data[`trait${i}Name`];
          const found = Object.entries({...rules.traits,...rules.cyberTraits}).find(([,trait]) => trait[0] === label);
          if (found) clean.traitIds.push(found[0]);
        }
      }
      clean.inventory = Array.isArray(data.inventory) ? data.inventory.filter(item => item && typeof item === 'object').map(item => ({
        name:String(item.name || ''),quantity:String(item.quantity || ''),depletion:String(item.depletion || '')
      })) : [];
      return clean;
  }
  function persistLibrary() {
    try {
      localStorage.setItem(STORAGE_KEY,JSON.stringify({characters}));
      saveStatus.textContent = 'Salvo neste dispositivo ✓';
      return true;
    } catch {
      saveStatus.textContent = 'Erro ao salvar neste dispositivo';
      showFeedback('Não foi possível salvar automaticamente neste navegador.',true);
      return false;
    }
  }
  function saveCharacter() {
    const entry = characters.find(item => item.id === activeId);
    if (!entry) return false;
    entry.data = character;
    entry.updatedAt = Date.now();
    return persistLibrary();
  }
  function loadLibrary() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed?.characters)) throw new Error('Arquivo inválido');
        characters = parsed.characters.filter(item => item && typeof item.id === 'string' && item.data && typeof item.data === 'object').map(item => ({
          id:item.id,
          data:cleanCharacter(item.data),
          updatedAt:Number.isFinite(item.updatedAt) ? item.updatedAt : Date.now()
        }));
        return;
      }
      const legacy = localStorage.getItem(legacyStorageKey) || localStorage.getItem(oldStorageKey);
      if (!legacy) return;
      const data = JSON.parse(legacy);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return;
      const clean = cleanCharacter(data);
      if (!editable.some(key => clean[key]) && !clean.traitIds.some(Boolean) && !clean.inventory.length) return;
      characters = [{id:makeId(),data:clean,updatedAt:Date.now()}];
      persistLibrary();
    } catch {
      showFeedback('Não foi possível recuperar as fichas salvas neste navegador.',true);
    }
  }
  function makeId() {
    return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
  function renderLibrary() {
    characterList.replaceChildren();
    const sorted = [...characters].sort((a,b) => b.updatedAt-a.updatedAt);
    document.getElementById('library-count').textContent = `${sorted.length} ${sorted.length === 1 ? 'ficha' : 'fichas'}`;
    document.getElementById('library-empty').hidden = sorted.length > 0;
    sorted.forEach((entry,index) => {
      const card = makeElement('article','library-card');
      const portrait = portraitFor(entry.data);
      if (portrait) {
        const image = makeElement('img','library-avatar');
        image.src = portrait;
        image.alt = '';
        card.append(image);
      }
      const body = makeElement('div','library-card-body');
      const title = makeElement('h3','',entry.data.name.trim() || `Explorador sem nome ${index+1}`);
      const species = rules.heritages[entry.data.heritage]?.name || '';
      const detail = makeElement('p','', [species,roleLabel(entry.data)].filter(Boolean).join(' · ') || 'Ficha em criação');
      const date = makeElement('small','',`Atualizada em ${new Date(entry.updatedAt).toLocaleDateString('pt-BR')}`);
      body.append(title,detail,date);
      const actions = makeElement('div','library-card-actions');
      const open = makeElement('button','button button-secondary','Abrir ficha →');
      open.type = 'button';
      open.addEventListener('click',() => openCharacter(entry.id));
      const remove = makeElement('button','library-delete','Excluir');
      remove.type = 'button';
      remove.setAttribute('aria-label',`Excluir ficha de ${entry.data.name.trim() || 'explorador sem nome'}`);
      remove.addEventListener('click',() => deleteCharacter(entry.id));
      actions.append(open,remove);
      card.append(body,actions);
      characterList.append(card);
    });
  }
  function showHome() {
    homeView.hidden = false;
    editorView.hidden = true;
    previewView.hidden = true;
    feedback.hidden = true;
    renderLibrary();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function openCharacter(id,step=0) {
    const entry = characters.find(item => item.id === id);
    if (!entry) return;
    avatarRequest++;
    activeId = id;
    character = cleanCharacter(entry.data);
    renderForm();
    showStep(step);
    showEditor();
    feedback.hidden = true;
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function deleteCharacter(id) {
    const entry = characters.find(item => item.id === id);
    if (!entry || !window.confirm(`Excluir a ficha de ${entry.data.name.trim() || 'explorador sem nome'}? Esta ação não pode ser desfeita.`)) return;
    characters = characters.filter(item => item.id !== id);
    if (activeId === id) activeId = null;
    persistLibrary();
    renderLibrary();
  }
  function createInventoryRow(item={}) {
    const row = document.getElementById('inventory-template').content.firstElementChild.cloneNode(true);
    row.querySelector('.item-name').value = item.name || '';
    row.querySelector('.item-quantity').value = item.quantity || '';
    row.querySelector('.item-depletion').value = item.depletion === undefined ? '6' : item.depletion;
    inventoryList.append(row);
  }
  function traitEntry(id) { return rules.traits[id] || rules.cyberTraits[id]; }
  function eligibleTraits() {
    const entries = Object.entries(rules.traits);
    entries.push(...Object.entries(rules.cyberTraits));
    return entries.filter(([id]) => !id.startsWith('psionic-') || !['autoborg','hologram'].includes(character.heritage));
  }
  function reconcileTraits() {
    const count = character.heritage === 'human' ? 4 : 3;
    const allowed = new Set(eligibleTraits().map(([id]) => id));
    const seen = new Set();
    let cyberCount = 0;
    character.traitIds = Array.from({length:count},(_,index) => {
      const id = character.traitIds[index] || '';
      if (!allowed.has(id) || seen.has(id)) return '';
      if (rules.cyberTraits[id] && ++cyberCount > 2) return '';
      seen.add(id);
      return id;
    });
    if (character.heritage !== 'ilvian' || !rules.cyberTraits[character.heritageBonus] || seen.has(character.heritageBonus)) character.heritageBonus = '';
  }
  function renderTraitRows() {
    reconcileTraits();
    const entries = eligibleTraits().map(([id,trait]) => [id,trait[0]]);
    traitList.replaceChildren();
    character.traitIds.forEach((id,index) => {
      const row = document.createElement('div');
      row.className = 'trait-row';
      const number = document.createElement('span');
      number.className = 'trait-number';
      number.textContent = String(index+1).padStart(2,'0');
      const container = document.createElement('div');
      container.className = 'fields';
      const field = document.createElement('div');
      field.className = 'field';
      const label = document.createElement('label');
      label.htmlFor = `trait-${index}`;
      label.textContent = `Característica ${index+1}`;
      const select = document.createElement('select');
      select.id = label.htmlFor;
      select.className = 'trait-select';
      select.dataset.index = String(index);
      setOptions(select,entries,'Escolha uma característica',id);
      const detail = document.createElement('div');
      detail.className = 'rule-detail';
      detail.hidden = !id;
      detail.textContent = id ? traitEntry(id)[1] : '';
      field.append(label,select,detail);
      container.append(field);
      row.append(number,container);
      traitList.append(row);
    });
    document.getElementById('trait-count-help').textContent = character.heritage === 'human'
      ? 'Humanos escolhem quatro características diferentes.'
      : 'Escolha três características diferentes do livro.';
    const bonusField = document.getElementById('heritage-bonus-field');
    bonusField.hidden = character.heritage !== 'ilvian';
    if (!bonusField.hidden) {
      character.heritageBonus = setOptions(form.elements.heritageBonus,Object.entries(rules.cyberTraits).map(([id,item])=>[id,item[0]]),'Escolha a característica adicional',character.heritageBonus);
      const detail = document.getElementById('heritage-bonus-detail');
      detail.textContent = character.heritageBonus ? rules.cyberTraits[character.heritageBonus][1] : '';
      detail.hidden = !character.heritageBonus;
    } else { character.heritageBonus = ''; form.elements.heritageBonus.value = ''; }
    const hiddenWeaponField = document.getElementById('hidden-weapon-field');
    hiddenWeaponField.hidden = !(character.traitIds.includes('hiddenWeapon') || character.heritageBonus === 'hiddenWeapon');
    if (hiddenWeaponField.hidden) { character.hiddenWeaponType = ''; form.elements.hiddenWeaponType.value = ''; }
    else form.elements.hiddenWeaponType.value = character.hiddenWeaponType;
  }
  function renderHeritage() {
    const heritage = rules.heritages[character.heritage];
    form.elements.heritage.value = character.heritage;
    document.querySelectorAll('.heritage-card').forEach(card => {
      const selected = card.dataset.heritage === character.heritage;
      card.setAttribute('aria-pressed',String(selected));
    });
    document.getElementById('heritage-detail').hidden = !heritage;
    document.getElementById('heritage-name').textContent = heritage?.name || '';
    document.getElementById('heritage-hp').textContent = heritage ? `${heritage.hp} PV base` : '';
    document.getElementById('heritage-description').textContent = heritage?.description || '';
    const detailImage = document.getElementById('heritage-detail-image');
    detailImage.src = heritage ? `assets/heritages/${character.heritage}.png` : '';
    detailImage.alt = heritage ? `Ilustração da espécie ${heritage.name}` : '';
    renderAvatar();
    const choiceField = document.getElementById('heritage-choice-field');
    choiceField.hidden = !heritage?.choices;
    if (heritage?.choices) {
      character.heritageChoice = setOptions(form.elements.heritageChoice,heritage.choices.map((item,i)=>[String(i),item[0]]),'Escolha uma opção',character.heritageChoice);
    } else { character.heritageChoice = ''; form.elements.heritageChoice.value = ''; }
    const descriptions = heritage ? (heritage.choices ? (character.heritageChoice !== '' && heritage.choices[Number(character.heritageChoice)] ? [heritage.choices[Number(character.heritageChoice)]] : []) : heritage.traits) : [];
    document.getElementById('heritage-trait').textContent = descriptions.length
      ? descriptions.map(([name,description])=>`${name}: ${description}`).join(' ')
      : heritage?.choices ? 'Escolha uma das duas capacidades da herança.' : heritage?.extraTrait ? 'Adaptabilidade: escolha uma quarta característica da lista.' : 'Escolha uma herança para ver suas capacidades.';
  }
  function renderWeapons() {
    const groups = Object.entries(rules.weapons).filter(([group]) => !(
      (group === 'Improvisadas' && !character.traitIds.includes('barfighter')) ||
      (group === 'Desarmado' && !character.traitIds.includes('martial'))
    ));
    character.weaponGroup = setOptions(form.elements.weaponGroup,groups.map(([name])=>[name,name]),'Escolha um grupo',character.weaponGroup);
    const weapons = rules.weapons[character.weaponGroup] || [];
    character.masteredWeapon = setOptions(form.elements.masteredWeapon,
      character.weaponGroup === 'Improvisadas' ? [] : weapons.map(name=>[name,name]),
      character.weaponGroup === 'Improvisadas' ? 'Sem domínio de arma improvisada' : 'Escolha uma arma do grupo',character.masteredWeapon);
    const bonusField = document.getElementById('bonus-weapon-field');
    bonusField.hidden = character.heritage !== 'gens';
    if (!bonusField.hidden) {
      const all = Object.values(rules.weapons).flat().filter(name => name !== 'Arma improvisada' && name !== 'Estilo marcial' && name !== character.masteredWeapon);
      character.bonusWeapon = setOptions(form.elements.bonusWeapon,all.map(name=>[name,name]),'Escolha a arma adicional',character.bonusWeapon);
    } else { character.bonusWeapon = ''; form.elements.bonusWeapon.value = ''; }
    const initialWeapons = [character.masteredWeapon,character.bonusWeapon];
    if (character.weaponGroup === 'Improvisadas') initialWeapons.push(...rules.weapons.Improvisadas);
    const available = initialWeapons.filter(Boolean).map(name => {
      const group = Object.entries(rules.weapons).find(([,names]) => names.includes(name))?.[0];
      return [name,`${name} — ${group}`];
    });
    character.equippedWeapon = setOptions(form.elements.equippedWeapon,available,'Escolha sua arma inicial',character.equippedWeapon);
  }
  function calculate() {
    const heritage = rules.heritages[character.heritage];
    character.heritageName = heritage?.name || '';
    const heritageTraits = heritage?.choices
      ? (character.heritageChoice !== '' && heritage.choices[Number(character.heritageChoice)] ? [heritage.choices[Number(character.heritageChoice)]] : [])
      : heritage?.traits || [];
    character.heritageTrait = heritageTraits.map(([name,description])=>`${name}: ${description}`).join(' ');
    character.traitIds.forEach((id,index) => {
      const entry = traitEntry(id);
      character[`trait${index+1}Name`] = entry?.[0] || '';
      character[`trait${index+1}Description`] = entry?.[1] || '';
    });
    for (let i=character.traitIds.length;i<4;i++) {
      character[`trait${i+1}Name`] = '';
      character[`trait${i+1}Description`] = '';
    }
    if (character.heritageBonus) {
      const bonus = rules.cyberTraits[character.heritageBonus];
      character.trait5Name = bonus[0];
      character.trait5Description = bonus[1];
    } else { character.trait5Name = ''; character.trait5Description = ''; }
    document.getElementById('shield-overlap-help').hidden = !(character.traitIds.includes('armshield') && character.traitIds.includes('shield'));
    character.hpBase = heritage ? String(heritage.hp) : '';
    const hpBonus = (character.traitIds.includes('tough') ? 2 : 0)
      + (character.traitIds.includes('subsurface') || character.heritageBonus === 'subsurface' ? 2 : 0);
    character.hpMax = heritage ? String(heritage.hp+hpBonus) : '';
    character.hpCurrent = character.hpMax;
    character.armorHp = character.traitIds.includes('armorMaster') && character.armorType === 'armor' ? '3' : '';
    document.getElementById('armor-hp-field').hidden = !character.armorHp;
    document.getElementById('armorHp').textContent = character.armorHp || '—';
    character.armorDisplay = [character.armorType === 'armor' ? 'Armadura comum' : character.armorType === 'clothes' ? 'Vestimenta comum' : '',character.armor.trim()].filter(Boolean).join(' — ');
    character.shieldRule = character.traitIds.includes('armshield') || character.traitIds.includes('shield')
      ? 'Enquanto empunha o escudo, a ação Esquiva usa 2d6 em vez de 1d6. Dois escudos não aumentam os dados.'
      : '';
    character.credits = '10';
    character.proficiencies = character.weaponGroup ? [character.weaponGroup] : [];
    character.masteredWeapons = [character.masteredWeapon,character.bonusWeapon].filter(Boolean);
    character.equippedWeaponGroup = Object.entries(rules.weapons).find(([,weapons]) => weapons.includes(character.equippedWeapon))?.[0] || '';
    const weaponRules = rules.weaponGroups[character.equippedWeaponGroup];
    const attackDice = !character.equippedWeapon ? ''
      : character.masteredWeapons.includes(character.equippedWeapon) ? '3d6 (arma dominada)'
      : character.weaponGroup === character.equippedWeaponGroup ? '2d6 (grupo proficiente)'
      : '1d6 (sem proficiência)';
    character.weaponInfo = weaponRules
      ? `${character.equippedWeapon} — ${character.equippedWeaponGroup}. Ataque: ${attackDice}. Dano: 1 PV por acerto nas regras básicas. Alcance: ${weaponRules.reach}. Uso: ${weaponRules.hands}. ${weaponRules.ammo}. Zonas opcionais: ${weaponRules.zones}.${weaponRules.optionalDamage ? ` Dano variável opcional: ${weaponRules.optionalDamage}.` : ''}`
      : '';
    document.getElementById('weapon-info').textContent = character.weaponInfo || 'Escolha uma arma inicial para ver alcance, dano e teste de ataque.';
    character.explorersKit = [...rules.explorersKit];
    character.startingEquipment = [
      ...(character.traitIds.includes('armshield') ? ['Escudo de braço'] : []),
      ...(character.traitIds.includes('shield') ? ['Escudo'] : []),
      ...(character.hiddenWeaponType ? [character.hiddenWeaponType] : [])
    ];
    ['hpBase','hpMax','hpCurrent','credits'].forEach(key => { document.getElementById(key).textContent = character[key] || '—'; });
  }
  function updateRole(syncTrade=false) {
    document.getElementById('role-other-field').hidden = character.role !== 'other';
    const preset = roleTrades[character.role];
    if (syncTrade || !character.familyTrade) character.familyTrade = preset?.[0] || (character.role === 'other' ? character.roleOther.trim() : '');
    form.elements.familyTrade.value = character.familyTrade;
    character.tradeBenefit = !character.role || !character.familyTrade ? ''
      : preset && character.familyTrade === preset[0]
        ? preset[1]
        : 'Vantagem em testes diretamente ligados a esse ofício; o mestre decide quando se aplica.';
    const description = document.getElementById('role-description');
    description.textContent = roleDescriptions[character.role] || '';
    description.hidden = !description.textContent;
    const summary = document.getElementById('trade-summary');
    summary.textContent = !character.role
      ? 'Escolha uma função para ver seu ofício e quando ele dá vantagem.'
      : character.role === 'other'
        ? character.familyTrade ? `Ofício: ${character.familyTrade}. Vantagem em testes diretamente ligados a ele; o mestre decide quando se aplica.` : 'Descreva sua função ou especialidade para definir seu ofício.'
        : character.familyTrade !== preset[0]
          ? `Ofício salvo anteriormente: ${character.familyTrade}. Vantagem em testes ligados a esse ofício. Se escolher a função novamente, o ofício padrão será ${preset[0]}.`
          : `Ofício: ${preset[0]}. ${preset[1]}`;
  }
  function renderRules() {
    renderHeritage();
    renderTraitRows();
    renderWeapons();
    calculate();
  }
  function readForm() {
    editable.forEach(key => {
      if (form.elements[key] && form.elements[key].tagName !== 'OUTPUT') character[key] = form.elements[key].value;
    });
    character.traitIds = [...traitList.querySelectorAll('.trait-select')].map(select=>select.value);
    character.inventory = [...inventoryList.querySelectorAll('.inventory-row')].map(row=>({
      name:row.querySelector('.item-name').value,
      quantity:row.querySelector('.item-quantity').value,
      depletion:row.querySelector('.item-depletion').value
    }));
  }
  function renderForm() {
    form.elements.heritage.value = character.heritage;
    const deferred = new Set(['heritageChoice','heritageBonus','weaponGroup','masteredWeapon','bonusWeapon','equippedWeapon']);
    editable.forEach(key => {
      const control = form.elements[key];
      if (control && control.tagName !== 'OUTPUT' && key !== 'heritage' && !deferred.has(key)) control.value = character[key];
    });
    inventoryList.replaceChildren();
    character.inventory.forEach(createInventoryRow);
    updateRole();
    renderRules();
  }
  function normalizeNumber(input) {
    if (input.type !== 'number' || input.value === '') return;
    const value = Number(input.value);
    input.value = Number.isFinite(value) ? String(Math.max(0,Math.min(input.max ? Number(input.max) : Infinity,Math.floor(value)))) : '';
  }
  function handleInput(event) {
    if (event.target === avatarInput) return;
    if (event.type === 'change' && event.target.matches('input[type="number"]')) normalizeNumber(event.target);
    readForm();
    if (event.type === 'change' && event.target.matches('select')) renderRules();
    else calculate();
    updateRole(event.target.id === 'role' || event.target.id === 'roleOther');
    if (character.name.trim()) {
      document.getElementById('name-error').hidden = true;
      form.elements.name.removeAttribute('aria-invalid');
    }
    feedback.hidden = true;
    saveCharacter();
  }
  function roleLabel(data) { return data.role === 'other' ? data.roleOther.trim() : data.role; }
  function portraitFor(data) {
    return data.avatar || (rules.heritages[data.heritage] ? `assets/heritages/${data.heritage}.png` : '');
  }
  function renderAvatar() {
    const image = document.getElementById('avatar-preview');
    const portrait = portraitFor(character);
    image.hidden = !portrait;
    image.src = portrait;
    document.getElementById('avatar-placeholder').hidden = !!portrait;
    document.getElementById('avatar-remove').hidden = !character.avatar;
    avatarInput.value = '';
  }
  async function uploadAvatar(file) {
    if (!file) return;
    const selectedId = activeId;
    const request = ++avatarRequest;
    if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      showFeedback('Escolha uma imagem JPG, PNG, WebP ou GIF de até 10 MB.',true);
      avatarInput.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (activeId !== selectedId || avatarRequest !== request) return;
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 600;
      const context = canvas.getContext('2d');
      if (!context || !image.naturalWidth || !image.naturalHeight) throw new Error('Imagem inválida');
      const size = Math.min(image.naturalWidth / 4, image.naturalHeight / 5);
      context.fillStyle = '#e1dccd';
      context.fillRect(0,0,480,600);
      context.drawImage(image,(image.naturalWidth-size*4)/2,(image.naturalHeight-size*5)/2,size*4,size*5,0,0,480,600);
      let avatar = canvas.toDataURL('image/jpeg',0.78);
      if (avatar.length > 500000) {
        const smaller = document.createElement('canvas');
        smaller.width = 320;
        smaller.height = 400;
        smaller.getContext('2d').drawImage(canvas,0,0,320,400);
        avatar = smaller.toDataURL('image/jpeg',0.7);
      }
      const previous = character.avatar;
      const entry = characters.find(item => item.id === selectedId);
      const previousUpdatedAt = entry?.updatedAt;
      character.avatar = avatar;
      if (!saveCharacter()) {
        character.avatar = previous;
        if (entry) entry.updatedAt = previousUpdatedAt;
        return;
      }
      renderAvatar();
      feedback.hidden = true;
    } catch (error) {
      console.error('Falha ao carregar avatar:',error);
      showFeedback('Não foi possível usar essa imagem. Escolha outro arquivo.',true);
    } finally {
      URL.revokeObjectURL(url);
      avatarInput.value = '';
    }
  }
  function makeElement(tag,className,value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value != null) element.textContent = value;
    return element;
  }
  function addPreviewSection(root,title,fields,list=[]) {
    const visible = fields.filter(([,value])=>String(value || '').trim());
    if (!visible.length && !list.length) return;
    const section = makeElement('section','preview-section');
    section.append(makeElement('h3','',title));
    if (visible.length) {
      const grid = makeElement('div','preview-grid');
      visible.forEach(([label,value]) => {
        const field = makeElement('div','preview-field');
        field.append(makeElement('strong','',label),makeElement('span','',value));
        grid.append(field);
      });
      section.append(grid);
    }
    if (list.length) {
      const ul = makeElement('ul','preview-list');
      list.forEach(value => ul.append(makeElement('li','',value)));
      section.append(ul);
    }
    root.append(section);
  }
  function renderPreview() {
    const root = document.getElementById('preview-content');
    root.replaceChildren();
    root.append(makeElement('div','preview-topline','✦ EXPLORADORES / REGISTRO DE PERSONAGEM'));
    const portrait = portraitFor(character);
    if (portrait) {
      const image = makeElement('img','preview-avatar');
      image.src = portrait;
      image.alt = `Avatar de ${character.name.trim() || 'explorador sem nome'}`;
      root.append(image);
    }
    root.append(makeElement('h2','',character.name.trim() || 'Explorador sem nome'));
    const subtitle = [character.heritageName,roleLabel(character)].filter(Boolean).join(' · ');
    if (subtitle) root.append(makeElement('p','preview-subtitle',subtitle));
    addPreviewSection(root,'Identidade',[['Planeta natal',character.homeworld],['Idade',character.age],['Gênero',character.gender],['Aparência',character.appearance],['Descrição',character.description]]);
    const traitLines = [1,2,3,4,5].map(i => [character[`trait${i}Name`],character[`trait${i}Description`]].filter(Boolean).join(' — ')).filter(Boolean);
    addPreviewSection(root,'Herança e características',[['Característica da herança',character.heritageTrait],['Vida base',character.hpBase],['Vida máxima',character.hpMax],['Vida inicial / atual',character.hpCurrent],['Proteção da armadura',character.armorHp]],traitLines);
    addPreviewSection(root,'Combate e equipamento',[['Proficiência',character.proficiencies.join(', ')],['Armas dominadas',character.masteredWeapons.join(', ')],['Arma inicial',character.equippedWeapon],['Regras da arma inicial',character.weaponInfo],['Armadura ou vestimenta',character.armorDisplay],['Escudo / Esquiva',character.shieldRule],['Outros equipamentos',character.otherEquipment],['GalCreds iniciais',character.credits]],[
      ...character.explorersKit.map(item=>`Kit do Explorador: ${item}`),
      ...character.startingEquipment.map(item=>`Equipamento inicial: ${item}`)
    ]);
    addPreviewSection(root,'Inventário',[],character.inventory.filter(item=>item.name.trim()).map(item=>[item.name,item.quantity ? `Qtd. ${item.quantity}` : '',item.depletion ? `Esgotamento ${item.depletion}/6` : ''].filter(Boolean).join(' · ')));
    addPreviewSection(root,'História e personalidade',[['Ofício / especialidade',character.familyTrade],['Benefício do ofício',character.tradeBenefit],['Crença',character.belief],['Objetivo',character.goal],['História',character.history],['Anotações',character.notes]]);
  }
  function validateExport() {
    form.querySelectorAll('input[type="number"]').forEach(normalizeNumber);
    readForm();
    renderRules();
    updateRole();
    saveCharacter();
    const missing = [
      [!character.heritage,0,'Escolha uma herança.'],
      [character.heritage === 'salimar' && !character.heritageChoice,0,'Escolha uma característica Salimar.'],
      [character.traitIds.some(id=>!id),1,'Escolha todas as características iniciais.'],
      [character.heritage === 'ilvian' && !character.heritageBonus,1,'Escolha a característica cibernética adicional do Ilvian.'],
      [!document.getElementById('hidden-weapon-field').hidden && !character.hiddenWeaponType,1,'Escolha o tipo da arma oculta.'],
      [!character.weaponGroup,2,'Escolha uma proficiência com armas.'],
      [character.weaponGroup !== 'Improvisadas' && !character.masteredWeapon,2,'Escolha a arma dominada.'],
      [character.heritage === 'gens' && !character.bonusWeapon,2,'Escolha a arma adicional dos Gens.'],
      [!character.equippedWeapon,2,'Escolha a arma inicial.'],
      [!character.role,3,'Escolha uma função e seu ofício.'],
      [character.role === 'other' && !character.roleOther.trim(),3,'Descreva sua função ou especialidade.'],
      [!character.name.trim(),5,'Informe o nome do personagem.']
    ].find(([condition])=>condition);
    if (missing) {
      showEditor();
      showStep(missing[1]);
      showFeedback(missing[2],true);
      return false;
    }
    return true;
  }
  function showEditor() {
    homeView.hidden = true;
    previewView.hidden = true;
    editorView.hidden = false;
  }
  function exportCharacter() {
    if (!validateExport()) return;
    try {
      const portraitData = character.avatar || window.TinyFrontiersPortraits?.[character.heritage] || '';
      window.generateCharacterPdf({...character,heritage:character.heritageName,portrait:portraitData},roleLabel(character));
      showFeedback('PDF gerado. Verifique os downloads do seu navegador.');
    } catch(error) {
      console.error('Falha ao gerar PDF:',error);
      showFeedback('Não foi possível gerar o PDF. Recarregue a página e tente novamente.',true);
    }
  }
  stepCards.forEach((card,index) => {
    form.append(card);
    card.querySelector('.card-icon').textContent = String(index+1).padStart(2,'0');
  });
  const heritageCards = document.getElementById('heritage-cards');
  Object.entries(rules.heritages).forEach(([id,heritage]) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'heritage-card';
    card.dataset.heritage = id;
    card.setAttribute('aria-pressed','false');
    const image = document.createElement('img');
    image.src = `assets/heritages/${id}.png`;
    image.alt = '';
    image.loading = 'lazy';
    const name = document.createElement('strong');
    name.textContent = heritage.name;
    const hp = document.createElement('small');
    hp.textContent = `${heritage.hp} PV base`;
    card.append(image,name,hp);
    heritageCards.append(card);
  });
  heritageCards.addEventListener('click',event => {
    const card = event.target.closest('.heritage-card');
    if (!card) return;
    readForm();
    character.heritage = card.dataset.heritage;
    renderRules();
    feedback.hidden = true;
    saveCharacter();
    requestAnimationFrame(() => window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'}));
  });
  form.addEventListener('input',handleInput);
  form.addEventListener('change',handleInput);
  avatarInput.addEventListener('change',event => uploadAvatar(event.target.files?.[0]));
  document.getElementById('avatar-remove').addEventListener('click',() => {
    const previous = character.avatar;
    if (!previous) return;
    avatarRequest++;
    character.avatar = '';
    if (!saveCharacter()) { character.avatar = previous; return; }
    renderAvatar();
    feedback.hidden = true;
  });
  document.getElementById('add-item').addEventListener('click',()=>{
    createInventoryRow();
    readForm();
    saveCharacter();
    inventoryList.lastElementChild.querySelector('input').focus();
  });
  inventoryList.addEventListener('click',event=>{
    const button = event.target.closest('.remove-button');
    if (!button) return;
    button.closest('.repeat-row').remove();
    readForm();
    saveCharacter();
  });
  document.getElementById('preview-button').addEventListener('click',()=>{
    readForm();
    renderRules();
    renderPreview();
    document.getElementById('editor-view').hidden = true;
    document.getElementById('preview-view').hidden = false;
    window.scrollTo({top:0,behavior:'smooth'});
  });
  document.getElementById('new-character').addEventListener('click',()=>{
    const id = makeId();
    characters.push({id,data:emptyCharacter(),updatedAt:Date.now()});
    persistLibrary();
    openCharacter(id);
  });
  document.getElementById('editor-home').addEventListener('click',showHome);
  document.getElementById('preview-home').addEventListener('click',showHome);
  document.getElementById('back-button').addEventListener('click',()=>{showEditor();showStep(currentStep);window.scrollTo({top:0,behavior:'smooth'});});
  document.getElementById('previous-step').addEventListener('click',()=>{showStep(currentStep-1);feedback.hidden=true;document.getElementById('step-title').scrollIntoView({block:'start',behavior:'smooth'});});
  document.getElementById('back-to-heritage').addEventListener('click',()=>{showStep(0);feedback.hidden=true;window.scrollTo({top:0,behavior:'smooth'});});
  document.getElementById('next-step').addEventListener('click',()=>{showStep(currentStep+1);feedback.hidden=true;document.getElementById('step-title').scrollIntoView({block:'start',behavior:'smooth'});});
  document.getElementById('export-button').addEventListener('click',exportCharacter);
  document.getElementById('preview-export-button').addEventListener('click',exportCharacter);
  document.querySelectorAll('.header-actions .rules-link').forEach(link=>link.addEventListener('click',()=>{
    try {
      sessionStorage.setItem(RULES_RETURN_KEY,JSON.stringify({
        id:activeId,
        step:currentStep,
        preview:!previewView.hidden
      }));
    } catch {}
  }));
  document.getElementById('clear-button').addEventListener('click',()=>{
    if (!window.confirm('Limpar todos os dados desta ficha? Esta ação não pode ser desfeita.')) return;
    avatarRequest++;
    character = emptyCharacter();
    renderForm();
    showStep(0);
    saveCharacter();
    feedback.hidden = true;
    showFeedback('Ficha limpa. Você pode começar um novo personagem.');
  });
  showHome();
  loadLibrary();
  renderLibrary();
  let returnState;
  try {
    returnState = JSON.parse(sessionStorage.getItem(RULES_RETURN_KEY) || 'null');
    sessionStorage.removeItem(RULES_RETURN_KEY);
  } catch {}
  if (returnState?.id && characters.some(item => item.id === returnState.id)) {
    openCharacter(returnState.id,Number.isInteger(returnState.step) ? returnState.step : 0);
  }
  if (returnState?.preview && activeId) {
    renderPreview();
    editorView.hidden = true;
    previewView.hidden = false;
  }
})();
