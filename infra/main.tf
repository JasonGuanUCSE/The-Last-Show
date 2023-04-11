terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

# two lambda functions w/ function url
# one dynamodb table
# roles and policies as needed
# step functions (if you're going for the bonus marks)

# the locals block is used to declare constants that 
# you can use throughout your code
locals {
  function_name = "function-create-obituary"

  handler_name  = "main.lambda_handler"

  create_artifact_name = "create_artifact.zip"
  get_artifact_name = "get_artifact.zip"
}

# create a role for the Lambda function to assume
# every service on AWS that wants to call other AWS services should first assume a role and
# then any policy attached to the role will give permissions
# to the service so it can interact with other AWS services
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "lambda" {
  name               = "iam-for-lambda-${local.function_name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# create archive file from main.py
data "archive_file" "lambda-create" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_dir = "../functions/create-obituary"
  output_path = local.create_artifact_name
  
}

# create GET archive file from main.py
data "archive_file" "lambda-get" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_file = "../functions/get-obituaries/main.py"
  output_path = local.get_artifact_name
}

# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "lambda-create" {
  role             = aws_iam_role.lambda.arn
  function_name    = "create-obituary-30141226"
  handler          = local.handler_name
  filename         = local.create_artifact_name
  timeout = 20
  source_code_hash = data.archive_file.lambda-create.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

# create GET a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "lambda-get" {
  role             = aws_iam_role.lambda.arn
  function_name    = "get-obituary-30141226"
  handler          = local.handler_name
  filename         = local.get_artifact_name
  source_code_hash = data.archive_file.lambda-get.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}


# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs" {
  name        = "lambda-logging-${local.function_name}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.logs.arn
}

#create a policy for parameter store
resource "aws_iam_policy" "parameter_store" {
  name        = "lambda-parameter-store-${local.function_name}"
  description = "IAM policy for parameter store from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters"
      ],
      "Resource": "arn:aws:ssm:*:*:parameter/*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

#attach the above policy to the create function role
resource "aws_iam_role_policy_attachment" "lambda_parameter_store" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.parameter_store.arn
}

#creat a policy for Aamazon Polly
resource "aws_iam_policy" "polly" {
  name        = "lambda-polly-${local.function_name}"
  description = "IAM policy for polly from a lambda"

  policy = <<EOF
{
   "Version": "2012-10-17",
   "Statement": [{
      "Sid": "AllowAllPollyActions",
      "Effect": "Allow",
      "Action": [
         "polly:*"],
      "Resource": "*"
      }
   ]
}
EOF
}

#attach the above policy to the create function role
resource "aws_iam_role_policy_attachment" "lambda_polly" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.polly.arn
}

# create a policy for dynamodb
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "dynamodb" {
  name        = "lambda-dynamodb-${local.function_name}"
  description = "IAM policy for dynamodb from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_dynmodb" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.dynamodb.arn
}


# create a Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "url-create" {
  function_name      = aws_lambda_function.lambda-create.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"] //remember to remove GET, PUT, DELETE
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# create a get Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "url-get" {
  function_name      = aws_lambda_function.lambda-get.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"] // remember to remove POST, PUT, DELETE
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# show the Function URL after creation
output "lambda_url_create" {
  value = aws_lambda_function_url.url-create.function_url
}

# show the get Function URL after creation
output "lambda_url_get" {
  value = aws_lambda_function_url.url-get.function_url
}

# create a DynamoDB table
resource "aws_dynamodb_table" "The-Last-Show" {
  name = "The-Last-Show-30156903"
  billing_mode = "PROVISIONED"

  #up to 8KB read per second
  read_capacity = 1

  #up to 1KB write per second
  write_capacity = 1

  hash_key = "Name"
  
  attribute {
    name = "Name"
    type = "S"
  }
  
}
  
