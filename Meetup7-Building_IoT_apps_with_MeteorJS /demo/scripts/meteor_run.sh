#!/bin/bash

path=
projectname=
serverip=localhost
port=3000
is_setup=0
db_process=
db_up=1

function meteor_run {
	while [ $db_up == 1 ]; do
		mongo --eval "db.stats()"
		db_up=$?
	done
	echo "Runnning..."
	cd $path
	export MONGO_URL="mongodb://localhost:27017/$projectname"
	export ROOT_URL="http://$serverip"
	export PORT="$port"
	node main.js
	echo "Shutting down..."
}

function check_setup {
	#Check wether any setup needs to be done
	if [ -d "$path/programs/server/node_modules" ]; then
		is_setup=1
	fi
}

function setup {
	cd "$path/programs/server"
	npm install
	if [ -id "$path/programs/server/npm/npm-bcrypt/node_modules/bcrypt" ]; then
		rm -rf "$path/programs/server/npm/npm-bcrypt/node_modules/bcrypt"
		npm install bcrypt
	fi
}

function unwrap {
	if [ ! -d "$path" ]; then
		echo Unwrapping files...
		tar -xzf "$path.tar.gz"
		mv bundle "$projectname"
	fi
}

function start_db {
	echo Starting DB...
	export LC_ALL=C
	mongod --journal --dbpath /root/data/db &
}

while [ "$1" != "" ];do
	case $1 in
		-d | --directory )	shift
					path=$1
					;;
		-n | --name )	shift
				projectname=$1
				;;
		-i | --ip )	shift
				serverip=$1
				;;
		-p | --port )	shift
				port=$1
				;;
	esac
	shift
done

db_process=$(ps aux | grep -v grep | grep mongodb)
echo "$db_process"
if [ "$db_process" == "" ];then
	start_db
fi

unwrap

echo Checking setup...
check_setup

if [ $is_setup -eq 0 ]; then
	echo Setting up...
	setup
fi

meteor_run
