// Platform groups - must match popup.js
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

// Build list of domains to block based on allowed platforms
function getCleansedDomains(allowedPlatforms) {
  const cleansed = [];
  for (const [name, domains] of Object.entries(PLATFORM_GROUPS)) {
    if (!allowedPlatforms.includes(name)) {
      cleansed.push(...domains);
    }
  }
  return cleansed;
}

// Common social media icon class patterns
const ICON_CLASS_PATTERNS = [
  /\bfa-(?:twitter|x-twitter|facebook|instagram|linkedin|tiktok|youtube|snapchat|pinterest|reddit|tumblr|whatsapp|telegram|discord|twitch|mastodon|threads)\b/i,
  /\bicon-(?:twitter|x|facebook|instagram|linkedin|tiktok|youtube|snapchat|pinterest|reddit|tumblr|whatsapp|telegram|discord|twitch|mastodon|threads|social)\b/i,
  /\bsocial-icon\b/i,
  /\bshare-(?:twitter|facebook|linkedin|pinterest|reddit|whatsapp|telegram)\b/i,
  /\btwitter-icon\b/i,
  /\bfacebook-icon\b/i,
  /\binstagram-icon\b/i,
  /\blinkedin-icon\b/i,
  /\byoutube-icon\b/i,
  /\btiktok-icon\b/i,
  /\bmastodon-icon\b/i,
  /\bbluesky-icon\b/i,
  /\bthreads-icon\b/i,
];

// SVG title/aria-label patterns
const SVG_LABEL_PATTERNS = [
  /twitter/i,
  /facebook/i,
  /instagram/i,
  /linkedin/i,
  /youtube/i,
  /tiktok/i,
  /snapchat/i,
  /pinterest/i,
  /reddit/i,
  /tumblr/i,
  /whatsapp/i,
  /telegram/i,
  /discord/i,
  /twitch/i,
  /mastodon/i,
  /bluesky/i,
  /threads/i,
  /x\.com/i,
];

// Map platform name patterns to PLATFORM_GROUPS keys for icon filtering
const ICON_TO_PLATFORM = {
  'twitter': 'Twitter / X',
  'x-twitter': 'Twitter / X',
  'x.com': 'Twitter / X',
  'facebook': 'Facebook',
  'instagram': 'Instagram',
  'linkedin': 'LinkedIn',
  'youtube': 'YouTube',
  'tiktok': 'TikTok',
  'snapchat': 'Snapchat',
  'pinterest': 'Pinterest',
  'reddit': 'Reddit',
  'tumblr': 'Tumblr',
  'whatsapp': 'WhatsApp',
  'telegram': 'Telegram',
  'discord': 'Discord',
  'twitch': 'Twitch',
  'mastodon': 'Mastodon',
  'bluesky': 'Bluesky',
  'threads': 'Threads',
};

function isSocialMediaUrl(url, cleansedDomains) {
  if (!url) return false;
  try {
    const urlObj = new URL(url, window.location.href);
    const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
    return cleansedDomains.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

function hasMatchingClass(element, patterns) {
  const className = element.className;
  if (typeof className !== 'string') return false;
  return patterns.some(pattern => pattern.test(className));
}

function getMatchingPlatformFromLabel(text) {
  const lower = text.toLowerCase();
  for (const [pattern, platform] of Object.entries(ICON_TO_PLATFORM)) {
    if (lower.includes(pattern)) {
      return platform;
    }
  }
  return null;
}

function hasSocialMediaLabel(element, allowedPlatforms) {
  const ariaLabel = element.getAttribute('aria-label') || '';
  const title = element.getAttribute('title') || '';
  const alt = element.getAttribute('alt') || '';
  const combined = `${ariaLabel} ${title} ${alt}`;

  const platform = getMatchingPlatformFromLabel(combined);
  if (platform && allowedPlatforms.includes(platform)) {
    return false; // Platform is allowed, don't remove
  }

  return SVG_LABEL_PATTERNS.some(pattern => pattern.test(combined));
}

function removeElement(element) {
  // Try to remove the containing list item or wrapper if appropriate
  const parent = element.parentElement;
  if (parent) {
    const tagName = parent.tagName.toLowerCase();
    if (tagName === 'li' ||
        (tagName === 'div' && parent.children.length === 1) ||
        (tagName === 'span' && parent.children.length === 1)) {
      parent.remove();
      return;
    }
  }
  element.remove();
}

function removeSocialMediaElements(cleansedDomains, allowedPlatforms) {
  // Remove links to social media sites
  document.querySelectorAll('a[href]').forEach(link => {
    if (isSocialMediaUrl(link.href, cleansedDomains)) {
      removeElement(link);
    }
  });

  // Remove elements with social media icon classes
  document.querySelectorAll('i, span, svg, img').forEach(element => {
    if (hasMatchingClass(element, ICON_CLASS_PATTERNS)) {
      // Check if any matching pattern corresponds to an allowed platform
      const className = element.className;
      if (typeof className === 'string') {
        let shouldRemove = true;
        for (const [pattern, platform] of Object.entries(ICON_TO_PLATFORM)) {
          if (className.toLowerCase().includes(pattern) && allowedPlatforms.includes(platform)) {
            shouldRemove = false;
            break;
          }
        }
        if (shouldRemove) {
          removeElement(element);
        }
      }
    }
  });

  // Remove SVGs with social media labels
  document.querySelectorAll('svg').forEach(svg => {
    if (hasSocialMediaLabel(svg, allowedPlatforms)) {
      removeElement(svg);
    }
  });

  // Remove images with social media in src or alt
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || '';
    const alt = img.alt || '';
    const combined = `${src} ${alt}`;

    const platform = getMatchingPlatformFromLabel(combined);
    if (platform && allowedPlatforms.includes(platform)) {
      return; // Platform is allowed
    }

    if (SVG_LABEL_PATTERNS.some(pattern => pattern.test(src) || pattern.test(alt))) {
      removeElement(img);
    }
  });

  // Remove share buttons and social widgets
  document.querySelectorAll('[class*="share"], [class*="social"], [id*="share"], [id*="social"]').forEach(element => {
    const text = element.textContent || '';
    const className = element.className || '';

    const platform = getMatchingPlatformFromLabel(text);
    if (platform && allowedPlatforms.includes(platform)) {
      return; // Platform is allowed
    }

    if (/\b(share|social|follow)\b/i.test(className) &&
        SVG_LABEL_PATTERNS.some(pattern => pattern.test(text))) {
      removeElement(element);
    }
  });

  // Remove iframes from social media
  document.querySelectorAll('iframe').forEach(iframe => {
    if (isSocialMediaUrl(iframe.src, cleansedDomains)) {
      removeElement(iframe);
    }
  });
}

// Main initialization
async function init() {
  let allowedPlatforms = [];
  let disabledSites = [];
  let globalEnabled = true;

  // Try to load settings from storage
  try {
    const result = await chrome.storage.sync.get(['allowedPlatforms', 'disabledSites', 'globalEnabled']);
    allowedPlatforms = result.allowedPlatforms || [];
    disabledSites = result.disabledSites || [];
    globalEnabled = result.globalEnabled !== false; // Default to true
  } catch (e) {
    // Storage not available or error, cleanse everything
    allowedPlatforms = [];
    disabledSites = [];
    globalEnabled = true;
  }

  // Check if extension is globally disabled
  if (!globalEnabled) {
    return;
  }

  // Check if this site is disabled
  const currentHostname = window.location.hostname.replace(/^www\./, '');
  if (disabledSites.includes(currentHostname)) {
    return; // Don't run on disabled sites
  }

  const cleansedDomains = getCleansedDomains(allowedPlatforms);

  // Run on page load
  removeSocialMediaElements(cleansedDomains, allowedPlatforms);

  // Observe DOM changes for dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldRun = true;
        break;
      }
    }
    if (shouldRun) {
      removeSocialMediaElements(cleansedDomains, allowedPlatforms);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

init();
