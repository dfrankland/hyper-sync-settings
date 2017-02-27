# Hyper Sync Settings

> Sync Hyper settings with Github.

## Setup

1.  Create a [new personal access token][1] which has the `gist` scope. Save
    your token to `personalAccessToken` inside
    `~/.hyper_plugins/.hyper-sync-settings.json`. Alternatively, set the
    `HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN` environmental variable using
    this token.

2.  Create a [new gist][2] and save it. Save your gist id
    (last part of the url after the username) to `gistId` inside
    `~/.hyper_plugins/.hyper-sync-settings.json`. Alternatively, set the
    `HYPER_SYNC_SETTINGS_GIST_ID` environmental variable using this id.

3.  Restart Hyper.

**Disclaimer:** Github Gists are by default **public**. If you don't want other
people to easily find your gist (i.e. if you use certain packages, storing
auth-tokens, a malicious party could abuse them), you should make sure to
**create a secret gist**.

## How to use

![alt demo][3]

Use the commands below in the menu:

1.  `Plugins > Sync Settings > Check for Updates`

    Checks Github to see if there are any updates available for your settings.

2.  `Plugins > Sync Settings > Backup Settings`

    Copies your `~/.hyper.js` file to your local repository and pushes it to
    Github.

3.  `Plugins > Sync Settings > Restore Settings`

    Fast forwards local repo with all new commits from Github and copies the new
    settings to your `~/.hyper.js` file.

4.  `Plugins > Sync Settings > Open >`

    *   `Gist`: Opens the link to the configured Gist.

    *   `Repo`: Opens the local repo that is cloned from the Gist.

    *   `Configuration`: Opens the
        `~/.hyper_plugins/.hyper-sync-settings.json` config file.

## Configuration
Add `syncSettings` in your `.hyper.js` config. The configuration below shows all
existing configuration values in their default states.

```js
module.exports = {
  config: {
    // other configs...
    syncSettings: {
      quiet: false,
      accelerators: {
        checkForUpdates: 'CmdOrCtrl+8'
      }
    },
  },
  // ...
}
```

#### `config.syncSettings.quiet`
*   Type: boolean
*   Default: false

Mute the notification saying "Your settings are up to date". This will not hide
any other notifications.

#### `config.syncSettings.accelerators`
*   Type: object
*   Default: {}

Add configurable keyboard shortcuts to each of the menu options. The value of
each of the properties should be a valid [Electron Accelerator][4]. The available
options are:

*   `checkForUpdates`
*   `backupSettings`
*   `restoreSettings`
*   `openGist`
*   `openRepo`
*   `openConfiguration`

## Contribution

Please help improve this package! There's lots of room for stability and new
features to be made, so I would love if you could help improve it :)

## Credit

Credit where credit's due; the idea of this comes directly from
[`atom-sync-settings`][5].

[1]: https://github.com/settings/tokens/new
[2]: https://gist.github.com/
[3]: http://i.giphy.com/9CNA0ceu5iuoU.gif
[4]: https://github.com/electron/electron/blob/master/docs/api/accelerator.md
[5]: https://github.com/atom-community/sync-settings
