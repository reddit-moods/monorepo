"""
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
"""

import json

from transformers import pipeline, AutoTokenizer
from bs4 import BeautifulSoup
import contractions
import re
import unicodedata
import string
import nltk
import praw
from nltk.tokenize import ToktokTokenizer
nltk.download('wordnet')
nltk.download('omw-1.4')
from nltk.stem import WordNetLemmatizer 
nltk.download('stopwords')
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


def label_to_pred(label: str):
    """Label should be one of LABEL_0, LABEL_1 or LABEL_2
    """
    idx = label.split("_")[1]
    if not idx.isdigit():
        return f"Bad prediction label: {label}"

    label_idx = int(idx)
    mappings = ["Negative", "Neutral", "Positive"]
    return mappings[label_idx]

def remove_html_tags(text):
    return BeautifulSoup(text, 'html.parser').get_text()

def remove_accented_chars(text):
    new_text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8', 'ignore')
    return new_text

def expand_contractions(text):
    expanded_words = []   
    for word in text.split():
        expanded_words.append(contractions.fix(word))  
    new_text = ' '.join(expanded_words)
    return new_text

def remove_special_characters(text):
    pat = r'[^a-zA-z0-9.,!?/:;\"\'\s]' 
    return re.sub(pat, '', text)

def remove_numbers(text):
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
    tokens = tokenizer.tokenize(text)
    tokens = [token.strip() for token in tokens]
    t = [token for token in tokens if token.lower() not in stopword_list]
    text = ' '.join(t)    
    return text

def remove_extra_whitespace_tabs(text):
    pattern = r'^\s*|\s\s*'
    return re.sub(pattern, ' ', text).strip()

def to_lowercase(text):
    return text.lower()

def get_lem(text):
    lemmatizer = WordNetLemmatizer()
    return lemmatizer.lemmatize(text, pos='n')

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
    reddit = praw.Reddit(
        client_id="_4w3-13ViMbAUIrtcfe8kg",
        client_secret="U9GF-bnbPYwHqLjRwqjxAenQg1ACjQ",
        user_agent="my user agent",
    )
    headings=[]
    for submission in reddit.subreddit(subreddit).hot(limit=25):
        headings.append(submission.title)
    for i in range(25):
        input=remove_html_tags(headings[i])
        input=remove_accented_chars(input)
        input=expand_contractions(input)
        input=remove_special_characters(input)
        input=get_lem(input)
        input=remove_extra_whitespace_tabs(input)
        input=to_lowercase(input)
        headings[i]=input
    pos_count=0
    pos_avg=0
    neg_count=0
    neg_avg=0
    neut_count=0
    neut_avg=0
    score=0
    label=""
    predicted_labels=[]
    for i in range(25):
        res=nlp_pipeline(headings[i])[0]
        label=label_to_pred(res["label"])
        predicted_labels.append(label)
        if (label=="Positive"):
            pos_count=pos_count+1
            pos_avg=pos_avg+res["score"]
        if(label=="Negative"):
            neg_count=neg_count+1
            neg_avg=neg_avg+res["score"]
        if(label=="Neutral"):
            neut_count=neut_count+1
            neut_avg=neut_avg+res["score"]
    if (pos_count>neg_count and pos_count>neut_count):
        label="Positive"
        score=pos_avg/pos_count
    if (neg_count>pos_count and neg_count>neg_count):
        label="Negative"
        score=neg_avg/neg_count
    if (neut_count>pos_count and neut_count>neg_count):
        label="Neutral"
        score=neut_avg/neut_count
    # TODO: fetch the top 25 hottest reddit posts for the input subreddit
    # PRAW
    # Send a raw API request to reddit
    print("subreddit: ", subreddit)
    # Get most common predicted label from the top 25 headlines --> then average
    # the predictions
    res = nlp_pipeline(subreddit)[0]
    print("model pred: ", label, score)
    # Post-process
    resp_body = {
        "sentiment": label,
        "confidence": score
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
