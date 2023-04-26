"""
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
"""

import json
import praw
import os
import boto3

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


def load_cached_model_s3():
    s3 = boto3.resource("s3")
    out_dir = os.environ["TRANSFORMERS_CACHE"]
    bucket_name = "reddit-moods-transformers-cache"
    s3_folder = "/cache"
    bucket = s3.Bucket(bucket_name)
    for obj in bucket.objects.filter(Prefix=s3_folder):
        target = obj.key if out_dir is None \
            else os.path.join(out_dir, os.path.relpath(obj.key, s3_folder))
        if not os.path.exists(os.path.dirname(target)):
            os.makedirs(os.path.dirname(target))
        if obj.key[-1] == '/':
            continue
        bucket.download_file(obj.key, target)


try:
    print("Loading cached model from s3...")
    load_cached_model_s3()
    print("Loaded: ", os.listdir(os.environ["TRANSFORMERS_CACHE"]))
except Exception as e:
    print("failed to load cached model: ", e)

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

        # running model on each heading
        model_result = nlp_pipeline(subreddit)

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
            "confidence": average_score
        }
    except Exception as err:
        print("Praw Error: ", err)
        print("Running backup method...")
        # Potential Errors:
        # Praw Error: 404
        # - Happens when subreddit does not exist or is banned
        # - TODO: Return a separate error message and handle on frontend.
        res = nlp_pipeline(subreddit)[0]

        resp_body = {
            "sentiment": label_to_pred(res["label"]),
            "confidence": res["score"]
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
