module.exports = ({ webContents }) => {
  const runJs = (js, run) => {
    const wrappedJs = `
      (${js})();
    `;
    if (!run) return wrappedJs;
    webContents.executeJavaScript(wrappedJs);
  };

  const open = run => ({
    window: url => runJs(`
      () => {
        const { shell } = require('electron');
        shell.openExternal('${url}');
      }
    `, run),
    notification: (title, body, url) => runJs(`
      () => {
        const notification = new Notification(
          '${title || ''}',
          {
            body: '${body || ''}',
          }
        );
        ${url && `notification.onclick = () => ${open(false).window(url)}`}
      }
    `, run),
  });

  return open(true);
};
