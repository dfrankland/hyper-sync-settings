module.exports = setNotify => win => {
  setNotify(
    (title, body, click) => win.webContents.executeJavaScript(`
      const notification = new Notification(
        '${title || ''}',
        {
          body: '${body || ''}',
        }
      );
      ${click && `notification.onclick = event => (${click.toString()})(event)`}
    `)
  );
};
