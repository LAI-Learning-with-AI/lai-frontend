# lai-frontend

## Installation
### Repo Setup
Install the latest version of nodejs:  
- https://nodejs.org/en

Clone this repository:
```sh
git clone https://github.com/LAI-Learning-with-AI/lai-frontend
```
Then install dependencies with:
```sh
npm install --global yarn
cd lai-frontend
yarn install
```
Then rename ```.env.sample``` to ```.env``` and add backend ```FLASK_API``` server URL to ```VITE_SERVER```

### Auth0 Setup 
- Create an account on [Auth0](https://auth0.com/signup)
- Follow these [instructions](https://auth0.com/docs/quickstart/spa/react/01-login#configure-auth0) to set up and configure a Auth0 Single Page Application.
  - Add ```http://localhost:5173``` to ```Allowed Callback Urls```
  - Add ```http://localhost:5173``` to ```Allowed Logout Urls```
  - Add ```http://localhost:5173``` to ```Allowed Web Origins```
  - Add ```http://localhost:5173``` to ```Allowed Origins (CORS)``` under ```Cross-Origin Authentication```
- Fill in ```.env``` with ```Domain``` for ```VITE_AUTH0_DOMAIN```, ```Client ID``` for ```VITE_AUTH0_CLIENTID```, ```http://localhost:5173``` for ```VITE_AUTH0_CALLBACK```, and ```http://localhost:5173``` for ```VITE_AUTH0_LOGOUT```


## Run
Run with:
```sh
yarn dev
```
