# sdk-sandbox

This is a reference implementation for integrating with the [OpenSolar SDK](https://developers.opensolar.com/sdk/). This implementation relies on the [React library](https://www.npmjs.com/package/ossdk-react) for the OpenSolar SDK.


# Introduction

This reference implementation demonstrates how the OpenSolar SDK could be integrated into a platform. This includes a simple integration along with a range of features that are exposed via the SDK.

# Getting Started

Starting the app
1. Create a `.env.local` file based on the provided `example.env`.
2. Fill in the values for the variables.
3. Run `source .env.local`
4. Run `yarn` to install dependencies
4. Run `yarn start` to start the dev server

## Environment Variables
- REACT_APP_OS_APP_ROOT = URL for the OpenSolar SPA.
- REACT_APP_OS_API_ROOT = URL for the OpenSolar API.
- REACT_APP_OS_SCRIPT_LOCATION = URL from where the SDK Script will be downloaded.
- REACT_APP_OS_SDK_KEY = Key to be supplied by OpenSolar which verifies that this is an approved implementation of OSSDK.
- REACT_APP_LOGIN_METHOD = Either `jwt` or `sso`.
- REACT_APP_OS_ORG_ID = Your Org's ID.
- REACT_APP_OS_TOKEN = The token to use for authentication.
- REACT_APP_PROJECT_CONFIG_IDS = *optional*. A csv line of Project Configuration IDs that can be applied to a project.

For values of these environment variables and SDK [configuration](https://developers.opensolar.com/sdk/learn/configuration) values, please speak to [Partners Services](https://www.opensolar.com/partner-services/).

# References

* [SDK documentation](https://developers.opensolar.com/sdk/) for guides to get started and detailed information about the SDK. 
* [OpenSolar React library](https://www.npmjs.com/package/ossdk-react) for the SDK can be found on NPM.
* See the demo live online (Coming soon)


# License

MIT