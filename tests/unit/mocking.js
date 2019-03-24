'use strict';
const AWS_MOCK = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const test = require('ava');

AWS_MOCK.setSDKInstance(AWS);

const App = require('../../app.js');
let event, context;

test.after('restore all methods and services', async t => {
  AWS_MOCK.restore();
});

test('test readItem by mocking', async t => {
  //making dynamoDb's get method to return our expected item.
  AWS_MOCK.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
    callback(null, {
      'item': {
        'key1': 'value1'
      }
    });
  });
  const DynamoDB = new AWS.DynamoDB.DocumentClient();
  // injecting db with the expected behaviour into buisness logic
  const app = new App(DynamoDB);

  try {
    let result = await app.readItem("one");
    t.is(result.statusCode, 200)
    t.is(JSON.parse(result.body).message.item.key1, "value1")
  } catch (e) {
    t.fail(e)
  }
})

test('test createItem by mocking', async t => {
  AWS_MOCK.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
    callback(null, {
      'key1': 'value1'
    });
  });
  const DynamoDB = new AWS.DynamoDB.DocumentClient();
  const app = new App(DynamoDB);

  try {
    let result = await app.createItem({
      id: "six",
      "message":" this is a test message"
    }); 
    t.is(result.statusCode, 201)
    t.is(JSON.parse(result.body).message, "success")
  } catch (e) {
    t.fail(e)
  }
})
