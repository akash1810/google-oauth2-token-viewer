'use strict';

const express = require('express');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const url = require('url');
const request = require('request');
const settings = require('./settings');

const runApp = (settings, oauth2Client) => {
    const host = url.parse(settings.host);
    const port = host.port || 8080;
    const callbackPath = url.parse(settings.callback).pathname;

    const app = express();

    app.get(callbackPath, (req, res) => {
        const code = req.query.code;

        oauth2Client.getToken(code, (err, token) => {
            if (token.refresh_token) {
                token.revoke_url = url.resolve(host.href, `/revoke?token=${token.refresh_token}`);
            }

            res.json(token);
        });
    });

    app.get('/revoke', (req, res) => {
        const token = req.query.token;

        if (token) {
            request(`https://accounts.google.com/o/oauth2/revoke?token=${token}`, (error, response, body) => {
                if (error) {
                    console.error(error);
                    res.status(500).send(error).end();
                }else {
                    response.statusCode === 200 ?
                        res.json({auth: url.resolve(host.href, '/')}) :
                        res.status(response.statusCode).json(JSON.parse(body));
                }
            });
        }
        else {
            res.redirect('/');
        }
    });

    app.get('/', (req, res) => {
        res.redirect(oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: settings.scopes.join(' ')
        }));
    });

    app.listen(port, () => console.log(`Server listening on ${port}`));

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
