# node-eel-amqp

AMQP backend for [eel](https://github.com/BetSmartMedia/node-eel) (EventEmitter logging)

# Example usage

Create a handler and attach it the global `log` object during your application initialization:

```javascript
var log = require('eel')
var handler = require('eel-stream')({
  appName: 'myapp',      // prepended to routing keys
  connection: {          // passed directly to amqp.createConnection
    host: 'localhost',
    port: 5672,
    login: 'guest',
    password: 'guest',
    vhost: '/',
  },
  exchange: {             // passed dir
    name: 'logs',
    durable: true,
    autoDelete: false
  },
  messageOpts: {          // these are the defaults
    deliveryMode: 2,
    contentType: 'application/json'
  }
})

log.on('entry', require('eel-stream'))
```

JSON log entries will be published to your exchange using a routing key of `{appName}.{entry.type}`.
E.g. - using the above config, `log('request.end', {path: '/neato'})` will publish to the `logs`
exchange with a routing key of `myapp.request.end`.

If you do not like or want this convention, you can override the routing key by including a
`routingKey` member in your log entries.

# Install

    node install eel-amqp