module.exports = setNotify => win => {
  setNotify(
    (title, body) => win.webContents.executeJavaScript(`
      new Notification('${title || ''}', { body: '${body || ''}' });
    `)
  );
};
