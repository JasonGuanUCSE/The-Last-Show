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

# import boto3
# import json
# from boto3.dynamodb.conditions import Key
# dynamodb_resource = boto3.resource('dynamodb')
# table = dynamodb_resource.Table('The-Last-Show-30156903')


# def lambda_handler(event, context):
#     name = event['queryStringParameters']['name']
#     response = table.query(
#         KeyConditionExpression=Key('Name').eq(name)
#     )
#     if response['Count'] == 0:
#         print('Obituary not found')
#         return {
#             'statusCode': 404,
#             'body': json.dumps('Obituary not found')
#         }
#     else:
#         print(response['Items'][0]['Image'])
#         # for item in response['Items']:
#         #     print(item)
#         return {
#             'statusCode': 200,
#             'body': json.dumps(response['Items'])
#         }

