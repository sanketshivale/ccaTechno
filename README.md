# CCA Admission App

A admisson portal for CCA

---
## Requirements

For development, you will only need Node.js and a node global package, NPM, installed in your environement.
mongoDB installed on server or you can go for online as well.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

## Install

    $ git clone https://github.com/sanketshivale/admissionapp
    $ cd admissionapp
    $ npm install

## Configure app

Open Editor and create .env file for your envionment. You will need to add following code:

PORT = "YOUR CHOICE PORT" (eg. PORT = 4000)
DB_URL = "mongodb://localhost:27017/demoadmission"
JWT_SECERT = "your_secret"


## Running the project

    $ npm start

## Simple build for production

    $ npm build
