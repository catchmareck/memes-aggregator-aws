'use strict';

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const rekognition = new AWS.Rekognition();
const S3 = new AWS.S3();

const { CELEBRITY_NAME } = process.env;

exports.handler = (event, context, callback) => {

    const { Records: [ { s3: { object: { key: filename }, bucket: { name: bucket } } } ] } = event;
    
    rekognition.recognizeCelebrities({
        Image: {
            S3Object: {
                Bucket: bucket,
                Name: filename
            }
        }
    }).promise()
        .then((data) => {

            if (data.CelebrityFaces.length && data.CelebrityFaces[0].Name === CELEBRITY_NAME) {

                lambda.invoke(
                    {
                        FunctionName: 'memes-aggregator-dev-moveImage',
                        Payload: JSON.stringify({filename, from: bucket, to: process.env.DMS3_BUCKET_NAME}),
                        InvocationType: 'Event'
                    },
                    (err, res) => {

                        if (err) console.error(err, err.stack);
                    }
                );
            } else {

                lambda.invoke(
                    {
                        FunctionName: 'memes-aggregator-dev-deleteImage',
                        Payload: JSON.stringify({filename, bucket}),
                        InvocationType: 'Event'
                    },
                    (err) => {

                        if (err) console.error(err, err.stack);
                    }
                );
            }
        })
        .catch((error) => {
            
            console.error('Error contacting Rekognition', error);
            callback(error);
        })
};
