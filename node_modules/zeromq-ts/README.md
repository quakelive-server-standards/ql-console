# zeromq.ts

A typed and documented [zeromq.js based on version 5.x](https://github.com/zeromq/zeromq.js/tree/5.x).

## Installation

Install with `npm install zeromq.ts`.

## Overview

`ZeroMq` is the main class to work with. It represents one zeromq.js `Socket` object. The constructor will create that for you.

```typescript
import { ProtocolType, SocketType, ZeroMq } from 'zeromq.ts'

let zmq = new ZeroMq(SocketType.subscriber, ProtocolType.tcp, '127.0.0.1:27010', {
  plain_username: 'user',
  plain_password: 'password'
})
```

The 4th parameter is an object representing options. Use your IDE to find out which there are and also read the documentation there. Everything is well documented.

### ZMQ events

You can attach arbitrary many listeners to each one of the following ZMQ events. Also every method will automatically initialize the mandatory ZMQ monitor for you.

```typescript
zmq.onConnected(listener)
zmq.onConnectDelayed(listener)
zmq.onConnectRetried(listener)
zmq.onListening(listener)
zmq.onBindFailed(listener)
zmq.onAccepted(listener)
zmq.onAcceptFailed(listener)
zmq.onClose(listener)
zmq.onCloseFailed(listener)
zmq.onDisconnected(listener)
```

These events are named differently in the original library which named them incorrectly regarding the standard.

### ZMQ messages

You can subscribe to messages using a certain filter.

```typescript
zmq.subscribe('') // registers to all messages
zmq.onMessage(listener)
```

### ZMQ send

Sending messages.

```typescript
zmq.send('some_message')
```

### Version

You can find out the version by importing the corresponding variable.

```typescript
import { version } from 'zeromq.ts'
```

## Missing things

There are still some minor things missing which can be added easily which i will do if there is any interest. Just create an issue on GitHub.