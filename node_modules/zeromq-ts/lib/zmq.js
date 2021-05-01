"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketType = exports.ProtocolType = exports.ZeroMq = exports.zmqVersion = void 0;
var zmq = require('zeromq');
exports.zmqVersion = zmq.version;
/**
 * The ØMQ lightweight messaging kernel is a library which extends the standard socket interfaces with features
 * traditionally provided by specialised messaging middleware products. ØMQ sockets provide an abstraction of
 * asynchronous message queues, multiple messaging patterns, message filtering (subscriptions), seamless access
 * to multiple transport protocols and more.
 *
 * This documentation presents an overview of ØMQ concepts, describes how ØMQ abstracts standard sockets and
 * provides a reference manual for the functions provided by the ØMQ library.
 *
 * http://api.zeromq.org/4-2:zmq
 */
var ZeroMq = /** @class */ (function () {
    function ZeroMq(socketType, protocol, address, socketOptions) {
        this.socketType = socketType;
        this.protocol = protocol;
        this.address = address;
        this.socketOptions = socketOptions;
        this.socket = zmq.createSocket(this.socketType, this.socketOptions);
        this.socket.monitor();
    }
    /**
     * The zmq_connect() function connects the socket to an endpoint and then accepts incoming
     * connections on that endpoint.
     *
     * The endpoint is a string consisting of a transport :// followed by an address. The transport
     * specifies the underlying protocol to use. The address specifies the transport-specific address
     * to connect to.
     *
     * ØMQ provides the the following transports:
     *
     * tcp: unicast transport using TCP, see zmq_tcp(7)
     * ipc: local inter-process communication transport, see zmq_ipc(7)
     * inproc: local in-process (inter-thread) communication transport, see zmq_inproc(7)
     * pgm, epgm: reliable multicast transport using PGM, see zmq_pgm(7)
     * vmci: virtual machine communications interface (VMCI), see zmq_vmci(7)
     *
     * Every ØMQ socket type except ZMQ_PAIR supports one-to-many and many-to-one semantics. The precise
     * semantics depend on the socket type and are defined in zmq_socket(3).
     *
     * For most transports and socket types the connection is not performed immediately but as needed by ØMQ.
     * Thus a successful call to zmq_connect() does not mean that the connection was or could actually be
     * established. Because of this, for most transports and socket types the order in which a server socket
     * is bound and a client socket is connected to it does not matter. The first exception is when using the
     * inproc:// transport: you must call zmq_bind() before calling zmq_connect(). The second exception are
     * ZMQ_PAIR sockets, which do not automatically reconnect to endpoints.
     *
     * Following a zmq_connect(), for socket types except for ZMQ_ROUTER, the socket enters its normal ready
     * state. By contrast, following a zmq_bind() alone, the socket enters a mute state in which the socket
     * blocks or drops messages according to the socket type, as defined in zmq_socket(3). A ZMQ_ROUTER socket
     * enters its normal ready state for a specific peer only when handshaking is complete for that peer, which
     * may take an arbitrary time.
     *
     * http://api.zeromq.org/4-2:zmq-connect
     */
    ZeroMq.prototype.connect = function () {
        this.socket.connect(this.protocol + '://' + this.address);
    };
    /**
     * The zmq_bind() function binds the socket to a local endpoint and then accepts incoming connections
     * on that endpoint.
     *
     * The endpoint is a string consisting of a transport :// followed by an address. The transport specifies
     * the underlying protocol to use. The address specifies the transport-specific address to bind to.
     *
     * ØMQ provides the the following transports:
     *
     * tcp: unicast transport using TCP, see zmq_tcp(7)
     * ipc: local inter-process communication transport, see zmq_ipc(7)
     * inproc: local in-process (inter-thread) communication transport, see zmq_inproc(7)
     * pgm, epgm: reliable multicast transport using PGM, see zmq_pgm(7)
     * vmci: virtual machine communications interface (VMCI), see zmq_vmci(7)
     *
     * Every ØMQ socket type except ZMQ_PAIR supports one-to-many and many-to-one semantics. The precise
     * semantics depend on the socket type and are defined in zmq_socket(3).
     *
     * The ipc, tcp and vmci transports accept wildcard addresses: see zmq_ipc(7), zmq_tcp(7) and zmq_vmci(7)
     * for details.
     *
     * http://api.zeromq.org/4-2:zmq-bind
     */
    ZeroMq.prototype.bind = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return _this.socket.bind(_this.protocol + '://' + _this.address, function (error) {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    }); })];
            });
        });
    };
    /**
     * Set socket to pause mode no data will be emit until resume() is called all send() calls will be queued.
     */
    ZeroMq.prototype.pause = function () {
        this.socket.pause();
    };
    /**
     * Set a socket back to normal work mode.
     */
    ZeroMq.prototype.resume = function () {
        this.socket.resume();
    };
    ZeroMq.prototype.ref = function () {
        this.socket.ref();
    };
    ZeroMq.prototype.unref = function () {
        this.socket.unref();
    };
    /**
     * ?
     */
    ZeroMq.prototype.read = function () {
        this.socket.read();
    };
    /**
     * The socket has successfully connected to a remote peer. The event value is the file descriptor (FD) of
     * the underlying network socket. Warning: there is no guarantee that the FD is still valid by the time
     * your code receives this event.
     */
    ZeroMq.prototype.onConnected = function (listener) {
        this.socket.on('connect', listener);
    };
    /**
     * A connect request on the socket is pending. The event value is unspecified.
     */
    ZeroMq.prototype.onConnectDelayed = function (listener) {
        this.socket.on('connect_delay', listener);
    };
    /**
     * A connect request failed, and is now being retried. The event value is the reconnect interval in
     * milliseconds. Note that the reconnect interval is recalculated at each retry.
     */
    ZeroMq.prototype.onConnectRetried = function (listener) {
        this.socket.on('connect_retry', listener);
    };
    /**
     * The socket was successfully bound to a network interface. The event value is the FD of the underlying
     * network socket. Warning: there is no guarantee that the FD is still valid by the time your code receives
     * this event.
     */
    ZeroMq.prototype.onListening = function (listener) {
        this.socket.on('listen', listener);
    };
    /**
     * The socket could not bind to a given interface. The event value is the errno generated by the system
     * bind call.
     */
    ZeroMq.prototype.onBindFailed = function (listener) {
        this.socket.on('bind_error', listener);
    };
    /**
     * The socket has accepted a connection from a remote peer. The event value is the FD of the underlying
     * network socket. Warning: there is no guarantee that the FD is still valid by the time your code receives
     * this event.
     */
    ZeroMq.prototype.onAccepted = function (listener) {
        this.socket.on('accept', listener);
    };
    /**
     * The socket has rejected a connection from a remote peer. The event value is the errno generated by the
     * accept call.
     */
    ZeroMq.prototype.onAcceptFailed = function (listener) {
        this.socket.on('accept_error', listener);
    };
    /**
     * The socket was closed. The event value is the FD of the (now closed) network socket.
     */
    ZeroMq.prototype.onClosed = function (listener) {
        this.socket.on('close', listener);
    };
    /**
     * The socket close failed. The event value is the errno returned by the system call. Note that this event
     * occurs only on IPC transports.
     */
    ZeroMq.prototype.onCloseFailed = function (listener) {
        this.socket.on('close_error', listener);
    };
    /**
     * The socket was disconnected unexpectedly. The event value is the FD of the underlying network socket.
     * Warning: this socket will be closed.
     */
    ZeroMq.prototype.onDisconnected = function (listener) {
        this.socket.on('disconnect', listener);
    };
    ZeroMq.prototype.onMessage = function (listener) {
        this.socket.on('message', listener);
    };
    ZeroMq.prototype.subscribe = function (filter) {
        if (filter === void 0) { filter = ''; }
        this.socket.subscribe(filter);
    };
    ZeroMq.prototype.unsubscribe = function (filter) {
        if (filter === void 0) { filter = ''; }
        this.socket.unsubscribe(filter);
    };
    /**
     * The zmq_send() function shall queue a message created from the buffer referenced by the buf and len
     * arguments. The flags argument is a combination of the flags defined below:
     *
     * ZMQ_DONTWAIT: For socket types (DEALER, PUSH) that block when there are no available peers (or all
     * peers have full high-water mark), specifies that the operation should be performed in non-blocking mode.
     * If the message cannot be queued on the socket, the zmq_send() function shall fail with errno set to EAGAIN.
     *
     * ZMQ_SNDMORE: Specifies that the message being sent is a multi-part message, and that further message
     * parts are to follow. Refer to the section regarding multi-part messages below for a detailed description.
     *
     * The zmq_msg_t structure passed to zmq_msg_send() is nullified during the call. If you want to send the
     * same message to multiple sockets you have to copy it (e.g. using zmq_msg_copy()).
     *
     * A successful invocation of zmq_msg_send() does not indicate that the message has been transmitted to the
     * network, only that it has been queued on the socket and ØMQ has assumed responsibility for the message.
     * You do not need to call zmq_msg_close() after a successful zmq_msg_send().
     *
     * Multi-part messages
     *
     * A ØMQ message is composed of 1 or more message parts. Each message part is an independent zmq_msg_t in
     * its own right. ØMQ ensures atomic delivery of messages: peers shall receive either all message parts of
     * a message or none at all. The total number of message parts is unlimited except by available memory.
     *
     * An application that sends multi-part messages must use the ZMQ_SNDMORE flag when sending each message
     * part except the final one.
     *
     * http://api.zeromq.org/4-2:zmq-sendmsg
     *
     * @param message The message to send
     * @param flags
     * @param callback
     */
    ZeroMq.prototype.send = function (message, flags, callback) {
        if (flags === void 0) { flags = 0; }
        this.socket.send(message, flags, callback);
    };
    return ZeroMq;
}());
exports.ZeroMq = ZeroMq;
/**
 * ØMQ provides the the following transports:
 *
 * tcp: unicast transport using TCP, see zmq_tcp(7)
 * ipc: local inter-process communication transport, see zmq_ipc(7)
 * inproc: local in-process (inter-thread) communication transport, see zmq_inproc(7)
 * pgm, epgm: reliable multicast transport using PGM, see zmq_pgm(7)
 * vmci: virtual machine communications interface (VMCI), see zmq_vmci(7)
 */
var ProtocolType;
(function (ProtocolType) {
    ProtocolType["tcp"] = "tcp";
    ProtocolType["ipc"] = "ipc";
    ProtocolType["inproc"] = "inproc";
    ProtocolType["pgm"] = "pgm";
    ProtocolType["epgm"] = "epgm";
    ProtocolType["vmci"] = "vmci";
})(ProtocolType = exports.ProtocolType || (exports.ProtocolType = {}));
/**
 * Radio-dish pattern (ZMQ_RADIO, ZMQ_DISH)
 *
 * The radio-dish pattern is used for one-to-many distribution of data from a single publisher to multiple
 * subscribers in a fan out fashion.
 *
 * Radio-dish is using groups (vs Pub-sub topics), Dish sockets can join a group and each message sent by
 * Radio sockets belong to a group.
 *
 * Groups are null terminated strings limited to 16 chars length (including null). The intention is to
 * increase the length to 40 chars (including null).
 *
 * Groups are matched using exact matching (vs prefix matching of PubSub).
 *
 *
 * Publish-subscribe pattern (ZMQ_PUB, ZMQ_SUB, ZMQ_XPUB, ZMQ_XSUB)
 *
 * The publish-subscribe pattern is used for one-to-many distribution of data from a single publisher to
 * multiple subscribers in a fan out fashion.
 *
 * The publish-subscribe pattern is formally defined by http://rfc.zeromq.org/spec:29.
 *
 *
 * Pipeline pattern (ZMQ_PUSH, ZMQ_PULL)
 *
 * The pipeline pattern is used for distributing data to nodes arranged in a pipeline. Data always flows
 * down the pipeline, and each stage of the pipeline is connected to at least one node. When a pipeline
 * stage is connected to multiple nodes data is round-robined among all connected nodes.
 *
 * The pipeline pattern is formally defined by http://rfc.zeromq.org/spec:30.
 *
 *
 * Exclusive pair pattern (ZMQ_PAIR)
 *
 * The exclusive pair pattern is used to connect a peer to precisely one other peer. This pattern is used
 * for inter-thread communication across the inproc transport.
 *
 * The exclusive pair pattern is formally defined by http://rfc.zeromq.org/spec:31.
 *
 *
 * Native pattern (ZMQ_STREAM)
 *
 * The native pattern is used for communicating with TCP peers and allows asynchronous requests and
 * replies in either direction.
 *
 *
 * Request-reply pattern (ZMQ_REQ, ZMQ_REP, ZMQ_DEALER, ZMQ_ROUTER, )
 *
 * The request-reply pattern is used for sending requests from a ZMQ_REQ client to one or more ZMQ_REP
 * services, and receiving subsequent replies to each request sent.
 *
 * The request-reply pattern is formally defined by http://rfc.zeromq.org/spec:28.
 *
 * Note: this pattern will be deprecated in favor of the client-server pattern.
 *
 * http://api.zeromq.org/4-2:zmq-socket
 */
var SocketType;
(function (SocketType) {
    /**
     * A socket of type ZMQ_PUB is used by a publisher to distribute data. Messages sent are distributed in a
     * fan out fashion to all connected peers. The zmq_recv(3) function is not implemented for this socket type.
     *
     * When a ZMQ_PUB socket enters the mute state due to having reached the high water mark for a subscriber,
     * then any messages that would be sent to the subscriber in question shall instead be dropped until the mute
     * state ends. The zmq_send() function shall never block for this socket type.
     *
     * Compatible peer sockets: ZMQ_SUB, ZMQ_XSUB
     * Direction: Unidirectional
     * Send/receive pattern: Send only
     * Incoming routing strategy: N/A
     * Outgoing routing strategy: Fan out
     * Action in mute state: Drop
     */
    SocketType["publisher"] = "pub";
    /**
     * Same as ZMQ_PUB except that you can receive subscriptions from the peers in form of incoming messages.
     * Subscription message is a byte 1 (for subscriptions) or byte 0 (for unsubscriptions) followed by the
     * subscription body. Messages without a sub/unsub prefix are also received, but have no effect on subscription
     * status.
     *
     * Compatible peer sockets: ZMQ_SUB, ZMQ_XSUB
     * Direction: Unidirectional
     * Send/receive pattern: Send messages, receive subscriptions
     * Incoming routing strategy: N/A
     * Outgoing routing strategy: Fan out
     * Action in mute state: Drop
     */
    SocketType["xpublisher"] = "xpub";
    /**
     * A socket of type ZMQ_SUB is used by a subscriber to subscribe to data distributed by a publisher. Initially
     * a ZMQ_SUB socket is not subscribed to any messages, use the ZMQ_SUBSCRIBE option of zmq_setsockopt(3) to
     * specify which messages to subscribe to. The zmq_send() function is not implemented for this socket type.
     *
     * Compatible peer sockets: ZMQ_PUB, ZMQ_XPUB
     * Direction: Unidirectional
     * Send/receive pattern: Receive only
     * Incoming routing strategy: Fair-queued
     * Outgoing routing strategy: N/A
     */
    SocketType["subscriber"] = "sub";
    /**
     * Same as ZMQ_PUB except that you can receive subscriptions from the peers in form of incoming messages.
     * Subscription message is a byte 1 (for subscriptions) or byte 0 (for unsubscriptions) followed by the
     * subscription body. Messages without a sub/unsub prefix are also received, but have no effect on subscription
     * status.
     *
     * Compatible peer sockets: ZMQ_SUB, ZMQ_XSUB
     * Direction: Unidirectional
     * Send/receive pattern: Send messages, receive subscriptions
     * Incoming routing strategy: N/A
     * Outgoing routing strategy: Fan out
     * Action in mute state: Drop
     */
    SocketType["xsubscriber"] = "xsub";
    /**
     * A socket of type ZMQ_REQ is used by a client to send requests to and receive replies from a service. This
     * socket type allows only an alternating sequence of zmq_send(request) and subsequent zmq_recv(reply) calls.
     * Each request sent is round-robined among all services, and each reply received is matched with the last
     * issued request.
     *
     * If no services are available, then any send operation on the socket shall block until at least one service
     * becomes available. The REQ socket shall not discard messages.
     *
     * Compatible peer sockets: ZMQ_REP, ZMQ_ROUTER
     * Direction: Bidirectional
     * Send/receive pattern: Send, Receive, Send, Receive, ...
     * Outgoing routing strategy: Round-robin
     * Incoming routing strategy: Last peer
     * Action in mute state: Block
     */
    SocketType["request"] = "req";
    /**
     * ?
     */
    SocketType["xrequest"] = "xreq";
    /**
     * A socket of type ZMQ_REP is used by a service to receive requests from and send replies to a client.
     * This socket type allows only an alternating sequence of zmq_recv(request) and subsequent zmq_send(reply)
     * calls. Each request received is fair-queued from among all clients, and each reply sent is routed to
     * the client that issued the last request. If the original requester does not exist any more the reply is
     * silently discarded.
     *
     * Compatible peer sockets: ZMQ_REQ, ZMQ_DEALER
     * Direction: Bidirectional
     * Send/receive pattern: Receive, Send, Receive, Send, ...
     * Incoming routing strategy: Fair-queued
     * Outgoing routing strategy: Last peer
     */
    SocketType["reply"] = "rep";
    /**
     * ?
     */
    SocketType["xreply"] = "xrep";
    /**
     * A socket of type ZMQ_PUSH is used by a pipeline node to send messages to downstream pipeline nodes.
     * Messages are round-robined to all connected downstream nodes. The zmq_recv() function is not implemented
     * for this socket type.
     *
     * When a ZMQ_PUSH socket enters the mute state due to having reached the high water mark for all downstream
     * nodes, or if there are no downstream nodes at all, then any zmq_send(3) operations on the socket shall
     * block until the mute state ends or at least one downstream node becomes available for sending; messages
     * are not discarded.
     *
     * Compatible peer sockets: ZMQ_PULL
     * Direction	Unidirectional
     * Send/receive pattern	Send: only
     * Incoming routing strategy: N/A
     * Outgoing routing strategy: Round-robin
     * Action in mute state: Block
     */
    SocketType["push"] = "push";
    /**
     * A socket of type ZMQ_PULL is used by a pipeline node to receive messages from upstream pipeline nodes.
     * Messages are fair-queued from among all connected upstream nodes. The zmq_send() function is not
     * implemented for this socket type.
     *
     * Compatible peer sockets: ZMQ_PUSH
     * Direction: Unidirectional
     * Send/receive pattern: Receive only
     * Incoming routing strategy: Fair-queued
     * Outgoing routing strategy: N/A
     * Action in mute state: Block
     */
    SocketType["pull"] = "pull";
    /**
     * A socket of type ZMQ_DEALER is an advanced pattern used for extending request/reply sockets. Each message
     * sent is round-robined among all connected peers, and each message received is fair-queued from all connected
     * peers.
     *
     * When a ZMQ_DEALER socket enters the mute state due to having reached the high water mark for all peers, or
     * if there are no peers at all, then any zmq_send(3) operations on the socket shall block until the mute state
     * ends or at least one peer becomes available for sending; messages are not discarded.
     *
     * When a ZMQ_DEALER socket is connected to a ZMQ_REP socket each message sent must consist of an empty message
     * part, the delimiter, followed by one or more body parts.
     *
     * Compatible peer sockets: ZMQ_ROUTER, ZMQ_REP, ZMQ_DEALER
     * Direction: Bidirectional
     * Send/receive pattern: Unrestricted
     * Outgoing routing strategy: Round-robin
     * Incoming routing strategy: Fair-queued
     * Action in mute state: Block
     */
    SocketType["dealer"] = "dealer";
    /**
     * A socket of type ZMQ_ROUTER is an advanced socket type used for extending request/reply sockets. When receiving
     * messages a ZMQ_ROUTER socket shall prepend a message part containing the identity of the originating peer to the
     * message before passing it to the application. Messages received are fair-queued from among all connected peers.
     * When sending messages a ZMQ_ROUTER socket shall remove the first part of the message and use it to determine the
     * identity of the peer the message shall be routed to. If the peer does not exist anymore the message shall be
     * silently discarded by default, unless ZMQ_ROUTER_MANDATORY socket option is set to 1.
     *
     * When a ZMQ_ROUTER socket enters the mute state due to having reached the high water mark for all peers, then
     * any messages sent to the socket shall be dropped until the mute state ends. Likewise, any messages routed to a
     * peer for which the individual high water mark has been reached shall also be dropped, unless ZMQ_ROUTER_MANDATORY
     * socket option is set.
     *
     * When a ZMQ_REQ socket is connected to a ZMQ_ROUTER socket, in addition to the identity of the originating peer
     * each message received shall contain an empty delimiter message part. Hence, the entire structure of each received
     * message as seen by the application becomes: one or more identity parts, delimiter part, one or more body parts.
     * When sending replies to a ZMQ_REQ socket the application must include the delimiter part.
     *
     * Compatible peer sockets: ZMQ_DEALER, ZMQ_REQ, ZMQ_ROUTER
     * Direction: Bidirectional
     * Send/receive pattern: Unrestricted
     * Outgoing routing strategy: See text
     * Incoming routing strategy: Fair-queued
     * Action in mute state: Drop (see text)
     */
    SocketType["router"] = "router";
    /**
     * A socket of type ZMQ_PAIR can only be connected to a single peer at any one time. No message routing or filtering
     * is performed on messages sent over a ZMQ_PAIR socket.
     *
     * When a ZMQ_PAIR socket enters the mute state due to having reached the high water mark for the connected peer,
     * or if no peer is connected, then any zmq_send(3) operations on the socket shall block until the peer becomes
     * available for sending; messages are not discarded.
     *
     * ZMQ_PAIR sockets are designed for inter-thread communication across the zmq_inproc(7) transport and do not
     * implement functionality such as auto-reconnection.
     *
     * Compatible peer sockets	ZMQ_PAIR
     * Direction: Bidirectional
     * Send/receive pattern: Unrestricted
     * Incoming routing strategy: N/A
     * Outgoing routing strategy: N/A
     * Action in mute state: Block
     */
    SocketType["pair"] = "pair";
    /**
     * A socket of type ZMQ_STREAM is used to send and receive TCP data from a non-ØMQ peer, when using the
     * tcp:// transport. A ZMQ_STREAM socket can act as client and/or server, sending and/or receiving TCP data
     * asynchronously.
     *
     * When receiving TCP data, a ZMQ_STREAM socket shall prepend a message part containing the identity of the
     * originating peer to the message before passing it to the application. Messages received are fair-queued
     * from among all connected peers.
     *
     * When sending TCP data, a ZMQ_STREAM socket shall remove the first part of the message and use it to
     * determine the identity of the peer the message shall be routed to, and unroutable messages shall cause
     * an EHOSTUNREACH or EAGAIN error.
     *
     * To open a connection to a server, use the zmq_connect call, and then fetch the socket identity using
     * the ZMQ_IDENTITY zmq_getsockopt call.
     *
     * To close a specific connection, send the identity frame followed by a zero-length message
     * (see EXAMPLE section).
     *
     * When a connection is made, a zero-length message will be received by the application. Similarly, when
     * the peer disconnects (or the connection is lost), a zero-length message will be received by the application.
     *
     * You must send one identity frame followed by one data frame. The ZMQ_SNDMORE flag is required for identity
     * frames but is ignored on data frames.
     *
     * Compatible peer sockets	none.
     * Direction: Bidirectional
     * Send/receive pattern: Unrestricted
     * Outgoing routing strategy: See text
     * Incoming routing strategy: Fair-queued
     * Action in mute state: EAGAIN
     */
    SocketType["stream"] = "stream";
})(SocketType = exports.SocketType || (exports.SocketType = {}));
