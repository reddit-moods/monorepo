"""
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
"""

import json
import praw
import os

from transformers import pipeline
from collections import Counter


def initialize_pipeline():
    # Taking in the text string - wen is so hot
    # Tokenize -> converts the letters into integer code format
    # Feeds those codes into the model
    # Calls model to get predictions -> probability (confidence of the model)
    # - Predictions:
    #   - 0
    #   - 1
    #   - 2
    # Then we're done
    MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
    nlp = pipeline("sentiment-analysis",
                   model=MODEL
                   )
    return nlp


def label_to_pred(label: str):
    """Label should be one of LABEL_0, LABEL_1 or LABEL_2
    """
    idx = label.split("_")[1]
    if not idx.isdigit():
        return f"Bad prediction label: {label}"

    label_idx = int(idx)
    mappings = ["Negative", "Neutral", "Positive"]
    return mappings[label_idx]


nlp_pipeline = initialize_pipeline()


def handler(event, context):
    qs = event["queryStringParameters"]
    print("event: ", event["queryStringParameters"])
    if qs is None:
        return {
            "statusCode": 400,
            "body": "need to send query string parameters"
        }

    if not "subreddit" in qs:
        return {
            "statusCode": 400,
            "body": "subreddit param missing from query string"
        }

    print("type: ", type(qs["subreddit"]))
    subreddit = qs["subreddit"]

    print("REDDIT_CLIENT_ID: ", os.environ['REDDIT_CLIENT_ID'])
    print("REDDIT_CLIENT_SECRET: ", os.environ['REDDIT_CLIENT_SECRET'])
    print("REDDIT_USER_AGENT: ", os.environ['REDDIT_USER_AGENT'])

    try:
        # initialize praw
        reddit = praw.Reddit(
            client_id=os.environ['REDDIT_CLIENT_ID'],
            client_secret=os.environ['REDDIT_CLIENT_SECRET'],
            user_agent=os.environ['REDDIT_USER_AGENT']
        )

        # Send a raw API request to reddit to fetch the 25 hottest
        headings = []
        for submission in reddit.subreddit(subreddit).hot(limit=25):
            headings.append(submission.title)

        print("Headings: ", headings)
        # running model on each heading
        model_result = nlp_pipeline(subreddit)

        print("Model Result: ", model_result)

        # find most common label
        label_counts = Counter(heading['label'] for heading in model_result)
        most_common_label = label_counts.most_common(1)[0][0]

        # average the predict of the most common label
        total_score = 0
        count = 0
        for h in model_result:
            if h['label'] == most_common_label:
                total_score += h['score']
                count += 1
        average_score = total_score / count

        # Post-process
        resp_body = {
            "sentiment": label_to_pred(most_common_label),
            "confidence": average_score,
            "predictions": model_result,
            "headings": headings,
        }

        stringified_body = json.dumps(resp_body)
        print("resp_body: ", stringified_body)

        response = {
            "statusCode": 200,
            "body": stringified_body,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
        }

        return response
    except Exception as err:
        print("Praw Error: ", err)
        resp_body = {
            "msg": f"Could not find headings for subreddit {subreddit}"
        }
        stringified_body = json.dumps(resp_body)
        print("resp_body: ", stringified_body)
        return {
            "statusCode": 404,
            "body": stringified_body,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
        }
