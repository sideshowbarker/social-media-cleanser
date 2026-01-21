// Platform groups - maps user-friendly names to arrays of domains
const PLATFORM_GROUPS = {
  'Twitter / X': ['twitter.com', 'x.com'],
  'Facebook': ['facebook.com', 'fb.com', 'fb.me'],
  'Instagram': ['instagram.com', 'instagr.am'],
  'LinkedIn': ['linkedin.com', 'lnkd.in'],
  'YouTube': ['youtube.com', 'youtu.be'],
  'TikTok': ['tiktok.com'],
  'Snapchat': ['snapchat.com'],
  'Pinterest': ['pinterest.com', 'pin.it'],
  'Reddit': ['reddit.com', 'redd.it'],
  'Tumblr': ['tumblr.com'],
  'WhatsApp': ['whatsapp.com', 'wa.me'],
  'Telegram': ['telegram.org', 't.me'],
  'Discord': ['discord.com', 'discord.gg'],
  'Twitch': ['twitch.tv'],
  'Mastodon': ['mastodon.social', 'mastodon.online', 'mstdn.social', 'fosstodon.org', 'hachyderm.io', 'infosec.exchange'],
  'Bluesky': ['bsky.app', 'bsky.social'],
  'Threads': ['threads.net'],
  'Fediverse (Other)': ['post.news', 'cohost.org', 'pixelfed.social', 'lemmy.world', 'lemmy.ml', 'kbin.social'],
  'Chinese Platforms': ['weibo.com', 'weibo.cn', 'qq.com', 'wechat.com'],
  'Russian Platforms': ['vk.com', 'ok.ru'],
  'Messaging': ['line.me'],
  'Professional': ['xing.com'],
  'Alt Platforms': ['clubhouse.com', 'parler.com', 'gab.com', 'truthsocial.com', 'gettr.com', 'minds.com', 'mewe.com'],
  'Creative': ['flickr.com', 'deviantart.com', 'behance.net', 'dribbble.com'],
  'Publishing': ['medium.com', 'substack.com'],
  'Funding': ['patreon.com', 'ko-fi.com', 'buymeacoffee.com'],
  'Link Aggregators': ['linktree.com', 'linktr.ee', 'beacons.ai', 'carrd.co', 'about.me']
};

let currentHostname = null;

// Load settings and render UI
async function init() {
  const { allowedPlatforms = [], disabledSites = [], globalEnabled = true } = await chrome.storage.sync.get(['allowedPlatforms', 'disabledSites', 'globalEnabled']);
  renderPlatformList(allowedPlatforms);

  // Set up global toggle (unchecked = ON/left, checked = OFF/right)
  const globalCheckbox = document.getElementById('globalEnabled');
  globalCheckbox.checked = !globalEnabled;
  updateGlobalState(globalEnabled);
  globalCheckbox.addEventListener('change', () => toggleGlobal(!globalCheckbox.checked));

  // Get current tab and set up site toggle
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      currentHostname = url.hostname.replace(/^www\./, '');
      document.getElementById('siteName').textContent = currentHostname;

      const isDisabled = disabledSites.includes(currentHostname);
      const siteCheckbox = document.getElementById('siteEnabled');
      siteCheckbox.checked = isDisabled;
      updateSiteStatus(isDisabled);

      siteCheckbox.addEventListener('change', () => toggleSite(siteCheckbox.checked));
    } else {
      document.getElementById('siteName').textContent = 'N/A';
      document.getElementById('siteToggle').style.display = 'none';
    }
  } catch (e) {
    document.getElementById('siteName').textContent = 'N/A';
    document.getElementById('siteToggle').style.display = 'none';
  }
}

function updateSiteStatus(isDisabled) {
  const statusEl = document.getElementById('siteStatus');
  if (isDisabled) {
    statusEl.textContent = 'Disabled';
    statusEl.className = 'site-status site-disabled';
    document.body.classList.add('site-off');
  } else {
    statusEl.textContent = 'Enabled';
    statusEl.className = 'site-status site-enabled';
    document.body.classList.remove('site-off');
  }
}

async function toggleSite(isDisabled) {
  if (!currentHostname) return;

  const { disabledSites = [] } = await chrome.storage.sync.get('disabledSites');

  let updated;
  if (isDisabled) {
    if (!disabledSites.includes(currentHostname)) {
      updated = [...disabledSites, currentHostname];
    } else {
      updated = disabledSites;
    }
  } else {
    updated = disabledSites.filter(s => s !== currentHostname);
  }

  await chrome.storage.sync.set({ disabledSites: updated });
  updateSiteStatus(isDisabled);
}

function updateGlobalState(isEnabled) {
  if (isEnabled) {
    document.body.classList.remove('extension-off');
  } else {
    document.body.classList.add('extension-off');
  }
}

async function toggleGlobal(isEnabled) {
  await chrome.storage.sync.set({ globalEnabled: isEnabled });
  updateGlobalState(isEnabled);
}

function renderPlatformList(allowedPlatforms) {
  const container = document.getElementById('platformList');
  container.innerHTML = '';

  for (const [name, domains] of Object.entries(PLATFORM_GROUPS)) {
    const isAllowed = allowedPlatforms.includes(name);

    const item = document.createElement('div');
    item.className = 'platform-item';

    const info = document.createElement('div');
    info.className = 'platform-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'platform-name';
    nameEl.textContent = name;

    const domainsEl = document.createElement('div');
    domainsEl.className = 'platform-domains';
    domainsEl.textContent = domains.join(', ');

    info.appendChild(nameEl);
    info.appendChild(domainsEl);

    const toggleWrapper = document.createElement('div');
    toggleWrapper.className = 'toggle-wrapper';

    const toggle = document.createElement('label');
    toggle.className = 'toggle';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isAllowed;
    checkbox.addEventListener('change', () => togglePlatform(name, checkbox.checked));

    const slider = document.createElement('span');
    slider.className = 'slider';

    toggle.appendChild(checkbox);
    toggle.appendChild(slider);

    const statusText = document.createElement('div');
    statusText.className = `status-text ${isAllowed ? 'status-allowed' : 'status-cleansed'}`;
    statusText.textContent = isAllowed ? 'Allowed' : 'Cleansed';
    statusText.id = `status-${name.replace(/[^a-zA-Z]/g, '')}`;

    toggleWrapper.appendChild(toggle);
    toggleWrapper.appendChild(statusText);

    item.appendChild(info);
    item.appendChild(toggleWrapper);
    container.appendChild(item);
  }
}

async function togglePlatform(platformName, isAllowed) {
  const { allowedPlatforms = [] } = await chrome.storage.sync.get('allowedPlatforms');

  let updated;
  if (isAllowed) {
    if (!allowedPlatforms.includes(platformName)) {
      updated = [...allowedPlatforms, platformName];
    } else {
      updated = allowedPlatforms;
    }
  } else {
    updated = allowedPlatforms.filter(p => p !== platformName);
  }

  await chrome.storage.sync.set({ allowedPlatforms: updated });

  // Update status text
  const statusEl = document.getElementById(`status-${platformName.replace(/[^a-zA-Z]/g, '')}`);
  if (statusEl) {
    statusEl.textContent = isAllowed ? 'Allowed' : 'Cleansed';
    statusEl.className = `status-text ${isAllowed ? 'status-allowed' : 'status-cleansed'}`;
  }
}

init();
