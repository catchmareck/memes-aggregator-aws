'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB();

const { CELEBRITY_NAME } = process.env;

exports.handler = (event, context, callback) => {

    const { Records: [ { s3: { object: { key: filename }, bucket: { name: bucket } } } ] } = event;
    const url = `https://${bucket}.s3.amazonaws.com/${filename}`;
    
    dynamoDb.putItem({
        Item: {
            MemeUrl: {
                S: url
            },
            MemeName: {
                S: CELEBRITY_NAME
            }
        },
        TableName: 'Memes'
    }).promise()
        .then(() => {
            
            console.log(`Successfully saved ${url} as ${CELEBRITY_NAME} in the DB`);
            callback(null);
        })
        .catch((error) => {
            
            console.error(`Error saving ${url} in the db`, error);
            callback(error);
        })
};
