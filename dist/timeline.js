"use strict";
async function injectTimeline() {
    console.log('Injecting Mastodon Tweaks...');
    const { sidebarLeft, } = await browser.storage.local.get([
        'sidebarLeft'
    ]);
    if (sidebarLeft) {
        const style = document.createElement('style');
        style.textContent = `
      @media only screen and (max-width: 1174px) {
        .columns-area__panels__pane--navigational {
          order: -1;
        }
        .columns-area__panels__pane--navigational .navigation-panel {
          border-left: none;
          border-right: 1px solid #393f4f;
        }
      }
    `;
        document.head.appendChild(style);
    }
    console.log('Injected Mastodon Tweaks.');
}
injectTimeline();
