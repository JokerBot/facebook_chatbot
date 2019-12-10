
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
 
const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "<TOKEN>"

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "blondiebytes") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	       //sendText(event.sender.id,"hi there!!")
			//sendText(event.sender.id,"I'm jabeedBot ,I can help you to know more about javeed")
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
	    let text=event.message.text
		if(event.message.text === "what is your name?")
		{
			sendText(sender,"MY name is Javeed bahsa")
		    
			
		}	
        else if(event.message.text === "send image")
		{
			sendImage(sender)
			
		} 
        else if(text==="hi")
		{
			//sendText(event.sender.id,"hi there, I'm javeedBot. I can help you to know more about javeed")
			
				
				sendButton(sender,text)
		    
		}		
		else if (event.message && event.message.text) {
			
			sendText(sender, "Text echo: " + text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	sendRequest(sender,messageData)
}


function sendImage(sender)
{
	let messageData={"attachment":{
      "type":"image", 
      "payload":{
        "url":"https://diethics.com/wp-content/uploads/2013/09/summer-planning.jpg", 
        "is_reusable":true
      }
    }
    }
	sendRequest(sender,messageData)
}

function sendButton(sender,text)
{let messageData={
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
        "buttons":[
          {
            "type":"postback",
            "title":"hello",
			"payload":"hello"
          }
        ]
      }
    }
  }
	
	sendRequest(sender,messageData)
	
}

//common send point
function sendRequest(sender,messageData)
{
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})

