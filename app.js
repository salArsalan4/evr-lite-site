;(function () {
  const repo = window.__EVR_GITHUB_REPO__
  const releasesPage = `https://github.com/${repo}/releases`
  const apiLatest = `https://api.github.com/repos/${repo}/releases/latest`

  const el = (id) => document.getElementById(id)

  function pickWindowsAsset(assets) {
    const list = assets || []
    const nsis = list.find((a) => /setup\.exe$/i.test(a.name))
    if (nsis) return nsis
    return list.find((a) => /\.exe$/i.test(a.name)) || null
  }

  function pickMacAsset(assets) {
    const list = assets || []
    return list.find((a) => /\.dmg$/i.test(a.name)) || null
  }

  function pickLinuxAsset(assets) {
    const list = assets || []
    return list.find((a) => /\.AppImage$/i.test(a.name)) || null
  }

  function setButton(btn, url, enabled) {
    if (!btn) return
    if (enabled && url) {
      btn.href = url
      btn.removeAttribute('aria-disabled')
      btn.classList.remove('is-disabled')
    } else {
      btn.href = releasesPage
      btn.setAttribute('aria-disabled', 'true')
      btn.classList.add('is-disabled')
    }
  }

  function showStatus(message, isError) {
    const s = el('release-status')
    if (!s) return
    s.textContent = message
    s.classList.toggle('is-error', Boolean(isError))
    s.hidden = false
  }

  async function loadLatest() {
    const winBtn = el('download-windows')
    const macBtn = el('download-mac')
    const linuxBtn = el('download-linux')
    const versionEl = el('release-version')

    if (!repo || typeof repo !== 'string' || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
      showStatus('Set window.__EVR_GITHUB_REPO__ in config.js to your owner/repo (e.g. you/evr_lite).', true)
      return
    }

    try {
      const res = await fetch(apiLatest, { headers: { Accept: 'application/vnd.github+json' } })
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'No releases yet. Publish one on GitHub.' : `GitHub API ${res.status}`)
      }
      const data = await res.json()
      const tag = data.tag_name || data.name || 'latest'
      if (versionEl) versionEl.textContent = tag

      const win = pickWindowsAsset(data.assets)
      const mac = pickMacAsset(data.assets)
      const linux = pickLinuxAsset(data.assets)

      setButton(winBtn, win?.browser_download_url, Boolean(win))
      setButton(macBtn, mac?.browser_download_url, Boolean(mac))
      setButton(linuxBtn, linux?.browser_download_url, Boolean(linux))

      const missing = []
      if (!win) missing.push('Windows (.exe)')
      if (!mac) missing.push('macOS (.dmg)')
      if (!linux) missing.push('Linux (.AppImage)')
      if (missing.length) {
        showStatus(
          `Latest is ${tag}. No attachment found for: ${missing.join(', ')}. Use “All releases” or upload matching files (see website/README).`,
          true
        )
      } else {
        showStatus(`Latest release: ${tag}`, false)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      showStatus(`Could not load latest release (${msg}). Open “All releases” below.`, true)
      setButton(winBtn, null, false)
      setButton(macBtn, null, false)
      setButton(linuxBtn, null, false)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLatest)
  } else {
    loadLatest()
  }
})()
