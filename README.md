# memcached over http server and containerized using Docker
Run a memcached server, and http server with nodejs. Use cache to Set and Get data over a database

Using docker
For mac use command line tools to start/stop docker. Docker desktop app doesnt work for most of the time
Ref: https://github.com/abiosoft/colima

➜ brew install colima
➜ colima start

➜ colima status

INFO[0001] colima is running using QEMU

INFO[0001] arch: aarch64

INFO[0001] runtime: docker

INFO[0001] mountType: sshfs

INFO[0001] socket: unix:///Users/rpatani/.colima/default/docker.sock

This will start the docker daemon

Now in your branch
Create a Dockerfile exposing the packages and port

Build 'your-app-name' docker image

Pull the Memcached Docker Image:
First, pull the official Memcached Docker image from Docker Hub. Open your terminal and run the following command:
docker pull memcached 

Create a docker-compose.yaml file with the 2 services details of your-app-name and my-memcached

Run the containers in detached mode
docker-compose up -d

To stop both containers
docker-compose down
