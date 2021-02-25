const handle = require('../lib/errorHandling')().handle;

module.exports = async (recipients, template, vars) => {
    /*
    recipients -> [{email: 'a@a.com', name: 'john'}, {email: 'b@b.com', name: 'doe'}]
    template -> email .pug template
    vars -> variables to use in the email template. Must be an array and the same size as recipients. Position inside array determine in which email it will be available
    */

    const keys = require('../keys')();
    const Email = require('email-templates');

    const fromMail = keys.configEmail.email;
    const webUrl = keys.webUrl;

    const { google } = require('googleapis');
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
        keys.google.clientID,
        keys.google.clientSecret,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
        refresh_token: keys.google.refreshToken
    });

    const accessToken = oauth2Client.getAccessToken();

    let message = {
        from: fromMail
    }
    // if (vars.file0) {
    //     if (vars.file0.name) {
    //         message.attachments = [{
    //             filename: vars.file0.name,
    //             content: vars.file0
    //         }]
    //     }
    // }

    const email = new Email({
        views: { root: __dirname },
        message: message,
        transport: {
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: keys.configEmail.email,
                clientId: keys.google.clientID,
                clientSecret: keys.google.clientSecret,
                refreshToken: keys.google.refreshToken,
                accessToken: accessToken
            }
        }

    })

    for (let i = recipients.length - 1; i >= 0; i--) {
        let [result, err] = await handle(email.send({
            template: template,
            message: {
                to: recipients[i].email
            },
            locals: {
                name: recipients[i].name,
                webUrl: webUrl,
                vars: vars[i]
            }
        }));

        if (err) return err;
    }
    return 0;
}