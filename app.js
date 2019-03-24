const AWS = require('aws-sdk')
const lib = require('./lib.js');
const responseFactory = lib.responseFactory;
const TABLE = (process.env.NODE_ENV === 'test') ? 'devopssec-table' : process.env.MY_TABLE;

AWS.config.update({
  region: 'eu-central-1'
});

class App {
  constructor(db) {
    this.db = db;
  }
  async createItem(item) {

    if (!item.id || !item.message) {
      return responseFactory(400, 'id or message is missing');
    }

    var params = {
      TableName: TABLE,
      Item: item
    };

    try {
      let data = await this.db.put(params).promise();
      return responseFactory(201, 'success');

    } catch (error) {

      return responseFactory(500, error);
    }
  }
  async readItem(id) {
    if (!id) {
      return responseFactory(400, 'id is missing');
    }

    var params = {
      TableName: TABLE,
      Key: {
        'id': id
      }
    };

    try {
      let data = await this.db.get(params).promise();

      if (Object.keys(data).length === 0 && data.constructor === Object) {
        return responseFactory(404, "no object was found with the given id");
      }

      return responseFactory(200, data);

    } catch (error) {
      return responseFactory(500, error);
    }
  }
}

module.exports = App;