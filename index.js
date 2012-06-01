amqp = require('amqp')

defaults = {
  messageOpts: {
    deliveryMode: 2,
    contentType: 'application/json'
  },
  appName: 'node',
  connection: {},
  exchange: {
    name: 'logs',
    durable: true,
    autoDelete: false
  }
}

module.exports = function(opts) {
  var connection = amqp.createConnection(opts.connection || defaults.connection)
    , appName = opts.appName || defaults.appName
    , messageOpts = opts.messageOpts || defaults.messageOpts
    , ex = opts.exchange || defaults.exchange
    , exchange = null
    , queued = []

  connection.on('ready', function(){
    connection.exchange(ex.name, ex, function (exch) {
      exchange = exch
      queued.forEach(function(entry){
        write.call(null, entry)
      })
      queued = []
    })
  })

  function write(entry) {
    var routingKey = entry.routingKey || (
        appName + '.' + entry.level +
        (entry.type ? '.' + entry.type : ''))

    delete entry.routingKey
    exchange.publish(routingKey, JSON.stringify(entry), messageOpts)
  }

  return function(entry) {
    if (!exchange) {
      queued.push(entry)
    } else {
      write(entry)
    }
  }
}
