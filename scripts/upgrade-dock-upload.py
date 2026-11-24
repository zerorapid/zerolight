#!/usr/bin/env python3
import re

with open('dock-prototype.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add CSS for FileUpload Dropzone
dropzone_css = """
    /* ZERO LIGHT FILE UPLOAD DROPZONE */
    .zl-file-upload-dropzone {
      border: 1px dashed var(--border);
      border-radius: var(--radius);
      padding: 12px;
      text-align: center;
      background: var(--card-subtle);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transition: all var(--motion-speed) var(--motion-ease);
    }
    .zl-file-upload-dropzone:hover {
      border-color: var(--primary);
      background: rgba(79, 70, 229, 0.04);
    }
    .zl-upload-icon-circle {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: var(--secondary);
      color: var(--muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .zl-upload-primary {
      font-size: 11px;
      font-weight: 600;
      color: var(--foreground);
      display: block;
    }
    .zl-upload-sub {
      font-size: 10px;
      color: var(--muted);
      display: block;
    }
"""

if '.zl-file-upload-dropzone' not in text:
    text = text.replace('/* Individual Component Stying */', dropzone_css + '\n    /* Individual Component Stying */')

# 2. Replace the ugly <input type="file"> with ZeroLight FileUpload Dropzone
old_upload_html = """              <div class="form-group">
                <label class="form-label">Custom Logo Upload</label>
                <input type="file" id="customLogoUpload" accept="image/*" style="font-size:11px;" onchange="handleLogoUpload(this)">
              </div>"""

new_upload_html = """              <div class="form-group">
                <label class="form-label">Custom Brand Logo Upload</label>
                <input type="file" id="customLogoUpload" accept="image/*" style="display:none;" onchange="handleLogoUpload(this)">
                <div class="zl-file-upload-dropzone" onclick="document.getElementById('customLogoUpload').click()" id="logoDropZone">
                  <div class="zl-upload-icon-circle">
                    <iconify-icon icon="lucide:cloud-upload" style="font-size:18px;"></iconify-icon>
                  </div>
                  <div>
                    <span class="zl-upload-primary">Click to upload or drag &amp; drop</span>
                    <span class="zl-upload-sub">SVG, PNG, or JPG (Max 5MB)</span>
                  </div>
                </div>
                <div id="logoUploadedCard" style="display:none; align-items:center; justify-content:space-between; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius); background:var(--card-subtle);">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <img id="logoCardThumb" src="" style="width:24px; height:24px; object-fit:cover; border-radius:4px; border:1px solid var(--border);">
                    <div style="display:flex; flex-direction:column;">
                      <span style="font-size:11px; font-weight:600;" id="logoCardName">brand-logo.png</span>
                      <span style="font-size:10px; color:var(--success); font-weight:500;">&bull; Ready</span>
                    </div>
                  </div>
                  <button type="button" class="btn sm ghost" style="padding:2px 6px; height:22px;" onclick="removeUploadedLogo(event)">
                    <iconify-icon icon="lucide:x" style="font-size:12px;"></iconify-icon>
                  </button>
                </div>
              </div>"""

text = text.replace(old_upload_html, new_upload_html)

# 3. Update handleLogoUpload and add removeUploadedLogo
new_js_handlers = """    function handleLogoUpload(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          const imgUrl = e.target.result;
          ['heroMarkTile', 'logoPreviewMark1', 'logoPreviewMark2', 'logoPreviewMark3'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<img src="${imgUrl}" alt="Logo">`;
          });
          const dropZone = document.getElementById('logoDropZone');
          const uploadedCard = document.getElementById('logoUploadedCard');
          const thumb = document.getElementById('logoCardThumb');
          const nameEl = document.getElementById('logoCardName');
          if (dropZone) dropZone.style.display = 'none';
          if (uploadedCard) uploadedCard.style.display = 'flex';
          if (thumb) thumb.src = imgUrl;
          if (nameEl) nameEl.textContent = file.name;
          showToast('Custom logo uploaded & synced');
        };
        reader.readAsDataURL(file);
      }
    }

    function removeUploadedLogo(e) {
      if (e) e.stopPropagation();
      const input = document.getElementById('customLogoUpload');
      if (input) input.value = '';
      const dropZone = document.getElementById('logoDropZone');
      const uploadedCard = document.getElementById('logoUploadedCard');
      if (dropZone) dropZone.style.display = 'flex';
      if (uploadedCard) uploadedCard.style.display = 'none';
      ['heroMarkTile', 'logoPreviewMark1', 'logoPreviewMark2', 'logoPreviewMark3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = state.brandMark;
      });
      showToast('Uploaded logo removed');
    }"""

old_handle_logo = re.compile(r'function handleLogoUpload\(input\) \{.*?\n    \}', re.DOTALL)
text = old_handle_logo.sub(new_js_handlers, text, count=1)

with open('dock-prototype.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully upgraded Custom Logo Upload in dock-prototype.html!')
