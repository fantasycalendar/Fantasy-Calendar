'use strict';

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    headers['x-forwarded-host'] = [ {
        key: 'X-Forwarded-Host',
        value: 'lambda-dev.fantasy-calendar.com'
    }];

    callback(null, request);
};
