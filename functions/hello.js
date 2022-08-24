// Functions will be available everywhere
// These functions will only be on the server
// domain/.netlify/functions/hello

exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: "Hello World",
  };
};
