'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    
    const { from, to, filename } = event;

    S3.copyObject({
        Bucket: to,
        CopySource: `${from}/${filename}`,
        Key: filename,
        ACL: 'public-read'
    }).promise()
        .then(
            () => 
                S3.deleteObject({
                    Bucket: from,
                    Key: filename
                }).promise()
        )
        .then(() => {
            
            console.log(`Successfully moved ${filename} from ${from} to ${to}`);
            callback(null);
        })
        .catch((error) => {

            console.error(`Error moving ${filename} from ${from} to ${to}`, error);
            callback(error);
        });
};
