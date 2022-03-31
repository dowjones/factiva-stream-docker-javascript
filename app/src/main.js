import { core, helper } from '@factiva/core';
import { tools, Stream } from '@factiva/news';
import { myCustomFunction } from './util';

const { constants, FactivaLogger } = core;
const {
  LOGGER_LEVELS: { DEBUG },
} = constants;
const { BigQueryHandler, JSONLFileHandler, Listener, MongoDBHandler } = tools;

const value = myCustomFunction({ demo: 'demo' });

const VALID_STREAM_ID = helper.loadEnvVariable('StreamId');

//To optimise connections, a connection instance can be created at the BigQueryHandler class __init__
//method to avoid a new client creation with each mesasage processing.
//All hadlers uses a message: dict & subscription_id: str as entry vars and the main function is "save"

const jsonlHandler = new JSONLFileHandler();
const mongoDB = new MongoDBHandler();
const bigQuery = new BigQueryHandler();

//Create logger instance
const logger = new FactivaLogger(__filename);
const banner = '********** MSG **********';

logger.log(
  DEBUG,
  banner.replace('MSG', 'Factiva Stream Docker Client - Start')
);
logger.log(DEBUG, 'Listener is started');

//Custom handler message_handler. On this example
//1- Take the incomming message and make a transformation defined at my_custom_function
//2- Save the message into a mongoDB
//3- Save the message in to a bigquery
//4- Save the message in to a jsonl file

const messageHandler = (message, subscriptionId) => {
  let retVal = false;
  message = myCustomFunction(message, subscriptionId);
  retVal = mongoDB.save(message, subscriptionId);
  retVal = retVal && bigQuery.save(message, subscriptionId);
  retVal = retVal && jsonlHandler.save(message, subscriptionId);
  logger.log(DEBUG, 'My custom log -  processed a message');
  messageHandler.counter += 1;
  return retVal;
};

//Create a Stream instance using a existing streamId
const stream = new Stream({ streamId: VALID_STREAM_ID });

//Use of the custom_handler to process all incomming messages
stream.setAllSubscriptions().then(() => {
  const subscription = stream.getSubscriptionByIndex(0);
  subscription.listener.listen({
    callback: messageHandler,
    maximumMessages: 10,
  });
});

//Also can be use the defined handlers directly
//listener.listen(callback=mongoDB.save, maximum_messages=100, batch_size=100)
/* stream.setAllSubscriptions().then(() => {
  const subscription = stream.getSubscriptionByIndex(0);
  subscription.listener.listen({
    callback: mongoDB.save,
    maximumMessages: 10,
  });
}); */