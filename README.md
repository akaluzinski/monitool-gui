Monitool GUI
=======================


Project setup
-----------------

Install nodejs
---
```
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
```
Type 'npm' in terminal to make sure that Node.js has been installed correctly

Install grunt
---
```
sudo npm install -g grunt-cli
```

Install Node.js dependencies
---
```
sudo npm install
```

Install bower
---
```
sudo npm install -g bower
```

Install and copy bower dependencies
---
```
bower install
grunt bower:copy
```

Build project
---
```
grunt build
```
