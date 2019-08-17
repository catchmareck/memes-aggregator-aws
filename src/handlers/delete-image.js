'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    
    const { filename, bucket } = event;

    S3.deleteObject({
        Bucket: bucket,
        Key: filename
    }).promise()
        .then(() => {

            console.log(`Image ${filename} does not look like current celebrity`);
            callback(null);
        })
        .catch((error) => {

            console.error(`Error deleting ${filename} from ${bucket}`, error);
            callback(error);
        });
};
