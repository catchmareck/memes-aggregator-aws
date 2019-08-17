'use strict';

const scrap = require('../helpers/scrap-images');

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const BUCKET_IMAGES_LIMIT = Number(process.env.SL_BUCKET_IMAGES_LIMIT);
const WEBSITES_URLS = process.env.WEBSITES_URLS.split(',');

exports.handler = (event, context, callback) => {

    lambda.invoke({
        FunctionName: 'memes-aggregator-dev-checkCapacity'
    }).promise()
        .then((result) => {

            const response = JSON.parse(result.Payload.toString());
            const { imagesCount } = response;

            if (imagesCount === BUCKET_IMAGES_LIMIT) return callback(null);

            scrap(WEBSITES_URLS, (imageUrls) =>{

                imageUrls.forEach((url) => {

                    lambda.invoke(
                        {
                            FunctionName: 'memes-aggregator-dev-saveImage', 
                            Payload: JSON.stringify({ url, bucket: process.env.AMS3_BUCKET_NAME }),
                            InvocationType: 'Event'
                        },
                        (err) => {
                            
                            if (err) console.error(err, err.stack);
                        }
                    );
                });
                callback(null);
            });
        })
        .catch(callback);
};
