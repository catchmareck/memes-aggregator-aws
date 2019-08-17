'use strict';

const AWS = require('aws-sdk');
const AMS3 = new AWS.S3();

exports.handler = (event, context, callback) => {

    AMS3.listObjects({ Bucket: process.env.AMS3_BUCKET_NAME }).promise()
        .then((result) => {

            const imagesCount = result.Contents.length;
            callback(null, { imagesCount });
        })
        .catch(callback);
};
