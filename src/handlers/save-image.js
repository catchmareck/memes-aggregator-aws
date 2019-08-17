'use strict';

const http = require('http');
const https = require('https');

const { PassThrough } = require('stream');

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = (event, context, callback) => {

    const { url, bucket } = event;
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];

    let protocol = url.startsWith('https') ? https : http;
    const request = protocol.request(url, (response) => {

        if (response.statusCode < 200 || response.statusCode > 299) {

            console.error(`Image couldn't be found. (statusCode: ${response.statusCode}, url: ${url})`);
            return request.end();
        }

        const imageStream = new PassThrough();

        imageStream.on("error", function(e){

            console.error("Error while loading image: " + e + ".");
        });

        response.on("data", function(data){

            imageStream.write(data);
        });

        response.on("end", function(){

            imageStream.end();
            callback(null);
        });

        S3.upload({
            Bucket: bucket,
            Body: imageStream,
            Key: filename
        }).promise()
            .then(() => {

                console.log(`Image ${url} successfully saved in the ${bucket} bucket`);
                callback(null);
            })
            .catch((error) => {
                
                console.error('Error uploading the image to the S3', error);
                callback(error);
            });
    });
    request.end();
    request.on("error", function(e){

        console.error(e);
    });
};
