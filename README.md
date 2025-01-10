# Retireup Sample API App

This repo has been archived and will no longer receive updates.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and uses an Express server as a proxy to the Retireup API.

## Using this project

Download or Clone the project then change into the directory and install the dependencies.

```bash
git clone https://github.com/retireupinc/retireup-sample-api-app.git
cd retireup-sample-api-app
nvm i
npm i
```

Create a `.env` file for environment variables in your server.
Copy the .env.sample -> .env as a starting point.

You can start the server on its own with the command:

```bash
npm run server
```

Run the React application on its own with the command:

```bash
npm start
```

Run both applications together with the command:

```bash
npm run dev
```

The React application will run on port 8000 and the server on port 8001.
