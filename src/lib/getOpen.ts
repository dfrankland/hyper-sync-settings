import { BrowserWindow } from 'electron';

export interface Open {
  window: (url: string) => void | string;
  notification: (title?: string, body?: string, url?: string) => void | string;
  item: (path: string) => void | string;
}

export default ({ webContents }: BrowserWindow): Open => {
  const runJs = (js: string, run: boolean): void | string => {
    let wrappedJs = `
      () => {
        ${js}
      }
    `;
    if (!run) return wrappedJs;
    wrappedJs = `(${wrappedJs})()`;
    webContents.executeJavaScript(wrappedJs);
    return undefined;
  };

  const open = (run: boolean): Open => ({
    window: (url: string): void | string =>
      runJs(
        `
          const { shell } = require('electron');
          shell.openExternal('${url}');
        `,
        run,
      ),
    notification: (
      title?: string,
      body?: string,
      url?: string,
    ): void | string =>
      runJs(
        `
          const notification = new Notification(
            '${title || ''}',
            {
              body: '${body || ''}',
            }
          );
          ${url && `notification.onclick = ${open(false).window(url)}`}
        `,
        run,
      ),
    item: (path: string): void | string =>
      runJs(
        `
          const { shell } = require('electron');
          shell.openItem('${path}');
        `,
        run,
      ),
  });

  return open(true);
};
