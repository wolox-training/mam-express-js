const { factory } = require('factory-girl');

const { factoryWithCustomizedValue } = require('./factory_by_models');

const modelName = 'users';

factoryWithCustomizedValue(modelName, 'deletedAt', null);

module.exports = {
  create: userData => factory.create(modelName, userData)
};
