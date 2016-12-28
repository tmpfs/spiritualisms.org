# Database Server

## Build

To build the docker image:

```
docker build -t spiritualisms-couchdb -f docker/couchdb .
```

And then run the image locally:

```
docker run -d -p 5984:5984 -v /opt/couchdb/data:/opt/couchdb/data spiritualisms-couchdb
```

You should already have the administrator password otherwise it can be set (or rotated) by configuring the `[admins]` section in `local.ini` to a plain text password, running the container and extracting the encrypted pbkdf2 login information:

```
docker exec -it 79bbefd98988 bash
cat /usr/local/etc/couchdb/local.ini | grep spiritualisms
```

Copy the password into the `local.ini` file in the repository removing the plain text version. You may now commit the `local.ini` file to the repository.

## Server

Create an Amazon EC2 instance exposing ports 22, 80, 5984 and 6379 then SSH to the server using the supplied PEM file you can then connect to the server via SSH:

```
ssh -i ~/.ssh/spiritualisms-db.pem ec2-user@ec2-54-251-184-147.ap-southeast-1.compute.amazonaws.com
```

## Installation

Install and start docker:

```
sudo yum install -y docker ; sudo service docker start
```

Check the docker installation:

```
sudo docker ps
```

Create the directory on the host that will be the volume for the databases:

```
sudo mkdir -p /opt/couchdb/data
```

Pull the `couchdb` and `redis` tags from the ECR repository, see the [pull ecr guide](http://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-pull-ecr-image.html).

1. Configure the aws credentials `aws configure` and use the `spiritualisms` access key id and secret key.
2. Get the docker login command `aws ecr get-login --region ap-southeast-1`.
3. Execute the printed login command. Prefix the command with `sudo`.
4. Inspect the repositories: `aws ecr describe-repositories`.
5. List the images `aws ecr list-images --repository-name spiritualisms`
6. Pull the image using the `registryId` for `AWS_ACCOUNT_ID` printed in step 4.

```
sudo docker pull {AWS_ACCOUNT_ID}.dkr.ecr.ap-southeast-1.amazonaws.com/spiritualisms:couchdb

sudo docker pull {AWS_ACCOUNT_ID}.dkr.ecr.ap-southeast-1.amazonaws.com/spiritualisms:redis
```

Check the images list:

```
sudo docker images
```

## Configure

Configure the host system by copying the contents of [rc.local](/conf/rc.local) to `/etc/rc.local`:

Restart the machine `sudo reboot`, reconnect with SSH and verify the services are running:

```
sudo docker ps
```

## DNS

Map the domain name `db.spiritualisms.org` to the IP address of the instance in Route53 so that the database is available via a hostname.

Wait for the DNS to propagate before proceeding.

## Verify

You can now test the services with:

```
curl -I http://db.spiritualisms.org:5984
redis-cli -h db.spiritualisms.org
```

## Bootstrap

You should have [rlx][] installed to bootstrap the default data.

Configure an alias `spiritualisms` pointing to `http://db.spiritualisms.org:5984` than bootstrap the application data. You will need to supply the admin password for authentication and create the application user `spiritualisms-appuser`.

```
./sbin/bootstrap :spiritualisms
```

[rlx]: https://github.com/tmpfs/rlx
