// Tasks for the skill
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-1'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

function parse_current_state(data)
{
  console.log('[tasks] parse current state');
  var reservation = data['Reservations'][0];
  var instance = reservation['Instances'][0];
  return instance['State']['Name'];
}

function what_is_the_thing_doing(handlerInput, theThing)
{
  console.log("[tasks] what_is_the_thing_doing");
  var instance = [];
  instance.push(theThing);
  var localParams = {};
  localParams['DryRun'] = false;
  localParams['InstanceIds'] = instance;
  console.log(localParams);
  
  var request = new AWS.EC2({apiVersion: '2014-10-01'}).describeInstances(localParams);
  
    // create the promise object
    var promise = request.promise();
    
    // handle promise's fulfilled/rejected states
    // We return the promise and put returns inside the promise functions, so 
    // we pass through the return value
    return promise.then(
      function(data) {
        var speechText = "Captain; the instance is " + parse_current_state(data);
        console.log(speechText);
        // Speak out the speechText via Alexa
        return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      },
      function(error) {
       var speechText = "No dice captain!";
       console.log(speechText);
       return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      }
  
    );
  
}


function parse_start_state(data)
{
  console.log("[tasks] parse_start_state");
  return data['StartingInstances'][0]['CurrentState']['Name'];
}


function parse_stop_state(data)
{
  console.log("[tasks] parse_stop_state");
  return data['StoppingInstances'][0]['CurrentState']['Name'];
}



function stop_the_thing(handlerInput, params)
{
  console.log("[tasks] stop_the_thing");
  console.log(params); 
    var request = new AWS.EC2({apiVersion: '2014-10-01'}).stopInstances(params);
  
    // create the promise object
    var promise = request.promise();
    
    // handle promise's fulfilled/rejected states
    // We return the promise and put returns inside the promise functions, so 
    // we pass through the return value
    return promise.then(
      function(data) {
        var speechText = "eye eye captain; new state is " + parse_stop_state(data);
        console.log(speechText);
        // Speak out the speechText via Alexa
        return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      },
      function(error) {
       var speechText = "No dice captain!";
       console.log(speechText);
       return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      }
  
    );
}

function start_the_thing(handlerInput, params)
{
  console.log("[tasks] start_the_thing");
  console.log(params); 
    var request = new AWS.EC2({apiVersion: '2014-10-01'}).startInstances(params);
  
    // create the promise object
    var promise = request.promise();
    
    // handle promise's fulfilled/rejected states
    // We return the promise and put returns inside the promise functions, so 
    // we pass through the return value
    return promise.then(
      function(data) {
        var speechText = "eye eye captain; new state is " + parse_start_state(data);
        console.log(speechText);
        // Speak out the speechText via Alexa
        return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      },
      function(error) {
       var speechText = "No dice captain!";
       console.log(speechText);
       return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      }
  
    );
}


function get_ip_address(data) {
        console.log("[tasks] get_ip_address()")
        console.log("call made - parsing result");
        console.log(data);
        var reservation = data['Reservations'][0];
        var instance = reservation['Instances'][0];
        var network_interface = instance['NetworkInterfaces'][0];
        var ni_pi = network_interface['PrivateIpAddresses'][0];
        var pi = ni_pi['PrivateIpAddress'];
        //console.log("Success", JSON.stringify(data['Reservations'][0]['Instances'][0]));
        console.log("Success", JSON.stringify(pi));
        var speechText = JSON.stringify(pi);
        console.log(speechText)
        return speechText;
      }


  
  
function get_names(data)
{
  console.log("[tasks] get_names()")

  var results = [];
  for (const reservation of data['Reservations'])
  {
    console.log("reservation");
    for (const instance of reservation['Instances'])
    {
      console.log("instance");
      for (const tag of instance['Tags'])
      {
        if (tag['Key'] == 'Name')
        {
          var row = {};
          row['InstanceId'] = instance['InstanceId'];
          row['Name'] = tag['Value'];
//        results.push(row);
          results.push(tag['Value']);
        }
      }
    }
  }
  console.log(results.join(" "));
  return results.join(" ");
}


function list_the_instances(handlerInput, params)
{
    console.log("[tasks] list_the_instances");
  console.log(params); 
    var request = new AWS.EC2({apiVersion: '2014-10-01'}).describeInstances();
  
    // create the promise object
    var promise = request.promise();
    
    // handle promise's fulfilled/rejected states
    // We return the promise and put returns inside the promise functions, so 
    // we pass through the return value
    return promise.then(
      function(data) {
        var speechText = get_names(data);
        console.log(speechText);
        // Speak out the speechText via Alexa
        return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      },
      function(error) {
       var speechText = "No dice captain!";
       console.log(speechText);
       return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      }
  
    );
  
}
  
function describe_the_thing(handlerInput, params)
{
    console.log("[tasks] describe_the_thing");
  console.log(params); 
    var request = new AWS.EC2({apiVersion: '2014-10-01'}).describeInstances(params);
  
    // create the promise object
    var promise = request.promise();
    
    // handle promise's fulfilled/rejected states
    // We return the promise and put returns inside the promise functions, so 
    // we pass through the return value
    return promise.then(
      function(data) {
        var speechText = get_ip_address(data);
        console.log(speechText);
        // Speak out the speechText via Alexa
        return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      },
      function(error) {
       var speechText = "No dice captain!";
       console.log(speechText);
       return handlerInput.responseBuilder.speak(speechText).getResponse();     /* process the data */
      }
  
    );
}
  
exports.what_is_the_thing_doing = what_is_the_thing_doing;
exports.start_the_thing = start_the_thing;
exports.stop_the_thing = stop_the_thing;
exports.describe_the_thing = describe_the_thing;
exports.list_the_instances = list_the_instances;