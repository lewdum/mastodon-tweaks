"use strict";
(() => {
    let debug;
    async function inject() {
        if (!document.body.classList.contains('admin')) {
            return;
        }
        const settings = await browser.storage.local.get('debug');
        debug = settings['debug'];
        debugLog('Injecting Mastodon Tweaks...');
        const form = document.body.querySelector('#edit_user');
        if (form === null) {
            debugLog('Bailing, form not found.');
            return;
        }
        const save = form.querySelector('.actions');
        if (save === null) {
            debugLog('Bailing, save button not found.');
            return;
        }
        const header = document.createElement('h4');
        header.textContent = 'Mastodon Tweaks';
        const optionSidebarLeft = await createBoolOption('sidebarLeft', 'Move timeline sidebar to the left on smaller devices', false);
        const optionCustomToot = await createStringOption('customToot', 'Change the "Publish" label to a custom string, such as "Toot"', '');
        const optionDebug = await createBoolOption('debug', 'Print debug messages to the browser console', true);
        const hint = document.createElement('span');
        hint.className = 'hint';
        hint.textContent = ('Options in this section are automatically saved when modified. ' +
            'If nothing seems to be changing, you may need to do a hard refresh.');
        const group = document.createElement('div');
        group.className = 'fields-group';
        group.appendChild(optionCustomToot);
        group.appendChild(optionSidebarLeft);
        group.appendChild(optionDebug);
        group.appendChild(hint);
        form.insertBefore(header, save);
        form.insertBefore(group, save);
        debugLog('Injected Mastodon Tweaks.');
    }
    async function createBoolOption(id, description, defaultValue) {
        const data = await browser.storage.local.get(id);
        const value = data[id] ?? defaultValue;
        const mess = document.createElement('div');
        mess.className = 'input with_label boolean optional';
        mess.innerHTML = `
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
  `;
        const input = mess.querySelector('input');
        input.addEventListener('change', async () => {
            await browser.storage.local.set({
                [id]: input.checked
            });
        });
        return mess;
    }
    async function createStringOption(id, description, defaultValue) {
        const data = await browser.storage.local.get(id);
        const value = data[id] ?? defaultValue;
        const mess = document.createElement('div');
        mess.className = 'input with_label string optional';
        mess.innerHTML = `
    <div class="label_input">
      <label class="string optional" for="tweaks-${id}">
        ${description}
      </label>
      <div class="label_input__wrapper">
        <input
          id="tweaks-${id}"
          class="string optional"
          type="text"
          value="${value}">
      </div>
    </div>
  `;
        const input = mess.querySelector('input');
        input.addEventListener('change', async () => {
            await browser.storage.local.set({
                [id]: input.value.trim()
            });
        });
        return mess;
    }
    function debugLog(...args) {
        if (debug === false) {
            return;
        }
        console.log(...args);
    }
    inject();
})();
