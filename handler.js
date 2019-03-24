
const AWS = require('aws-sdk');

const App = require('./app.js');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
});

const app = new App(dynamoDb);

exports.readItem = async (event, context) => {
  return app.readItem(event.queryStringParameters.id, context);
};
exports.createItem = async (event, context) => {
  return app.createItem(JSON.parse(event.body), context);
};
