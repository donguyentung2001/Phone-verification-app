const express = require('express')
const cors = require('cors')
//require twilio to text message
const twilio = require('twilio')
//require firebase to read and write firebase database
const firebase=require('firebase')
//require bodyparser to handle JSON data in post request
const bodyParser = require('body-parser')

//we set our port for the backend URLs at http://localhost:4000
const port = 4000

//set accountsID and authToken for new Twilio client
const accountSid='ACbd7092eb9e21bc4a04038a2c589a0375' 
const authToken='0feb7eb938bd5cd6a9b5e6086f76e605'
const client = new twilio (accountSid, authToken)

//create express app
const app = express()

//add cors to our app 
app.use(cors()) 
// add bodyParser to our app
app.use(bodyParser.json());
//create a message variable that is displayed whenever the access code is verified to be true or false
var message=""; 


function getRandomInt(min, max) { 
    //generate a random 6-digit number, which will be used as our access code
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
}

//configure our firebase database
var config = {
    apiKey: "AIzaSyA1sYER8Ftj6lzofj1R29_jtr5V6ZNYL18",
    authDomain: "texting-b1b47.firebaseapp.com",
    databaseURL: "https://texting-b1b47-default-rtdb.firebaseio.com/",
    storageBucket: "texting-b1b47.appspot.com" 
  };
  firebase.initializeApp(config);

function replaceAcccessCode(phoneNumber, key) { 
  //replace our access code with the given phoneNumber and the given key to "", which we will do once the number hsa been verified
  firebase.database().ref('phoneNumber/' + key).set({ 
    recipient: phoneNumber, 
    access_code: "", 
  })
}

function CreateNewAccessCode(phoneNumber) { 
  //create a pair of phoneNumner-accessCode and push them to the database
  //return the access code 
  var database = firebase.database().ref().child("phoneNumber");
  const accessCode=getRandomInt(100000,1000000)
  database.ref.push({recipient: phoneNumber, access_code: accessCode})
  return accessCode
}

function ValidateAccessCode(phoneNumber, accessCode) { 
  // two parameters: phone number of the user and the access code that THEY type in (not necessarily the correct one)
  // validate the access code if it is correct
  firebase.database().ref().child("phoneNumber").orderByChild('recipient').equalTo(phoneNumber).once("value", function(data) {
    //fetch the child of the firebase database with the phoneNumber corresponding to our respective parameter
    //get the list of such childs
    var list_phones=data.val()
    //get the keys of such childs as an array
    var keys=Object.keys(list_phones)
    //get the access code of the LAST child (which is the most recent access code, in case the user submits multiple times without verifying)
    phone_code=list_phones[keys[keys.length-1]].access_code
    if (phone_code == "") { 
      // if the most recent access code is "", then the number has been verified
      //we set the message appropriately to let the user know that. This message will be sent to the frontend once the access code is submitted
      message={message:"Your number has already been verified!"}
    }
    else if (phone_code == accessCode) { 
      // if the phone_code is the same as the access code, then the number is successfully verified
      message= {message: "Your number has been successfully verified!"} 
      //we replace the most recent access code with ""
      replaceAcccessCode(phoneNumber, keys[keys.length-1])
    }
    else { 
      //if the phone_code is incorrect, then we display a failure message
      message= {message: "Your access code is not correct. Please try again!"} 
    }
  })
}


app.post('/send-access-code/', (req,res) => { 
    //a backend URL that sends the phone number and access code to the database
    //this is only triggered when the phone number has been submnitted
    //get phone number
    const phoneNumber = req.body.phoneNumber
    //create new access code and sent the phone number and access code to the database
    const accessCode=CreateNewAccessCode(phoneNumber)
    //send access code to the phone number 
    client.messages.create( { 
        body: "Your access code is " + accessCode, 
        to: phoneNumber, 
        from: "+19388884702"
    }).then((message) => console.log(message.body))
})

app.post('/check-access-code/', (req,res) => { 
  //a backend URL that checks if the access code and the phone number are correct  
  // this is only triggered when the access code has been submitted
  //assign phone number and attempted access code to two variables 
  const phoneNumber = req.body.phoneNumber 
  const accessCode = req.body.accessCode
  // validate the access code 
  ValidateAccessCode(phoneNumber,accessCode)
  // wait for one second to let the database successfully fetches and compare the data, and send the response (which is a success or failure message) to the frontend
  setTimeout(function(){ 
    res.send(message) }, 1000);
  }
  
)

app.listen(port, () => {
  //print to the console when and where the app listens. 
  console.log(`listening at http://localhost:${port}`)
})