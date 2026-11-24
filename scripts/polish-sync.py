with open('dock-prototype.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix font label synchronization
old_sync = """      const fontLabelEl = document.querySelector('#fontDropdown .dd-label');
      if (fontLabelEl) {
        const cleanFont = state.font.replace(/['",]/g, '').split(' ')[0] || 'Plus Jakarta Sans';
        fontLabelEl.textContent = cleanFont;
      }"""

new_sync = """      const fontItem = document.querySelector(`#fontDropdown .ui-dd-item[data-val="${state.font}"]`);
      if (fontItem) {
        document.querySelectorAll('#fontDropdown .ui-dd-item').forEach(b => b.classList.remove('active'));
        fontItem.classList.add('active');
        const fontLabelEl = document.querySelector('#fontDropdown .dd-label');
        if (fontLabelEl) fontLabelEl.textContent = fontItem.querySelector('span').textContent;
      }

      // Sync color swatch active states
      document.querySelectorAll('#accentSwatches .swatch-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.hex.toLowerCase() === state.primary.toLowerCase());
      });
      document.querySelectorAll('#iconColorSwatches .swatch-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.ic === state.iconColor);
      });
      document.querySelectorAll('#logoMarkGroup .seg-opt').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mark === state.brandMark);
      });"""

assert old_sync in html, "old_sync target not found"
html = html.replace(old_sync, new_sync)

with open('dock-prototype.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated bidirectional synchronization in dock-prototype.html successfully!")
