module.exports = setConfig => config => {
  if (!config.syncSettings) return config;
  setConfig(config.syncSettings);
  return config;
};
