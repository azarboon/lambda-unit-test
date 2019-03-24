function responseFactory(code, message) {
  return {
    'statusCode': code,
    'body': JSON.stringify({
      message: message
    })
  }
}
module.exports.responseFactory = responseFactory;
