import React, { Component } from 'react'
import axios from 'axios'
class PhoneForm extends Component {
    //two forms, one for access code and one for phone number
	constructor(props) {
		super(props)
    //create states for two fields for our two forms, phone number and access code, respectively
		this.state = {
            phoneNumber: '',
            accessCode: '',
		}
	}
	changeHandler = e => {
        //handler for both forms when the form inputs are changed. 
        document.getElementById('displayError').innerHTML=""
        //set the state's phone number and access code to the value of their respective input when the input is changed.
		this.setState({ [e.target.name]: e.target.value })
    }
    validatePhoneNumber = (phoneNumber) => { 
        // a function that validates phone number 
        // a phone number like 4849043665 would be verified
        const phone_regex= /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return phone_regex.test(phoneNumber)
    }

	phoneSubmitHandler = e => {
        // handler when the phone form is submitted
        // prevent the form from doing its default behavior, i.e. refreshing the page
        e.preventDefault()
        // if the phone number is verified
        if (this.validatePhoneNumber(this.state.phoneNumber) === true) { 
        // once the number is verified, we display the access form, which is initially hidden
        document.getElementById("access-code-form").style.display="block"
        // disable the phone form once the phone number has been verified
        document.getElementById("phoneNumberForm").disabled=true
        // send phone number as json data to the backend at /send-access-code/, which will create an access code associated with the phone number in the database. 
        let data = JSON.stringify({
            phoneNumber: this.state.phoneNumber,
          });
		axios.post('http://127.0.0.1:4000/send-access-code/', data,{headers:{"Content-Type" : "application/json"}})
			.then(response => {
                //if post request is successful, print a success message to the console 
				console.log("Successfullly sent phone number")
			})
			.catch(error => {
                //display error message if post request is not successful
                console.log(error)
                console.log(error.response.data)
            })
        }
        else { 
            // if the phone number is not verified, we display the error message and ask the user to fill in the form again. 
            document.getElementById('displayError').innerHTML = 'Invalid phone number'
            
        }
	}

    codeSubmitHandler = e => { 
        // handler when the access code form is submitted
        // prevent default behavior of the submit click (which is refreshing the page)
        e.preventDefault()
        // we send both the phone number and access code as json data to the backend at /check-access-code/, in which we will test if they correspond
        let data = JSON.stringify({
            phoneNumber: this.state.phoneNumber,
            accessCode: this.state.accessCode,
          });
		axios.post('http://127.0.0.1:4000/check-access-code/', data,{headers:{"Content-Type" : "application/json"}})
			.then(response => {
                //if the post request is successful, we display the response sent by the backend
                //which is either success (if the access code corresponds to the phone number) or failure (otherwise)
				document.getElementById('accessMessage').innerHTML = response.data.message
			})
			.catch(error => {
                //if the post request isn't successful, print error message to the console
                console.log(error)
            })
        }
	render() {
        //assign the state's phone number and access code to two variables, phoneNumber and accessCode
		const {phoneNumber, accessCode} = this.state
		return (
			<div>
                <div> 
                    <form onSubmit={this.phoneSubmitHandler}>
                        <div>
                        <label> Enter your phone number: </label>
                            <input id="phoneNumberForm"
                                type="tel"
                                name="phoneNumber"
                                value={phoneNumber}
                                onChange={this.changeHandler}
                            />
                            <div id='displayError'></div>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div hidden id="access-code-form"> 
                    <form onSubmit={this.codeSubmitHandler}> 
                    <div>
                        <label> Enter your access code: </label>
                            <input type="text"
                                name="accessCode"
                                value={accessCode}
                                onChange={this.changeHandler}
                            />
                        </div>
                        <button type="submit">Submit</button>
                        <div id="accessMessage"> </div>
                    </form>
                </div>
			</div>
		)
    }
}



export default PhoneForm