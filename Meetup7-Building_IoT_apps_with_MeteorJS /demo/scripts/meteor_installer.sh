#!/bin/bash
echo UPDATING SYSTEM SOFTWARE - UPDATE
apt-get update
echo UPDATING SYSTEM SOFTWARE - UPGRADE
apt-get dist-upgrade
echo "deb http://mirrordirector.raspbian.org/raspbian/ jessie main contrib non-free rpi" > /etc/apt/sources.list.d/jessie.list
apt-get update
echo INSTALLING MONGODB
apt-get install build-essential debian-keyring autoconf automake libtool flex bison mongodb
echo CLEANING UP
apt-get autoremove --purge
apt-get clean
rm /etc/apt/sources.list.d/jessie.list
mkdir /root/data
mkdir /root/data/db
apt-get udpate
echo INSTALLING NODE.JS
wget http://conoroneill.net.s3.amazonaws.com/wp-content/uploads/2015/07/node-v0.10.40-linux-arm-v7.tar.gz
tar -zxvf node-v0.10.40-linux-arm-v7.tar.gz
cd usr/local
sudo cp -R * /usr/local/
npm install -g npm
apt-get install git-core git scons build-essential scons libpcre++-dev libboost-dev libboost-program-options-dev libboost-thread-dev libboost-filesystem-dev
echo INSTALLING SCREEN AND OTHER DEPENDENCIES
apt-get install screen
apt-get install dtrx
echo DONE
