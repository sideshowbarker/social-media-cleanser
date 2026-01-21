# Social Media Cleanser

A cross-browser extension that cleanses web pages of social media links and icons.

## Cleansed Domains

All of the following are cleansed by default. You can allow specific categories via the extension popup.

| Category | Domains |
|----------|---------|
| Twitter / X | twitter.com, x.com |
| Facebook | facebook.com, fb.com, fb.me |
| Instagram | instagram.com, instagr.am |
| LinkedIn | linkedin.com, lnkd.in |
| YouTube | youtube.com, youtu.be |
| TikTok | tiktok.com |
| Snapchat | snapchat.com |
| Pinterest | pinterest.com, pin.it |
| Reddit | reddit.com, redd.it |
| Tumblr | tumblr.com |
| WhatsApp | whatsapp.com, wa.me |
| Telegram | telegram.org, t.me |
| Discord | discord.com, discord.gg |
| Twitch | twitch.tv |
| Mastodon | mastodon.social, mastodon.online, mstdn.social, fosstodon.org, hachyderm.io, infosec.exchange |
| Bluesky | bsky.app, bsky.social |
| Threads | threads.net |
| Fediverse (Other) | post.news, cohost.org, pixelfed.social, lemmy.world, lemmy.ml, kbin.social |
| Chinese Platforms | weibo.com, weibo.cn, qq.com, wechat.com |
| Russian Platforms | vk.com, ok.ru |
| Messaging | line.me |
| Professional | xing.com |
| Alt Platforms | clubhouse.com, parler.com, gab.com, truthsocial.com, gettr.com, minds.com, mewe.com |
| Creative | flickr.com, deviantart.com, behance.net, dribbble.com |
| Publishing | medium.com, substack.com |
| Funding | patreon.com, ko-fi.com, buymeacoffee.com |
| Link Aggregators | linktree.com, linktr.ee, beacons.ai, carrd.co, about.me |

## Directory Structure

```
social-media-cleanser/
├── extension/
│   ├── manifest.json  # Chrome/Firefox/Edge extension manifest
│   ├── content.js     # Main content script
│   ├── popup.html     # Settings popup UI
│   ├── popup.js       # Settings popup logic
│   └── icon.png       # Extension icon
└── safari/            # Xcode project for Safari (generated)
```

## Installation

### Chrome / Edge / Brave

1. Open `chrome://extensions/` (or `edge://extensions/` or `brave://extensions/`).
2. Enable "Developer mode" (toggle in top right).
3. Click "Load unpacked".
4. Select the `extension` folder.

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click "Load Temporary Add-on".
3. Select `manifest.json` from the `extension` folder.

For permanent Firefox installation, the extension needs to be signed or you need to use Firefox Developer Edition with `xpinstall.signatures.required` set to `false`.

### Safari

1. Generate the Xcode project:
   ```bash
   xcrun safari-web-extension-converter extension \
       --project-location safari --app-name "Social Media Cleanser" --no-open
   ```
2. Open `safari/Social Media Cleanser/Social Media Cleanser.xcodeproj` in Xcode.
3. Set your Team for both macOS (App) and macOS (Extension) targets.
4. Select the "Social Media Cleanser (macOS)" scheme.
5. Build (⌘B) and Run (⌘R).
6. In Safari: Settings → Extensions → enable Social Media Cleanser.

## How It Works

The extension:

1. Scans the page for links pointing to known social media domains.
2. Detects social media icons by class names (Font Awesome, etc.).
3. Identifies SVGs and images with social media labels.
4. Removes share buttons and social widgets.
5. Watches for dynamically loaded content and removes new social media elements.

## Settings

Click the extension icon in your browser toolbar to open the settings popup. From there you can toggle which platform categories to allow (unblock). All platforms are cleansed by default. Settings are synced across your browser sessions.

**Note:** After changing settings, refresh the page to apply changes.

## Customization

Edit `extension/content.js` to:

- Add/remove domains from `PLATFORM_GROUPS`.
- Modify icon detection patterns in `ICON_CLASS_PATTERNS`.
- Adjust SVG label detection in `SVG_LABEL_PATTERNS`.
