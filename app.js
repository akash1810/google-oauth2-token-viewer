'use strict';

const express = require('express');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const url = require('url');
const settings = require('./settings');

const runApp = (settings, oauth2Client) => {
    const host = url.parse(settings.host);
    const port = host.port || 9000;
    const callbackPath = url.parse(settings.callback).pathname;

    const app = express();

    app.get(callbackPath, (req, res) => {
        const code = req.query.code;

        oauth2Client.getToken(code, (err, token) => {
            res.json(token);
        });
    });

    app.get('/', (req, res) => {
        res.redirect(oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: settings.scopes.join(' ')
        }));
    });

    app.listen(port, () => console.log('Server listening on ' + port));

    return app;
};

if(require.main === module) {
    const oauth2Client = new OAuth2(
        settings.client_id,
        settings.client_secret,
        settings.callback
    );

    runApp(settings, oauth2Client);
}

module.exports.app = runApp;
