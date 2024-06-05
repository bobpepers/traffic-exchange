
#install NVM

```

Insert Instructions here

```

#install Mysql 8

```

Insert Instructions here


```

# Mysql8 Disable Full-group-by

```

mysql > SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

```

or change permanently
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```
[mysqld]
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
```

#install Redis

```

Insert Instructions here

```
# ssl cert localhost
https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-18-04

sudo chown -R app:app /etc/ssl/private/nginx-selfsigned.key
sudo chown -R app:app /etc/ssl/certs/nginx-selfsigned.crt

openssl req -new -sha256 \
    -out private.csr \
    -key private.key \
    -config ssl.conf 

openssl x509 -req \
    -days 3650 \
    -in private.csr \
    -signkey private.key \
    -out private.crt \
    -extensions req_ext \
    -extfile ssl.conf

openssl x509 -in private.crt -out private.pem -outform PEM
sudo cp private.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates

# NGINX Configuration

Production

```
server {
    server_name www.runesx.com;
    root /home/bago/Runebase-PTC/client/dist;
    index index.html index.htm;
    //add_header X-Frame-Options "SAMEORIGIN";
    //add_header X-Content-Type-Options nosniff;
    //add_header X-XSS-Protection "1; mode=block";
    //add_header Content-Security-Policy "frame-ancestors 'self';";

    add_header Referrer-Policy no-referrer;
    add_header X-Frame-Options "ALLOWALL";
    add_header Permissions-Policy "geolocation=(), midi=(), sync-xhr=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), fullscreen=(self), payment=()";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; frame-src *; connect-src 'self'; img-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;" always;
    add_header X-Content-Type-Options nosniff;
    client_max_body_size 5M;


    location / {
        try_files $uri /index.html;
    }
    location /uploads {
        alias /home/bago/Runebase-PTC/server/uploads;
        autoindex on;
    }
    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass         "http://127.0.0.1:8080/api/";
    }
    location /socket.io/ {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass         "http://127.0.0.1:8080/socket.io/";
    }
    listen 80;
}

```

Development

```
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    include snippets/self-signed.conf;
    include snippets/ssl-params.conf;
    server_name localhost;
    add_header X-Frame-Options "ALLOWALL";
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "frame-ancestors 'self';";
    root /home/app/Runebase-PTC;
    client_max_body_size 5M;
    
    location / {
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass         "http://127.0.0.1:8012";
    }

    location /uploads {
        alias /home/app/Runebase-PTC/app/uploads;
        autoindex on;
    }

    location /sockjs-node/ {
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:8012/sockjs-node/;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass         "http://127.0.0.1:8080/api/";
    }
    location /socket.io/ {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_pass         "http://127.0.0.1:8080/socket.io/";
    }
}

```

/etc/nginx/snippets/self-signed.conf
```
ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
```

/etc/nginx/snippets/ssl-params.conf
```
ssl_protocols TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_dhparam /etc/nginx/dhparam.pem;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
ssl_ecdh_curve secp384r1; # Requires nginx >= 1.1.0
ssl_session_timeout  10m;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off; # Requires nginx >= 1.5.9
ssl_stapling on; # Requires nginx >= 1.3.7
ssl_stapling_verify on; # Requires nginx => 1.3.7
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
# Disable strict transport security for now. You can uncomment the following
# line if you understand the implications.
# add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

# Runebase Node Configuration

```

logevents=1
daemon=1
rpcuser=runebaseinfo
rpcpassword=runebaseinfo
blocknotify= curl -X POST -d "{ \"payload\" : \"%s\"}" http://127.0.0.1:8080/api/chaininfo/block
walletnotify=curl -X POST -d %s http://127.0.0.1:8080/api/rpc/walletnotify
walletnotify=curl --header "Content-Type: application/json" --request POST --data "{ \"payload\" : \"%s\"}" http://127.0.0.1:8080/api/rpc/walletnotify
server=1

zmqpubrawblock=tcp://127.0.0.1:29000
zmqpubrawtx=tcp://127.0.0.1:29000
zmqpubhashtx=tcp://127.0.0.1:29000
zmqpubhashblock=tcp://127.0.0.1:29000


```


# Server

npm install dependencies

````

cd Runebase-PTC/server
npm install

````

.env file

````
RPC_USER=runebaseinfo
RPC_PASS=runebaseinfo

DB_NAME=test
DB_USER=newuser
DB_PASS=@123TestDBFo
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=somesupersecret

RECAPTCHA_SECRET_KEY=xx
RECAPTCHA_SITE_KEY=xx
RECAPTCHA_SKIP_ENABLED=false

ROOT_URL=http://localhost:8012

MAIL_HOST=mail.runebase.io
MAIL_PORT=587
MAIL_USER=noreply@runesx.com
MAIL_PASS=password

RUNEBASE_ENV_PATH=/home/app/runebase

SESSION_SECRET=secretpassphrase
````


## Migrations

run migrations
````
npx sequelize-cli db:migrate
````

generate a new empty migration file
````
npx sequelize-cli migration:generate --name Order-add-associations

````

undo migration
````
npx sequelize-cli db:migrate:undo
````

deploy demo seeds (development only)
````
npx sequelize-cli db:seed:all
````

generte empty seed file
````
npx sequelize-cli seed:generate --name demo-jackpot
````



# Client

npm install dependencies

````

cd Runebase-PTC/client
npm install

````
.env.development file

````
API_URL=http://localhost/api
RUNEBASE_VERSION=0.18.4
WS_ENDPOINT=http://127.0.0.1
RECAPTCHA_SITE_KEY=6LchULAZAAAAAP-dTPmPw1fUCKLuHHIkTl0TL_rk

````

.env.production file

````
API_URL=https://www.runesx.com/api
RUNEBASE_VERSION=0.18.4
WS_ENDPOINT=https://www.runesx.com
RECAPTCHA_SITE_KEY=xx

````

Commands
--------

Open the terminal and go to the folder server/ and run `npm run dev`. The server is gonna start and listen in the port 8080.

Open a new terminal and go to the folder client/ and run `npm run dev`. The client is gonna start and listen in the port 8012.

|Script|Description|
|---|---|
|`npm run dev`| Run development server |
|`npm run dev`| Run development client |
|`npm run build`| build the application to `./dist`|
|`npm start`| Start production server with pm2 from `./dist`|

