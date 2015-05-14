# Monitool GUI Setup #

### Prepare environment ###

Note: in some cases use administrative privileges.

Install nodejs, grunt and bower.

```
curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get install -y nodejs
```
Type 'npm' in terminal to make sure that Node.js has been installed correctly

Install grunt
```
npm install -g grunt-cli
```

Install bower
```
npm install -g bower
```
To run project as standalone web application, having http server is obligatory. We can install it from npm package, http-server.
```
npm install -g http-server
```

## Clone and build project ##
Clone repo
```
cd /var/www
git clone https://github.com/monitool/monitool-gui.git
cd monitool-gui
```

Install Node.js dependencies
```
npm install
```

Install and copy bower dependencies
```
bower install
grunt bower:copy
```

Build project
```
grunt build
```

##Run http server##
```
http-server -a localhost
```

Open [http://localhost:8080/](http://localhost:8080/) in your browser to launch application.
