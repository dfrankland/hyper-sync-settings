export default ({ webContents }) => {
  const runJs = (js, run) => {
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

  const open = run => ({
    window: url => runJs(`
      const { shell } = require('electron');
      shell.openExternal('${url}');
    `, run),
    notification: (title, body, url) => runJs(`
      const notification = new Notification(
        '${title || ''}',
        {
          body: '${body || ''}',
        }
      );
      ${url && `notification.onclick = ${open(false).window(url)}`}
    `, run),
    item: path => runJs(`
      const { shell } = require('electron');
      shell.openItem('${path}');
    `, run),
  });

  return open(true);
};
