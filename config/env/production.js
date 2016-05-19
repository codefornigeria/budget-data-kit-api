/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
    connections: {
        herokuMongoDb: {
            adapter: 'sails-mongo',
            url: process.env.MONGODB_URI
        }
    },
    models: {
        connection: 'herokuMongoDb',
    },
    settings: {
        baseUrlApi: process.env.BASE_URL_API || "http://api.verifyng.dev",
        baseUrlUi: process.env.BASE_URL_UI || "http://app.verifyng.dev",
        baseUrl: process.env.BASE_URL || "verifyng.dev",

        /*
         * JWT settings
         */
        jwtSecret: 'XSWK$F$GKw39294',
        tokenExpiryInMinutes: 5, // minutes


        /*
         * Mandrill key
         */
        mandrillKey: 'JkL0759xZOv5nR_XsKPWJA',


        /*
         * Twilio credentials
         */
        twilio: {
            sid: 'AC3bc43436d38dd24c074ace0b6eee74a7',
            token: 'b056e5bfa3c160feddc3b353cb902980'
        },

        /*
         * Stripe credentials
         */
        stripe: {
            secret: "sk_test_XkBMhPf9P4l2DtmcECQVdGqY",
            publishableKey: "pk_test_8niTRZ8f7oQfNwHqz7Li0PYv"
        },
        paystack_key: 'sk_test_4c7dc9eca8b765a8f992f0b150ca77881b04fd29',
        emailClient: 'sparkpost',
        sparkPostKey: '5dc47b9b6aef7ee5acb7cc4a466b91305d735fa0',

        sms: {
             GatewayUrl: 'https://api.infobip.com',

            GatewayUsername: 'smegenius',

            GatewayPassword: 'ds12#@35'
        },
    }
};
