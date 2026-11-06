(() => {
  'use strict';

  const W = 210, H = 297, L = 16, R = 194, CW = 178, BOTTOM = 278;
  const VOID = [13, 20, 30], INK = [29, 38, 43], RUST = [174, 83, 47];
  const CYAN = [66, 137, 145], BONE = [246, 242, 232], PALE = [235, 230, 217];
  const MUTED = [92, 104, 105], WHITE = [255, 255, 255];

  function filenameFor(name) {
    const slug = String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 65);
    return 'tiny-frontiers-' + (slug || 'personagem') + '.pdf';
  }

  function generateCharacterPdf(data, role) {
    const JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) throw new Error('jsPDF não carregado');
    const doc = new JsPDF({orientation: 'portrait', unit: 'mm', format: 'a4', compress: true});
    const name = String(data.name || 'EXPLORADOR SEM NOME').trim();
    let page = 0, y = 0;

    function fill(x, top, width, height, color) {
      doc.setFillColor(...color);
      doc.rect(x, top, width, height, 'F');
    }
    function rule(x1, top1, x2, top2, color = MUTED, width = .3) {
      doc.setDrawColor(...color);
      doc.setLineWidth(width);
      doc.line(x1, top1, x2, top2);
    }
    function write(value, x, top, size = 9, color = INK, weight = 'normal', options, font = 'helvetica') {
      doc.setFont(font, weight);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.text(String(value), x, top, options);
    }
    function wrap(value, width, size = 9, weight = 'normal') {
      doc.setFont('helvetica', weight);
      doc.setFontSize(size);
      return doc.splitTextToSize(String(value ?? '').trim(), width);
    }
    function starfield(x, top, width, height, count) {
      for (let i = 0; i < count; i++) {
        const sx = x + ((i * 47 + 17) % 97) / 97 * width;
        const sy = top + ((i * 31 + 9) % 89) / 89 * height;
        fill(sx, sy, i % 9 === 0 ? .5 : .22, i % 9 === 0 ? .5 : .22, [143, 164, 162]);
      }
    }
    function newPage() {
      if (page) doc.addPage();
      page++;
      fill(0, 0, W, H, BONE);
      fill(0, 0, W, 18, VOID);
      starfield(0, 0, W, 18, 25);
      fill(0, 0, 4.5, H, VOID);
      fill(4.5, 0, 1.2, H, RUST);
      write('TINY FRONTIERS: REVISED', L, 11.5, 8.5, WHITE, 'bold');
      write('PERSONAGEM  /  ' + String(page).padStart(2, '0'), R, 11.5, 7.4, [171, 200, 198], 'bold', {align: 'right'}, 'courier');
      y = 27;
    }
    function ensure(height) {
      if (y + height > BOTTOM) newPage();
    }
    function section(number, title, reserve = 20) {
      ensure(reserve + 13);
      y += 3;
      fill(L, y, CW, 9.8, VOID);
      fill(L, y, 2.5, 9.8, RUST);
      write(number, L + 7, y + 6.5, 8, [226, 157, 112], 'bold', undefined, 'courier');
      write(title.toUpperCase(), L + 19, y + 6.5, 9.6, WHITE, 'bold');
      rule(R - 20, y + 4.9, R - 5, y + 4.9, CYAN, .7);
      y += 13;
    }
    function entry(label, value) {
      const text = String(value ?? '').trim();
      if (!text) return;
      const content = wrap(text, CW - 12, 9);
      let offset = 0;
      while (offset < content.length) {
        ensure(16);
        const limit = Math.max(1, Math.floor((BOTTOM - y - 10) / 4.5));
        const chunk = content.slice(offset, offset + limit);
        const height = 9 + chunk.length * 4.5;
        fill(L, y, 1.4, height - 2, CYAN);
        write(offset ? label.toUpperCase() + ' / CONT.' : label.toUpperCase(), L + 5, y + 4.4, 7.1, RUST, 'bold', undefined, 'courier');
        chunk.forEach((line, i) => write(line, L + 5, y + 9 + i * 4.5, 9));
        rule(L + 5, y + height - 1, R, y + height - 1, [184, 185, 172], .25);
        y += height + 2;
        offset += chunk.length;
      }
    }
    function pair(leftLabel, leftValue, rightLabel, rightValue) {
      const left = String(leftValue ?? '').trim(), right = String(rightValue ?? '').trim();
      if (!left && !right) return;
      if (!left) return entry(rightLabel, right);
      if (!right) return entry(leftLabel, left);
      const half = 86, a = wrap(left, half - 6, 9), b = wrap(right, half - 6, 9);
      if (Math.max(a.length, b.length) > 5) {
        entry(leftLabel, left);
        entry(rightLabel, right);
        return;
      }
      const height = 9 + Math.max(a.length, b.length) * 4.5;
      ensure(height + 2);
      [[L, leftLabel, a], [L + 92, rightLabel, b]].forEach(([x, label, content]) => {
        write(label.toUpperCase(), x, y + 4.4, 7.1, RUST, 'bold', undefined, 'courier');
        content.forEach((line, i) => write(line, x, y + 9 + i * 4.5, 9));
        rule(x, y + height - 1, x + half, y + height - 1, [184, 185, 172], .25);
      });
      y += height + 2;
    }
    function portrait() {
      fill(136, 31, 54, 82, [225, 220, 205]);
      rule(136, 31, 190, 31, RUST, .8);
      rule(136, 113, 190, 113, RUST, .8);
      rule(136, 31, 136, 113, RUST, .8);
      rule(190, 31, 190, 113, RUST, .8);
      const image = data.portrait;
      if (image && (typeof image === 'string' || image.naturalWidth > 0)) {
        try {
          const properties = doc.getImageProperties(image);
          const ratio = properties.width / properties.height;
          let width = 52, height = width / ratio;
          if (height > 73) { height = 73; width = height * ratio; }
          const format = typeof image === 'string' && image.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
          doc.addImage(image, format, 163 - width / 2, 34 + (73 - height) / 2, width, height);
        } catch (error) {
          // The sheet remains exportable if a browser has not finished loading the portrait.
        }
      } else {
        fill(140, 37, 46, 66, VOID);
        starfield(140, 37, 46, 66, 30);
        doc.setDrawColor(...[154, 187, 182]);
        doc.setLineWidth(.5);
        doc.circle(163, 73, 13, 'S');
        rule(144, 73, 182, 73, [154, 187, 182], .5);
        rule(163, 47, 163, 99, [154, 187, 182], .5);
      }
      fill(136, 103, 54, 10, VOID);
      const species = wrap(data.heritage || 'ORIGEM DESCONHECIDA', 48, 7.5, 'bold')[0];
      write(species.toUpperCase(), 163, 109.4, 7.5, WHITE, 'bold', {align: 'center'});
      // The corner marks give the portrait the feel of a scanned character illustration.
      rule(139, 34, 146, 34, RUST, .5);
      rule(139, 34, 139, 41, RUST, .5);
      rule(187, 34, 180, 34, RUST, .5);
      rule(187, 34, 187, 41, RUST, .5);
    }
    function hero() {
      newPage();
      fill(L, 27, CW, 90, VOID);
      starfield(L, 27, 117, 90, 35);
      fill(L, 27, 2.8, 90, RUST);
      write('FICHA DE EXPLORADOR  //  001', 22, 37, 7.8, [164, 196, 192], 'bold', undefined, 'courier');
      let size = 20, nameLines = wrap(name, 105, size, 'bold');
      while (nameLines.length > 2 && size > 9) { size--; nameLines = wrap(name, 105, size, 'bold'); }
      nameLines.slice(0, 3).forEach((line, i) => write(line, 22, 49 + i * 7, size, WHITE, 'bold'));
      const detailY = Math.max(62, 49 + nameLines.length * 7);
      write('ESPÉCIE', 22, detailY, 7, [175, 197, 191], 'bold', undefined, 'courier');
      write(data.heritage || '—', 22, detailY + 6, 10.2, WHITE, 'bold');
      write('FUNÇÃO', 22, detailY + 14, 7, [175, 197, 191], 'bold', undefined, 'courier');
      write(role || '—', 22, detailY + 20, 9.4, WHITE);
      rule(22, 88, 129, 88, [105, 128, 126], .4);
      const current = Number(data.hpCurrent), maximum = Number(data.hpMax);
      write('PONTOS DE VIDA', 22, 95, 7, [175, 197, 191], 'bold', undefined, 'courier');
      write((data.hpCurrent ?? '—') + ' / ' + (data.hpMax ?? '—'), 22, 108, 17, WHITE, 'bold');
      if (Number.isInteger(maximum) && maximum > 0 && maximum <= 16) {
        for (let i = 0; i < maximum; i++) {
          doc.setDrawColor(...[232, 149, 95]);
          doc.setLineWidth(.65);
          if (i < current) doc.setFillColor(...RUST);
          doc.circle(61 + i * 4.25, 104, 1.35, i < current ? 'FD' : 'S');
        }
      }
      write('ARMADURA  ' + (data.armorHp ?? '—'), 22, 114, 7.3, [175, 197, 191], 'bold', undefined, 'courier');
      write('GALCREDS  ' + (data.credits ?? '—'), 81, 114, 7.3, [175, 197, 191], 'bold', undefined, 'courier');
      portrait();
      y = 124;
    }
    function traits() {
      const items = [1, 2, 3, 4, 5].map(i => ({
        number: i, name: String(data['trait' + i + 'Name'] || '').trim(),
        detail: String(data['trait' + i + 'Description'] || '').trim()
      })).filter(item => item.name || item.detail);
      if (!items.length) return;
      section('02', 'Talentos & características', 20);
      items.forEach(item => {
        const content = wrap(item.detail, CW - 24, 8.6);
        let offset = 0;
        do {
          ensure(16);
          const limit = Math.max(1, Math.floor((BOTTOM - y - 13) / 4.1));
          const chunk = content.slice(offset, offset + limit);
          const height = 11 + chunk.length * 4.1;
          fill(L, y, CW, height, PALE);
          fill(L, y, 9, height, RUST);
          write(String(item.number).padStart(2, '0'), L + 4.5, y + 7.5, 8, WHITE, 'bold', {align: 'center'}, 'courier');
          write(item.name || 'CARACTERÍSTICA', L + 13, y + 6.5, 9.4, INK, 'bold');
          chunk.forEach((line, i) => write(line, L + 13, y + 11.5 + i * 4.1, 8.6));
          y += height + 2;
          offset += chunk.length;
        } while (offset < content.length);
      });
    }
    function weapon() {
      const weaponName = String(data.equippedWeapon || '').trim();
      const detail = String(data.weaponInfo || '').trim();
      if (!weaponName && !detail) return;
      const content = wrap(detail, CW - 14, 8.6);
      const height = 21 + content.length * 4.3;
      if (height > BOTTOM - 27) {
        entry('Arma equipada', weaponName);
        entry('Regras da arma', detail);
        return;
      }
      ensure(height + 3);
      fill(L, y, CW, height, VOID);
      fill(L, y, 3, height, RUST);
      starfield(L + 95, y, 80, height, 20);
      write('ARMA EQUIPADA  /  SISTEMA DE COMBATE', L + 7, y + 7, 7.2, [168, 198, 194], 'bold', undefined, 'courier');
      write(weaponName || 'SEM ARMA', L + 7, y + 15, 14, WHITE, 'bold');
      rule(L + 7, y + 18, R - 7, y + 18, RUST, .65);
      content.forEach((line, i) => write(line, L + 7, y + 23 + i * 4.3, 8.6, [231, 234, 225]));
      y += height + 3;
    }
    function list(number, title, values) {
      const items = values.filter(value => String(value || '').trim()).map(String);
      if (!items.length) return;
      section(number, title, 16);
      for (let i = 0; i < items.length; i += 2) {
        const row = items.slice(i, i + 2).map(item => wrap(item, 77, 8.6));
        const height = 4 + Math.max(...row.map(lines => lines.length)) * 4.2;
        ensure(height + 1);
        row.forEach((content, j) => {
          const x = L + j * 92;
          fill(x, y + 3, 2.2, 2.2, RUST);
          content.forEach((line, k) => write(line, x + 6, y + 6 + k * 4.2, 8.6));
          rule(x, y + height - .5, x + 86, y + height - .5, [190, 188, 174], .2);
        });
        y += height + 1;
      }
    }
    function tabletopSpace() {
      if (BOTTOM - y < 40) return;
      section('07', 'Diário de bordo', 24);
      const height = BOTTOM - y;
      fill(L, y, CW, height, [252, 250, 244]);
      rule(L, y, R, y, RUST, .6);
      write('MISSÕES  /  FERIMENTOS  /  PISTAS', L + 4, y + 6, 7.2, RUST, 'bold', undefined, 'courier');
      for (let lineY = y + 14; lineY < BOTTOM - 4; lineY += 7) {
        rule(L + 4, lineY, R - 4, lineY, [194, 195, 181], .25);
      }
    }

    hero();
    section('01', 'Origem & identidade', 18);
    pair('Planeta natal', data.homeworld, 'Idade', data.age);
    pair('Gênero', data.gender, 'Ofício / especialidade', data.familyTrade);
    entry('Característica da herança', data.heritageTrait);
    entry('Aparência', data.appearance);
    entry('Perfil', data.description);
    traits();

    if (page === 1 && BOTTOM - y > 15) {
      fill(L, y + 1, CW, 12.5, VOID);
      write('TESTE  2d6', L + 5, y + 8.8, 8, WHITE, 'bold', undefined, 'courier');
      write('VANTAGEM  3d6', L + 61, y + 8.8, 8, [226, 157, 112], 'bold', undefined, 'courier');
      write('DESVANTAGEM  1d6', R - 5, y + 8.8, 8, WHITE, 'bold', {align: 'right'}, 'courier');
    }

    if (page === 1) newPage();
    else ensure(32);
    write('ARSENAL & SUPRIMENTOS', L, y + 6, 18, INK, 'bold');
    write(name.toUpperCase(), R, y + 6, 7.5, RUST, 'bold', {align: 'right'}, 'courier');
    y += 16;
    const hasCombat = [data.equippedWeapon, data.weaponInfo, data.proficiencies?.length,
      data.masteredWeapons?.some(Boolean), data.armorDisplay, data.shieldRule, data.otherEquipment].some(Boolean);
    if (hasCombat) {
      section('03', 'Combate', 28);
      weapon();
      pair('Proficiências', (data.proficiencies || []).join(', '), 'Armas dominadas', (data.masteredWeapons || []).filter(Boolean).join(', '));
      pair('Armadura / vestimenta', data.armorDisplay, 'Escudo / esquiva', data.shieldRule);
      entry('Outros equipamentos', data.otherEquipment);
    }
    list('04', 'Kit do explorador', data.explorersKit || []);
    list('05', 'Equipamento & inventário', [
      ...(data.startingEquipment || []),
      ...(data.inventory || []).filter(item => item.name?.trim()).map(item =>
        [item.name.trim(), item.quantity !== '' ? 'Qtd. ' + item.quantity : '',
          item.depletion !== '' ? 'Esg. ' + item.depletion + '/6' : ''].filter(Boolean).join('  /  '))
    ]);
    if ([data.tradeBenefit, data.belief, data.goal, data.history, data.notes].some(value => String(value || '').trim())) {
      section('06', 'História & motivações', 18);
      entry('Benefício do ofício', data.tradeBenefit);
      pair('Crença', data.belief, 'Objetivo', data.goal);
      entry('História', data.history);
      entry('Anotações', data.notes);
    }
    tabletopSpace();

    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      rule(L, 284, R, 284, VOID, .5);
      write('EXPLORADORES  //  TINY FRONTIERS', L, 290, 7.3, INK, 'bold', undefined, 'courier');
      write(String(p).padStart(2, '0') + ' / ' + String(pages).padStart(2, '0'), R, 290, 7.3, RUST, 'bold', {align: 'right'}, 'courier');
    }
    doc.save(filenameFor(name));
  }

  window.generateCharacterPdf = generateCharacterPdf;
})();
