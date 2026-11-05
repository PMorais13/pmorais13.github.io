(() => {
  'use strict';

  const NAVY = [22, 42, 67];
  const CYAN = [29, 148, 168];
  const MUTED = [91, 112, 130];
  const PALE = [225, 238, 243];
  const MARGIN = 17;
  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const BOTTOM = PAGE_HEIGHT - 21;

  function filenameFor(name) {
    const slug = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 65);
    return `tiny-frontiers-${slug || 'personagem'}.pdf`;
  }

  function generateCharacterPdf(data, role) {
    const JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) throw new Error('jsPDF não carregado');
    const doc = new JsPDF({orientation: 'portrait', unit: 'mm', format: 'a4', compress: true});
    let y = 0;
    let pageNumber = 0;

    function newPage() {
      if (pageNumber) doc.addPage();
      pageNumber += 1;
      doc.setFillColor(250, 252, 254);
      doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');
      doc.setFillColor(...NAVY);
      doc.rect(0, 0, PAGE_WIDTH, 15, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text('EXPLORADORES  /  TINY FRONTIERS', MARGIN, 9.4);
      doc.setFillColor(...CYAN);
      doc.rect(PAGE_WIDTH - MARGIN - 14, 14.2, 14, 1.5, 'F');
      y = 23;
    }
    function ensure(height) { if (y + height > BOTTOM) newPage(); }
    function textLines(value, width, size, bold = false) {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      return doc.splitTextToSize(String(value), width);
    }
    function printLines(value, x, width, size = 10, leading = 4.9, bold = false, color = NAVY) {
      const lines = textLines(value, width, size, bold);
      for (const line of lines) {
        ensure(leading + 1);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(line || ' ', x, y);
        y += leading;
      }
    }
    function section(title) {
      ensure(18);
      y += 5;
      doc.setDrawColor(...PALE);
      doc.setLineWidth(.3);
      doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...CYAN);
      doc.text(title.toUpperCase(), MARGIN, y);
      y += 7;
    }
    function field(label, value) {
      if (value === undefined || value === null || !String(value).trim()) return;
      ensure(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.6);
      doc.setTextColor(...MUTED);
      doc.text(label.toUpperCase(), MARGIN, y);
      y += 5;
      printLines(String(value).trim(), MARGIN, CONTENT_WIDTH);
      y += 3;
    }
    function pair(leftLabel, leftValue, rightLabel, rightValue) {
      if (!String(leftValue || '').trim() && !String(rightValue || '').trim()) return;
      if (!String(leftValue || '').trim()) { field(rightLabel, rightValue); return; }
      if (!String(rightValue || '').trim()) { field(leftLabel, leftValue); return; }
      const half = (CONTENT_WIDTH - 9) / 2;
      const left = String(leftValue || '').trim();
      const right = String(rightValue || '').trim();
      const leftLines = left ? textLines(left, half, 10) : [];
      const rightLines = right ? textLines(right, half, 10) : [];
      const height = 5 + Math.max(leftLines.length, rightLines.length) * 4.9 + 5;
      if (height > BOTTOM - 23) { field(leftLabel, left); field(rightLabel, right); return; }
      ensure(height);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.6);
      doc.setTextColor(...MUTED);
      if (left) doc.text(leftLabel.toUpperCase(), MARGIN, y);
      if (right) doc.text(rightLabel.toUpperCase(), MARGIN + half + 9, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      leftLines.forEach((line, index) => doc.text(line, MARGIN, y + index * 4.9));
      rightLines.forEach((line, index) => doc.text(line, MARGIN + half + 9, y + index * 4.9));
      y += Math.max(leftLines.length, rightLines.length) * 4.9 + 5;
    }
    function list(label, values) {
      const items = values.filter(value => String(value || '').trim());
      if (!items.length) return;
      section(label);
      items.forEach((item, index) => {
        ensure(12);
        doc.setFillColor(...CYAN);
        doc.circle(MARGIN + 1, y - 1, .75, 'F');
        const start = y;
        printLines(String(item).trim(), MARGIN + 5, CONTENT_WIDTH - 5, 9.5, 4.8);
        y = Math.max(y, start + 4.8);
        if (index < items.length - 1) y += 2;
      });
    }

    newPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(...CYAN);
    doc.text('FICHA DE PERSONAGEM', MARGIN, y);
    y += 8;
    printLines(data.name.trim(), MARGIN, CONTENT_WIDTH, 21, 9, true);
    y += 1;
    const subtitle = [data.heritage, role].map(value => String(value || '').trim()).filter(Boolean).join('   /   ');
    if (subtitle) printLines(subtitle, MARGIN, CONTENT_WIDTH, 9.5, 5, false, MUTED);

    section('Identidade');
    pair('Herança / Espécie', data.heritage, 'Função na tripulação', role);
    pair('Planeta natal', data.homeworld, 'Idade', data.age);
    field('Gênero', data.gender);
    field('Aparência física', data.appearance);
    field('Breve descrição', data.description);

    if (data.heritageTrait || data.hpBase || data.hpMax || data.hpCurrent || [1,2,3,4,5].some(i => data[`trait${i}Name`] || data[`trait${i}Description`])) {
      section('Herança e características');
      field('Característica da Herança / Heritage Trait', data.heritageTrait);
      pair('Vida base', data.hpBase, 'Vida máxima', data.hpMax);
      field('Vida atual', data.hpCurrent);
      field('Proteção da armadura', data.armorHp);
      [1,2,3,4,5].forEach(i => {
        const name = data[`trait${i}Name`];
        const description = data[`trait${i}Description`];
        if (name || description) {
          field(`Característica ${i}`, name);
          field(`Descrição da característica ${i}`, description);
        }
      });
    }

    const combat = data.proficiencies.length || data.masteredWeapons.some(Boolean) || data.equippedWeapon || data.armor || data.otherEquipment || data.credits;
    if (combat) {
      section('Combate e equipamentos');
      field('Proficiências com armas', data.proficiencies.join(', '));
      field('Armas dominadas', data.masteredWeapons.filter(Boolean).join(', '));
      pair('Arma equipada', data.equippedWeapon, 'Armadura ou vestimenta', data.armorDisplay);
      field('Regras da arma inicial', data.weaponInfo);
      field('Escudo / Esquiva', data.shieldRule);
      field('Outros equipamentos', data.otherEquipment);
      field('GalCreds / Créditos', data.credits);
    }
    list('Kit do Explorador', data.explorersKit || []);
    list('Equipamento adicional inicial', data.startingEquipment || []);
    list('Inventário', data.inventory.filter(item => item.name.trim()).map(item => [item.name.trim(), item.quantity !== '' ? `Qtd. ${item.quantity}` : '', item.depletion !== '' ? `Esgotamento ${item.depletion}/6` : ''].filter(Boolean).join('  |  ')));

    if (data.familyTrade || data.belief || data.goal || data.history || data.notes) {
      section('História e personalidade');
      field('Ofício / Especialidade', data.familyTrade);
      field('Benefício do ofício', data.tradeBenefit);
      field('Crença principal', data.belief);
      field('Objetivo pessoal', data.goal);
      field('História resumida', data.history);
      field('Anotações adicionais', data.notes);
    }

    for (let page = 1; page <= doc.getNumberOfPages(); page++) {
      doc.setPage(page);
      doc.setDrawColor(...PALE);
      doc.line(MARGIN, PAGE_HEIGHT - 15, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      doc.text('TINY FRONTIERS: REVISED  ·  FICHA DE EXPLORADOR', MARGIN, PAGE_HEIGHT - 10);
      doc.text(`${page} / ${doc.getNumberOfPages()}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 10, {align: 'right'});
    }
    doc.save(filenameFor(data.name));
  }

  window.generateCharacterPdf = generateCharacterPdf;
})();
