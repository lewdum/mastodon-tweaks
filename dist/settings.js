"use strict";
async function injectSettings() {
    console.log('Injecting Mastodon Tweaks...');
    const form = document.body.querySelector('#edit_user');
    if (form === null) {
        console.warn('Form not found.');
        return;
    }
    const save = form.querySelector('.actions');
    if (save === null) {
        console.warn('Save button not found.');
        return;
    }
    const header = document.createElement('h4');
    header.textContent = 'Mastodon Tweaks';
    const option1 = await createOption('sidebarLeft', 'Move timeline sidebar to the left in small devices.', false);
    const hint = document.createElement('span');
    hint.className = 'hint';
    hint.textContent = ('Options in this section are automatically saved when modified. ' +
        'If nothing seems to be changing, you may need to do a hard refresh.');
    form.insertBefore(header, save);
    form.insertBefore(hint, save);
    form.insertBefore(option1, save);
    console.log('Injected Mastodon Tweaks.');
}
async function createOption(id, description, defaultValue) {
    const data = await browser.storage.local.get(id);
    console.dir(data);
    const value = data[id] ?? defaultValue;
    const mess = document.createElement('div');
    mess.className = 'fields-group';
    mess.innerHTML = `
    <div class="input with_label boolean optional">
      <div class="label_input">
        <label class="boolean optional" for="tweaks-${id}">
          ${description}
        </label>
        <div class="label_input__wrapper">
          <label class="checkbox">
            <input
              id="tweaks-${id}"
              class="boolean optional"
              type="checkbox"
              ${value ? "checked" : ""}>
          </label>
        </div>
      </div>
    </div>
  `;
    const input = mess.querySelector('input');
    input.addEventListener('change', async () => {
        await browser.storage.local.set({
            [id]: input.checked
        });
    });
    return mess;
}
injectSettings();
