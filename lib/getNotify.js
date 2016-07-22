const openWindow = url => `event => {
  const { shell } = require('electron');
  shell.openExternal('${url}');
}`;

module.exports = setNotify => win => {
  setNotify(
    (title, body, url) => win.webContents.executeJavaScript(`
      (() => {
        const notification = new Notification(
          '${title || ''}',
          {
            body: '${body || ''}',
          }
        );
        ${url && `notification.onclick = event => (${openWindow(url)})(event)`}
      })();
    `)
  );
};
