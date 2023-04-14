# add your create-obituary function here
import json
import boto3
from requests_toolbelt.multipart import decoder
import requests
import base64
import time
import hashlib


dynamodb_resource = boto3.resource('dynamodb')
table = dynamodb_resource.Table('The-Last-Show-30156903')

client = boto3.client('ssm')



def lambda_handler(event, context):
    # pass the event data to the lambda handler
    body = event['body']

    if event['isBase64Encoded']:
        body = base64.b64decode(body)

    #decode the multipart form data
    conten_type = event['headers']['content-type']
    data = decoder.MultipartDecoder(body, conten_type)

    binary_data = [part.content for part in data.parts]

    name = binary_data[0].decode()
    bornDay = binary_data[1].decode()
    deathDay = binary_data[2].decode()
    file = binary_data[3]
   
    print("name",name)
    print("born",bornDay)
    print("death",deathDay)
    print("image",file)

    # Get Cloudinary credentials from Parameter Store
    parameter = client.get_parameter(Name='cloudinary', WithDecryption=True)
    credentials = parameter['Parameter']['Value'].split(":")
    cloudinary_cloud_name = credentials[0]
    cloudinary_api_key = credentials[1]
    cloudinary_api_secret = credentials[2]

    #manually generate the signature
    timestamp = str(int(time.time()))
    public_id = name
    to_sign = 'public_id=' + public_id + '&timestamp=' + timestamp +cloudinary_api_secret
    to_sign_bytes = bytes(to_sign, 'utf-8')
    signature = hashlib.sha1(to_sign_bytes).hexdigest()

    #upload the image to cloudinary with the signature
    url = 'https://api.cloudinary.com/v1_1/' + cloudinary_cloud_name + '/image/upload/'
    params = {'api_key': cloudinary_api_key, 'public_id': public_id, 'timestamp': timestamp, 'signature': signature}
    files = {'file': file}


    # send HTTP POST request to cloudinary
    response = requests.post(url, params=params, files=files, auth=(cloudinary_api_key, cloudinary_api_secret))
    #print the response from cloudinary to see if it worked
    print(response.text)
    #print the url of the image
    image_url = response.json()['url']
    image_url = image_url.replace("image/upload", "image/upload/e_art:zorrro,e_grayscale")
    print(image_url)

    #get openai credentials from parameter store
    parameter = client.get_parameter(Name='openai', WithDecryption=True)
    openai_api_key = parameter['Parameter']['Value']
  
    # Set up API endpoint
    endpoint = "https://api.openai.com/v1/engines/text-curie-001/completions"

    # Set up headers and payload
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + openai_api_key
    }

    payload = {
    "prompt": "write an obituary about a fictional character named" + name + "who was born on" + bornDay + "and died on" + deathDay + ".",
    "max_tokens": 600,
    "temperature": 0.5
    }

    # Send HTTP POST request to OpenAI API
    response = requests.post(endpoint, headers=headers, data=json.dumps(payload))

    # Parse the response
    if response.status_code == 200:
        response_json = json.loads(response.text)
        generated_text = response_json["choices"][0]["text"]
        print("AIGC: ", generated_text)
    else:
        print("Error: ", response.status_code, response.text)


    # create an Amazon Polly client
    polly_client = boto3.client('polly')
    # make a request to synthesize speech
    response_polly = polly_client.synthesize_speech(
    OutputFormat='mp3',
    Text= generated_text,
    VoiceId='Joanna',
    )

    # extract the audio stream from the response
    audio_stream = response_polly['AudioStream'].read()

    #upload the audio to cloudinary
    audio_url = 'https://api.cloudinary.com/v1_1/' + cloudinary_cloud_name + '/video/upload'
    audio_files = {'file': audio_stream}
    #'eager': 'e_art:zorrro,e_grayscale'
    # send HTTP POST request to cloudinary
    response_polly = requests.post(audio_url, params=params, files=audio_files, auth=(cloudinary_api_key, cloudinary_api_secret))
    #print the response from cloudinary to see if it worked
    print('polly feedback',response_polly.text)

    mp3_url = response_polly.json()['url']
    print('mp3 url',mp3_url)

    dynamodb_response = table.put_item(
    Item={ 
        "Name": name,
        "BornDay": bornDay,
        "DeathDay": deathDay,
        "Obituary": generated_text,
        "Image": image_url,
        "Audio": mp3_url
    }
    )

    if dynamodb_response['ResponseMetadata']['HTTPStatusCode'] == 200:
        return {
        'statusCode': 200,
        'body': json.dumps('Obituary saved to the database')
        }
    else:
        return {
        'statusCode': 500,
        'body': json.dumps('Obituary was not saved to the database')
        }




