const Logger = require('logdna')

const options = {
  hostname: 'a-mac-045.local',
  ip: '113.172.154.84',
  mac: '88:e9:fe:65:f2:69',
  app: 'ndkhuong-react-reserve'
}

const log = Logger.setupDefaultLogger(process.env.LOGGER_KEY, options)

export default log