/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Reef-Pi!!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

const GetEquipmentOverviewHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetEquipmentOverviewIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';

    await getRemoteData('https://my-json-server.typicode.com/stvnmbr1/demo/posts')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.length} pieces of equipment setup. `;
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            //first record
            if(data[i].on==true){
            outputSpeech = outputSpeech + 'They are: ' + data[i].name + ' connected to pin ' + data[i].outlet + ' which is enabled ' + ', '
            } else if (data[i].on==false) {
              outputSpeech = outputSpeech + 'They are: ' + data[i].name + ' connected to pin ' + data[i].outlet + ' which is disabled ' + ', '
            }
          } else if (i === data.length - 1) {
            //last record
            if(data[i].on==true){
            outputSpeech = outputSpeech + 'and ' + data[i].name + ' connected to pin ' + data[i].outlet + ' which is enabled ' + '.'
            } else if (data[i].on==false) {
              outputSpeech = outputSpeech + 'and ' + data[i].name + ' connected to pin ' + data[i].outlet + ' which is disabled ' + '.'
            }
          } else {
            //middle record(s)
            if(data[i].on==true){
            outputSpeech = outputSpeech + data[i].name + ' connected to pin ' + data[i].outlet + ' which is enabled' + ', '
            } else if (data[i].on==false) {
              outputSpeech = outputSpeech + data[i].name + ' connected to pin ' + data[i].outlet + ' which is disabled'+ ', '
            }
          }
        }
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};

const GetOutletOverviewHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetOutletOverviewIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';

    await getRemoteData('https://my-json-server.typicode.com/stvnmbr1/demo/comments')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `There are currently ${data.length} records. `;
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speechText = 'Hello World!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetEquipmentOverviewHandler,
    GetOutletOverviewHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
