module.exports = {
  mongodbMemoryServer: {
    version: 'latest'
  },
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest',
      port: 42963
    },
    binary: {
      skipMD5: true
    },
    autoStart: false
  }
}
