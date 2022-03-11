import { core } from '@factiva/core';
const { FactivaLogger, constants } = core;
const {
  LOGGER_LEVELS: { INFO },
} = constants;
const logger = new FactivaLogger(__filename);

const myCustomFunction = (message) => {
  logger.log(INFO, 'Using my custom fuction');
  message.custom = 'Custom value';
  return message;
};

module.exports = { myCustomFunction };
