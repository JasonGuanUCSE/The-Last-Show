# add your get-obituaries function here
import boto3
import json
from boto3.dynamodb.conditions import Key

dynamodb_resource = boto3.resource('dynamodb')
table = dynamodb_resource.Table('The-Last-Show-30156903')

def lambda_handler(event, context):
    response = table.scan()
    if response['Count'] == 0:
        print('No obituaries found')
        return {
            'statusCode': 200,
            'body': json.dumps('No obituaries found')
        }
    else:
        print(response['Items'])
        return {
            'statusCode': 201,
            'body': json.dumps(response['Items'])
        }

