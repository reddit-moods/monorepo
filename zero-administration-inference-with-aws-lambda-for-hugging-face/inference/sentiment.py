"""
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
"""

import json
from transformers import pipeline

# Taking in the text string - wen is so hot
# Tokenize -> converts the letters into integer code format
# Feeds those codes into the model
# Calls model to get predictions -> probability (confidence of the model)
# - Predictions:
#   - 0
#   - 1
#   - 2
# Then we're done
nlp = pipeline("sentiment-analysis", model="twitter-roberta-base-sentiment")


def handler(event, context):
    response = {
        "statusCode": 200,
        "body": nlp(event['text'])[0]
    }
    return response
