(() => {

  let debug: boolean | undefined
  let customToot: string | undefined

  const pageObserver = new MutationObserver(updateHooks)

  const tootObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      updateToot(mutation.target)
    })
  })

  async function inject() {
    if (document.body.querySelector('#mastodon') === null) {
      return
    }

    const settings = await browser.storage.local.get([
      'debug',
      'sidebarLeft',
      'customToot'
    ]) as {
      debug: boolean | undefined,
      sidebarLeft: boolean | undefined,
      customToot: string | undefined,
    }

    debug = settings.debug

    debugLog('Injecting Mastodon Tweaks...')

    if (settings.sidebarLeft) {
      const style = document.createElement('style')
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
    `
      document.head.appendChild(style)
    }

    customToot = settings.customToot

    pageObserver.observe(document.body, {
      childList: true,
      subtree: true
    })

    debugLog('Injected Mastodon Tweaks.')
  }

  function updateHooks() {
    debugLog('Updating Mastodon Tweaks hooks...')

    tootObserver.disconnect()

    const publishButtons = [
      document.body.querySelector('.compose-form__publish-button-wrapper > button'),
      document.body.querySelector('.ui__header__links a[href="/publish"] span')
    ]
    publishButtons.forEach(btn => {
      if (btn === null) {
        return
      }
      updateToot(btn)
      tootObserver.observe(btn, {
        characterData: true,
        subtree: true
      })
    })
  }

  function updateToot(btn: Node): void {
    if (customToot === undefined || customToot === '') {
      return
    }

    if (btn.textContent === 'Publish') {
      btn.textContent = customToot
    } else if (btn.textContent === 'Publish!') {
      btn.textContent = `${customToot}!`
    }
  }

  function debugLog(...args: any): void {
    if (debug === false) {
      return
    }

    console.log(...args)
  }

  inject()

})()
