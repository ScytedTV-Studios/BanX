# Ban X

![License](https://img.shields.io/dub/l/vibe-d.svg) ![Latest Release](https://img.shields.io/github/release/ScytedTV-Studios/BanX) ![Last Commit](https://img.shields.io/github/last-commit/ScytedTV-Studios/BanX) ![Wrapper](https://img.shields.io/badge/wrapper-discord.js-5865F2) ![Contributors](https://img.shields.io/github/contributors/ScytedTV-Studios/BanX)

![Ban X - Banner](https://github.com/ScytedTV-Studios/BanX/blob/master/branding/banx_github-preview.jpg?raw=true)

Easily protect your servers against **inappropriate** and **scam** URLs.

**Ban X** will automatically delete messages that contain URLs known to link to **X** (formerly **Twitter**). You can enable other categories of URLs using the `/block enable <type>`.

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
| Fake News | [`FAKENEWS.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/domains/FAKENEWS.txt) | [`StevenBlack/hosts`](https://github.com/StevenBlack/hosts) | [`hosts`](https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts) |
| Gambling | [`GAMBLING.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/domains/GAMBLING.txt) | [`StevenBlack/hosts`](https://github.com/StevenBlack/hosts) | [`hosts`](https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts) |
| IP Grabber | [`IP_GRABBER.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/domains/IP_GRABBER.txt) | [`furuycom/ProtectorHosts`](https://github.com/furuycom/ProtectorHosts) | [`hosts`](https://raw.githubusercontent.com/furkun/ProtectorHosts/main/hosts) |
| NSFW | [`NSFW.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/domains/NSFW.txt) | [`StevenBlack/hosts`](https://github.com/StevenBlack/hosts) | [`hosts`](https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts) |
| Scams | [`SCAMS.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/domains/SCAMS.txt) | [`jarelllama/Scam-Blocklist`](https://github.com/jarelllama/Scam-Blocklist) | [`scams.txt`](https://raw.githubusercontent.com/jarelllama/Scam-Blocklist/main/lists/wildcard_domains/scams.txt) |
| Social | [`SOCIAL.txt`](https://github.com/ScytedTV-Studios/BanX/blob/master/domains/SOCIAL.txt) | [`StevenBlack/hosts`](https://github.com/StevenBlack/hosts) | [`hosts`](https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts) |

*The block list domains are refreshed from the source every hour.*

## Contributions

If you would like to contribute to the [DEFAULT.txt](https://github.com/ScytedTV-Studios/BanX/blob/master/domains/DEFAULT.txt) file by adding harmful domains, make a [Pull Request](https://github.com/ScytedTV-Studios/BanX/pulls). In your Pull Request, please list the reason you are trying to ban said domain(s).

You can add a domain for any of the following reasons:
- The domain embeds X/Twitter posts.
- The domain hosts CSAM or other dangerous content.
- The domain hosts illegal or otherwise harmful content.
- 

Additionally, you can make a [Pull Request](https://github.com/ScytedTV-Studios/BanX/pulls) for an [Issue](https://github.com/ScytedTV-Studios/BanX/issues) if you have something you'd like to see added or changed.
