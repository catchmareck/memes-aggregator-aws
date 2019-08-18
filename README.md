# memes-aggregator-aws
AWS Lambda services for a Memes Aggregator - app which collects memes of celebrities in one place

It's built using [Serverless Framework](https://serverless.com/).

To deploy, run
```sbtshell
serverless deploy -v
```

To run the scrapper, run
```sbtshell
serverless invoke -f scrapper
```

To remove, run
```sbtshell
serverless remove
```
