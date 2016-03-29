# Google OAuth2 Token Viewer

View OAuth2 token details.

## Prerequisites

- [node.js](http://nodejs.org/)

## Setup

- Install dependencies via `npm install`
- Create `settings.json` in the project root using `settings.json.template` as a template.
The `host`, `callback`, `client_id` and `client_secret` properties must match the information in the [Google API project](https://console.cloud.google.com/apis/credentials).

## Usage

- Run the app with `npm start`
- Open the `host` value from `settings.json` in a browser.

Note: A token can be revoked [here](https://security.google.com/settings/security/permissions?pli=1)
