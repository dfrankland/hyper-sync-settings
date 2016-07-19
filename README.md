# HyperTerm Sync Settings

> Sync HyperTerm settings with Github.

## Setup

1.  Create a [new personal access token](https://github.com/settings/tokens/new)
    which has the `gist` scope. Save your token to
    `config.syncSettings.personalAccessToken` inside `~/.hyperterm.js`.

2.  Create a [new gist](https://gist.github.com/) and save it. Save your gist id
    (last part of the url after the username) to `config.syncSettings.gistId`
    inside `~/.hyperterm.js`.

3.  Restart HyperTerm.

**Disclaimer:** Github Gists are by default **public**. If you don't want other
people to easily find your gist (i.e. if you use certain packages, storing
auth-tokens, a malicious party could abuse them), you should make sure to
**create a secret gist**.

## How to use

![alt demo](http://i.giphy.com/l0Hlvxk6H8auyhn1e.gif)

To use `hyperterm-sync-settings` simply click on either
`Plugins > Sync Settings: Backup` or `Plugins > Sync Settings: Restore` in the
menu. Also, you may use the shortcut combinations `(Cmd or Ctrl) + Shift + B`
to backup your settings or `(Cmd or Ctrl) + Shift + R` to restore your settings.

## Contribution

Please help improve this package! There's lots of room for stability and new
features to be made, so I would love if you could help improve it :)

## Credit

Credit where credit's due; the idea of this comes directly from
[`atom-sync-settings`](https://github.com/atom-community/sync-settings).
