const AWS = require('aws-sdk');
const test = require('ava');
const sinon = require('sinon');

const App = require('../../app.js');
const lib = require('../../lib.js');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sandbox = sinon.createSandbox();

let event, context, stub;
test.after('restore stubbed functions to original', async t => {
  stub = sandbox.restore();
});

test('test readItem by stubbing', async t => {
  //making DynamoDb's get method to return our specified item
  stub = sandbox.stub(dynamoDb, 'get');
  stub.callsFake(() => ({
    promise() {
      return Promise.resolve({
        item: {
          key1: "value1"
        }
      });
    },
  }));
  //injecting stubbed dynamoDb into our business logic
  const app = new App(dynamoDb);

  try {
    let result = await app.readItem("one");
    t.is(result.statusCode, 200)
    t.is(JSON.parse(result.body).message.item.key1, "value1")
  } catch (e) {
    t.fail(e)
  }
})
test('test createItem by stubbing', async t => {
  stub = sandbox.stub(dynamoDb, 'put');
  stub.callsFake(() => ({
    promise() {
      return Promise.resolve({});
    },
  }));

  const app = new App(dynamoDb);

  try {
    let result = await app.createItem({
      id: "testid",
      "message":" this is a test message"
    });
    t.is(result.statusCode, 201)
    t.is(JSON.parse(result.body).message, "success")
  } catch (e) {
    t.fail(e)
  }
})

test('test responseFactory', t => {
  let result = lib.responseFactory(200, 'test');
  t.deepEqual(result, {body: JSON.stringify({message: 'test'}), statusCode: 200})
})
