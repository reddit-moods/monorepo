"""
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0
"""

import os
from pathlib import Path
from aws_cdk import (
    aws_apigateway as apigateway,
    aws_lambda as lambda_,
    aws_efs as efs,
    aws_ec2 as ec2,
    aws_events as events,
    aws_events_targets as targets,
)
from aws_cdk import App, Stack, Duration, RemovalPolicy, Tags

from constructs import Construct


class ServerlessHuggingFaceStack(Stack):
    """
    Test locally with:

    cdk synth
    sam build -t ./cdk.out/ServerlessHuggingFaceStack.template.json
    sam local invoke -t ./cdk.out/ServerlessHuggingFaceStack.template.json sentiment
    """

    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # EFS needs to be setup in a VPC
        vpc = ec2.Vpc(self, 'Vpc',
                      nat_gateways=0,
                      max_azs=1)

        # creates a file system in EFS to store cache models
        fs = efs.FileSystem(self, 'FileSystem',
                            vpc=vpc,
                            removal_policy=RemovalPolicy.DESTROY)
        fs.connections.allow_default_port_from_any_ipv4()
        access_point = fs.add_access_point('MLAccessPoint',
                                           path="/export/models",
                                           create_acl=efs.Acl(owner_uid="0", owner_gid="0",
                                                              permissions="777"),
                                           posix_user=efs.PosixUser(uid="0", gid="0"),)
        #    create_acl=efs.Acl(
        #        owner_gid='1001', owner_uid='1001', permissions='750'),
        #    path="/export/models",
        #    posix_user=efs.PosixUser(gid="1001", uid="1001"))

        # %%
        # iterates through the Python files in the docker directory
        docker_folder = os.path.dirname(
            os.path.realpath(__file__)) + "/inference"
        pathlist = Path(docker_folder).rglob('*.py')
        # for path in pathlist:
        base = os.path.basename(next(pathlist))
        filename = os.path.splitext(base)[0]
        # Lambda Function from docker image
        handler = lambda_.DockerImageFunction(
            self, filename,
            code=lambda_.DockerImageCode.from_image_asset(docker_folder,
                                                          cmd=[
                                                              filename+".handler"]
                                                          ),
            memory_size=8096,
            timeout=Duration.seconds(600),
            vpc=vpc,
            filesystem=lambda_.FileSystem.from_efs_access_point(
                access_point, '/mnt/hf_models_cache'),
            environment={
                "TRANSFORMERS_CACHE": "/mnt/hf_models_cache",
                "REDDIT_CLIENT_ID": os.environ["REDDIT_CLIENT_ID"],
                "REDDIT_CLIENT_SECRET": os.environ["REDDIT_CLIENT_SECRET"],
                "REDDIT_USER_AGENT": os.environ["REDDIT_USER_AGENT"],
            },
        )

        api = apigateway.RestApi(self, "reddit-moods-api",
                                 rest_api_name="Reddit Moods API",
                                 description="This service lets you query the sentiment of a subreddit.",
                                 default_cors_preflight_options=apigateway.CorsOptions(
                                     allow_origins=apigateway.Cors.ALL_ORIGINS,
                                     allow_methods=apigateway.Cors.ALL_METHODS
                                 )
                                 )
        # req_params = {
        #     "method.request.querystring.subreddit": True
        # }
        req_template = {"application/json": '{"statusCode": 200}'}
        get_sentiment_int = apigateway.LambdaIntegration(handler,
                                                         request_templates=req_template)

        api.root.add_method("GET", get_sentiment_int)   # GET /

        # Rule to add cloudwatch event to keep lambda warm
        rule = events.Rule(self, "Rule",
                           schedule=events.Schedule.rate(Duration.minutes(5)),
                           targets=[targets.LambdaFunction(handler)]
                           )


app = App()

stack = ServerlessHuggingFaceStack(app, "ServerlessHuggingFaceStack")
Tags.of(stack).add("csds351", "ServerlessHuggingFace")

app.synth()
