const { SessionsClient } = require("@google-cloud/dialogflow-cx");

// Initialize Dialogflow client using service account credentials from environment variables
// Fallback to JSON file if environment variables fail
let dialogflowClient;

try {
  dialogflowClient = new SessionsClient({
    apiEndpoint: `${process.env.LOCATION}-dialogflow.googleapis.com`,
    credentials: {
      type: process.env.FUNDIFY_TYPE,
      project_id: process.env.FUNDIFY_PROJECT_ID,
      private_key_id: process.env.FUNDIFY_PRIVATE_KEY_ID,
      private_key: process.env.FUNDIFY_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Convert escaped newlines to actual newlines
      client_email: process.env.FUNDIFY_CLIENT_EMAIL,
      client_id: process.env.FUNDIFY_CLIENT_ID,
      auth_uri: process.env.FUNDIFY_AUTH_URI,
      token_uri: process.env.FUNDIFY_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FUNDIFY_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FUNDIFY_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FUNDIFY_UNIVERSE_DOMAIN,
    },
  });
} catch (error) {
  console.log("Failed to initialize with environment variables, falling back to JSON file...");
  dialogflowClient = new SessionsClient({
    apiEndpoint: `${process.env.LOCATION}-dialogflow.googleapis.com`,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
}

async function detectIntentText(
  client,
  sessionId, //WA Number
  text,
  languageCode = "en"
) {
  // Define session path
  const sessionPath = client.projectLocationAgentSessionPath(
    process.env.PROJECTID,
    process.env.LOCATION,
    process.env.AGENTID,
    sessionId
  );

  // The request to send to Dialogflow CX
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text || "My message didn't deliver correctly",
      },
      languageCode: languageCode,
    },
    analyzeQueryTextSentiment: true,
  };

  try {
    // Send request to Dialogflow CX and get response
    const [response] = await client.detectIntent(request);

    const responseMessage =
      response.queryResult?.responseMessages?.[0]?.text?.text?.[0];
    return responseMessage;
  } catch (error) {
    console.log(error);
    return "Something went wrong while communicating. Please try again later!";
  }
}

module.exports = {
  detectIntentText,
  dialogflowClient,
};
