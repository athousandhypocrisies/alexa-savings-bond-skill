
// Include the Alexa SDK v2
const Alexa = require("ask-sdk-core");
const tasks = require('./tasks');
const sbw = require('./savings_bond_lookup');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
var speechText = "";

var default_instance_id = process.env.DEFAULT_INSTANCE_ID

var params = {
  DryRun: false,
  InstanceIds: [default_instance_id]
};

const shutItDownIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'shutItDown';
  },
  handle(handlerInput) {
    //const speechText = 'The weather today is sunny.';
    return tasks.stop_the_thing(handlerInput, params);
    // return handlerInput.responseBuilder
    //   .speak(speechText)
    //   .withSimpleCard('The weather today is sunny.', speechText)
    //   .getResponse();
  }
};

const startTheEnginesIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'startTheEngine';
  },
  handle(handlerInput) {
    //const speechText = 'The weather today is sunny.';
    return tasks.start_the_thing(handlerInput, params);
    // return handlerInput.responseBuilder
    //   .speak(speechText)
    //   .withSimpleCard('The weather today is sunny.', speechText)
    //   .getResponse();
  }
};


const AskWeatherIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'isRunning';
  },
  handle(handlerInput) {
    //const speechText = 'The weather today is sunny.';
    return tasks.what_is_the_thing_doing(handlerInput, params['InstanceIds'][0]);
    // return handlerInput.responseBuilder
    //   .speak(speechText)
    //   .withSimpleCard('The weather today is sunny.', speechText)
    //   .getResponse();
  }
};

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}






const SavingsBondIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'getTheCurrentValue';
  },
  handle(handlerInput) {
    console.log(handlerInput.requestEnvelope.request.intent);
    var slots = handlerInput.requestEnvelope.request.intent.slots;
    var full_month=slots.month.value;
    var month = slots.month.value.substring(0,3);
    var Month = titleCase(month);
    var year = slots.year.value;
    var amount = slots.value.value;

    var a = new Date();
    var now = a.getFullYear() + "-" +("0" + (a.getMonth() + 1)).slice(-2);
    var next_month = a.getFullYear() + "-" + ("0" + ((a.getMonth() + 2) % 12)).slice(-2);
    
    var value = `redemp_value_${amount}_amt`;
    var p2 = sbw.get_the_values(now, next_month, year, Month);
    return p2.then( function (data) 
    {
      var outputData = sbw.for_fun(data, value);
      var speechText = sbw.getSpeechTextFromOutputData(outputData, amount, full_month, year);

      return handlerInput.responseBuilder
         .speak(speechText)
         .withSimpleCard('Savings Bond Valuator.', speechText)
         .getResponse();
    });

  }
};


// The "LaunchRequest" intent handler - called when the skill is launched
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    console.log("start");
    console.log(speechText);
    console.log(params);
  
    //return tasks.list_the_instances(handlerInput, params);
    //return tasks.start_the_thing(handlerInput, params);
    //return tasks.describe_the_thing(handlerInput, params);
    //return tasks.what_is_the_thing_doing(handlerInput, params['InstanceIds'][0]);
    //return tasks.stop_the_thing(handlerInput, params);
    const welcomeText = "Welcome to Savings Bond Wizard.  I can help you find the value of Series EE US Savings Bonds.  Be sure to include the face value and month and year of issue."
    return handlerInput.responseBuilder.speak(welcomeText).getResponse(); 
  
  }
};

// Register the handlers and make them ready for use in Lambda
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler)
  .addRequestHandlers(AskWeatherIntentHandler)
  .addRequestHandlers(startTheEnginesIntentHandler)
  .addRequestHandlers(shutItDownIntentHandler)
  .addRequestHandlers(SavingsBondIntentHandler)
  .lambda();
