"""
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
"""

import json

from transformers import pipeline, AutoTokenizer


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
    # TODO: fetch the top 25 hottest reddit posts for the input subreddit
    # PRAW
    # Send a raw API request to reddit
    print("subreddit: ", subreddit)
    # Get most common predicted label from the top 25 headlines --> then average
    # the predictions
    res = nlp_pipeline(subreddit)[0]
    print("model pred: ", res)
    # Post-process
    resp_body = {
        "sentiment": label_to_pred(res["label"]),
        "confidence": res["score"]
    }
    print("resp_body: ", resp_body)

    response = {
        "statusCode": 200,
        "body": resp_body
    }

    return response
