### Phone verification app 

## Description 
An app that verifies phone number by access code, created with Express backend, React frontend, Firebase Realtime Database, and Twilio messaging service. 
## How to run 

First, install the dependencies by: 
```
npm install
```
You need to sign up for a Twilio account and replace the accountsid and authToken in server/index.js with yours (line 14, 15). Additionally, replace the "from" field of client.messages.create (line 103)  with your Twilio phone number. 

Run the Express backend in /texting/server by: 
```
node index.js
```

Run the React frontend in /texting/ by: 
```
yarn start
```
The localhost runs at http://localhost:3000/ 

## Demonstration 
I filmed a video where I demonstrate the app here: https://youtu.be/LspJskFx3EM
