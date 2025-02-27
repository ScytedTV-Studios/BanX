# Ban X/Twitter

![Latest Release](https://img.shields.io/github/release/ScytedTV-Studios/BanX) ![Last Commit](https://img.shields.io/github/last-commit/ScytedTV-Studios/BanX) ![Wrapper](https://img.shields.io/badge/wrapper-discord.js-5865F2) ![Contributors](https://img.shields.io/github/contributors/ScytedTV-Studios/BanX)

![Ban X - Banner](https://github.com/ScytedTV-Studios/BanX/blob/master/Branding/Ban%20X%20-%20GitHub%20Preview.jpg?raw=true)

Easily protect your servers against **X**/**Twitter** URLs.

**Ban X** will automatically delete messages that contain URLs known to link to **X** (formerly **Twitter**). This may additionally support URLs that **share the same values** as the **X** platform.

This is a harm-free way to keep your server safe. It doesn't kick or ban users for posting these links, it instead deletes their message and lets them know why it was harmful.

## Invite The Bot

You can invite the bot to your Discord Server with this URL: https://discord.com/oauth2/authorize?client_id=1333586687724355759

## Domain List

You can find the list of domains currently blocked globally by **Ban X** in [DOMAINS.txt](https://github.com/ScytedTV-Studios/BanX/blob/master/DOMAINS.txt).

We have also added additional features to support more types of domains, called "Block Lists". You can enable/disable block lists in your server using the `/block enable <type>` and `/block disable <type>` commands, and view your block list settings using `/block list`.

**Sources:**

These are the sources of our additional block lists.

| List Type | Domains File | Source GitHub Repo | Source URL |
| --------- | ------------ | ------------------ | ---------- |
| Fake News | [`DOMAINS_FAKENEWS.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/DOMAINS_FAKENEWS.txt) | [`StevenBlack/hosts`](https://github.com/StevenBlack/hosts) | [`hosts`](https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts) |
| Gambling | [`DOMAINS_GAMBLING.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/DOMAINS_GAMBLING.txt) | [`StevenBlack/hosts`](https://github.com/StevenBlack/hosts) | [`hosts`](https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts) |
| NSFW | [`DOMAINS_NSFW.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/DOMAINS_NSFW.txt) | [`StevenBlack/hosts`](https://github.com/StevenBlack/hosts) | [`hosts`](https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts) |
| Scams | [`DOMAINS_SCAMS.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/DOMAINS_SCAMS.txt) | [`jarelllama/Scam-Blocklist`](https://github.com/jarelllama/Scam-Blocklist) | [`scams.txt`](https://raw.githubusercontent.com/jarelllama/Scam-Blocklist/main/lists/wildcard_domains/scams.txt) |
| Social | [`DOMAINS_SOCIAL.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/DOMAINS_SOCIAL.txt) | [`StevenBlack/hosts`](https://github.com/StevenBlack/hosts) | [`hosts`](https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts) |

*The block list domains are refreshed from the source every hour.*

## Contributions

If you would like to contribute to the [DOMAINS.txt](https://github.com/ScytedTV-Studios/BanX/blob/master/DOMAINS.txt) file by adding harmful domains, make a [Pull Request](https://github.com/ScytedTV-Studios/BanX/pulls). In your Pull Request, please list the reason you are trying to ban said domain(s).

You can add a domain for any of the following reasons:
- The domain embeds X/Twitter posts.
- The domain hosts CSAM or other dangerous content.
- The domain hosts illegal or otherwise harmful content.
