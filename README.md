# Quake Live server remote console

This is a client for the Quake Live dedicated server rcon and stats services. You can either connect to one of them or to both of them at the same time.

## Install

Install Node and clone this Git repository. Nothing more is needed. The compiled JavaScript file and `node_modules` directory are included for your convenience.

## Usage

If you want to connect to rcon, specify the rcon port and the rcon password if needed. If you want to connect to stats, specify the stats port and the stats password if needed. If you want to connect to both, specify both.

```sh
./connect.sh 127.0.0.1 --rcon-port 28960 --rcon-password rconadmin --stats-port 27960 --stats-password statsadmin
```

You can exit the console by either using `Ctrl+C` or issuing the command `exit`.

## Display full Quake Live stats events

You can use option `--full-stats` to display the full stats event object instead of the user friendly short version. These objects are based on based on [ql-stats-model](https://github.com/quakelive-server-standards/ql-stats-model).

Use `--raw-stats` to display the original Quake Live stats objects.

## Docker

There is also a [Docker image](https://hub.docker.com/repository/docker/quakeliveserverstandards/ql-console) which you can use to run QL Console.

```shell
docker run --rm -ti --add-host host.docker.internal:host-gateway quakeliveserverstandards/ql-console host.docker.internal --rcon-port 28960 --rcon-password rconadmin --stats-port 27960 --stats-password statsadmin
```

Use the hostname `host.docker.internal` instead of `localhost` if you want to connect to Quake Live servers that are running on the same machine.

If you are running your own Quake Live servers you can use Quake Live Server Standards [server framework](https://github.com/quakelive-server-standards/server-standards). It ships with the Dockerized QL Console.
