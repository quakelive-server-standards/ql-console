#!/bin/sh

# ./connect.sh 127.0.0.1 --rcon-port 28960 --rcon-password rconadmin --stats-port 27960 --stats-password statsadmin

# If you want to connect to rcon, specify the rcon port and the rcon password if needed.
# If you want to connect to stats, specify the stats port and the stats password if needed.
# If you want to connect to both, specify both.

node lib/cli.js $*