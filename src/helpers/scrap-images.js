'use strict';

const Crawler = require('crawler');

const ALLOWED_EXTENSIONS = new Set(process.env.SL_ALLOWED_IMG_EXTENSIONS.split(','));

module.exports = (websiteUrls, callback) => {
    
    const crawler = new Crawler({
        maxConnections: 10,
        callback : (error, res, done) => {
            
            let imageUrls = [];
            
            if (error) {
                
                console.error(error);
            } else {
                
                const { $ } = res;
                const urlSet = new Set();
                $("img").each(function () {

                    const src = $(this).attr('src');
                    const ext = src ? src.substring(src.lastIndexOf('.') + 1) : '';
                    const hasComma = src ? src.indexOf(',') !== -1 : false;

                    console.log(src);
                    if (ALLOWED_EXTENSIONS.has(ext.toLowerCase()) && !hasComma && !urlSet.has(src)) {

                        imageUrls.push(src);
                        urlSet.add(src);
                    }
                });
            }
            
            callback(imageUrls);
            done();
        }
    });

    crawler.queue(websiteUrls);
};
