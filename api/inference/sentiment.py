"""
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
"""

import json

from transformers import pipeline, AutoTokenizer
from bs4 import BeautifulSoup
from contractions import CONTRACTION_MAP
import re
import unicodedata
import string
import nltk
from nltk.tokenize import ToktokTokenizer
tokenizer = ToktokTokenizer()
stopword_list = nltk.corpus.stopwords.words('english')
stopword_list.remove('not')


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

def remove_html_tags(text):
    return BeautifulSoup(text, 'html.parser').get_text()

def remove_accented_chars(text):
    new_text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8', 'ignore')
    return new_text

def expand_contractions(text, map=CONTRACTION_MAP):
    pattern = re.compile('({})'.format('|'.join(map.keys())), flags=re.IGNORECASE|re.DOTALL)
    def get_match(contraction):
        match = contraction.group(0)
        first_char = match[0]
        expanded = map.get(match) if map.get(match) else map.get(match.lower())
        expanded = first_char+expanded[1:]
        return expanded 
    new_text = pattern.sub(get_match, text)
    new_text = re.sub("'", "", new_text)
    return new_text

def remove_special_characters(text):
    # define the pattern to keep
    pat = r'[^a-zA-z0-9.,!?/:;\"\'\s]' 
    return re.sub(pat, '', text)

def remove_numbers(text):
    # define the pattern to keep
    pattern = r'[^a-zA-z.,!?/:;\"\'\s]' 
    return re.sub(pattern, '', text)

def remove_punctuation(text):
    text = ''.join([c for c in text if c not in string.punctuation])
    return text

def get_stem(text):
    stemmer = nltk.porter.PorterStemmer()
    text = ' '.join([stemmer.stem(word) for word in text.split()])
    return text

def remove_stopwords(text):
    # convert sentence into token of words
    tokens = tokenizer.tokenize(text)
    tokens = [token.strip() for token in tokens]
    # check in lowercase 
    t = [token for token in tokens if token.lower() not in stopword_list]
    text = ' '.join(t)    
    return text

def remove_extra_whitespace_tabs(text):
    #pattern = r'^\s+$|\s+$'
    pattern = r'^\s*|\s\s*'
    return re.sub(pattern, ' ', text).strip()

def to_lowercase(text):
    return text.lower()

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
