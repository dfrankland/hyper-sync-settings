import { app, Notification, shell } from 'electron';

export interface NotifyOptions {
  title: string;
  body?: string;
  url?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
}

export default ({ title, body, url, level = 'debug' }: NotifyOptions): void => {
  // eslint-disable-next-line no-console
  console[level]([title, body, url].filter(Boolean).join('\n'));

  if (!app || !app.isReady()) return;

  const notification = new Notification({
    title,
    body: body || '',
  });

  if (url) {
    notification.on('click', (): void => {
      shell.openExternal(url);
    });
  }

  notification.show();
};
