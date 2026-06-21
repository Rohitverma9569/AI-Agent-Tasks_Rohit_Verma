resource "random_id" "suffix" {
  byte_length = 4
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/.build/lambda.zip"
}

resource "aws_s3_bucket" "artifacts" {
  bucket = "${var.project_name}-artifacts-${random_id.suffix.hex}"
  tags   = var.tags
}

resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket                  = aws_s3_bucket.artifacts.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_object" "lambda_package" {
  bucket = aws_s3_bucket.artifacts.id
  key    = "lambda/edge-health.zip"
  source = data.archive_file.lambda_zip.output_path
  etag   = data.archive_file.lambda_zip.output_md5
}

resource "aws_iam_role" "lambda" {
  name = "${var.project_name}-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_s3_read" {
  name = "${var.project_name}-lambda-s3-read"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:GetObject",
        "s3:ListBucket",
      ]
      Resource = [
        aws_s3_bucket.artifacts.arn,
        "${aws_s3_bucket.artifacts.arn}/*",
      ]
    }]
  })
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.project_name}-edge-health"
  retention_in_days = 14
  tags              = var.tags
}

resource "aws_lambda_function" "edge_health" {
  function_name    = "${var.project_name}-edge-health"
  role             = aws_iam_role.lambda.arn
  handler          = "index.handler"
  runtime          = var.lambda_runtime
  timeout          = 10
  filename         = var.use_localstack ? data.archive_file.lambda_zip.output_path : null
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  s3_bucket        = var.use_localstack ? null : aws_s3_bucket.artifacts.id
  s3_key           = var.use_localstack ? null : aws_s3_object.lambda_package.key

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_cloudwatch_log_group.lambda,
  ]

  tags = var.tags
}

# LocalStack Community does not support API Gateway v2; use Lambda Function URL for local E2E tests.
resource "aws_lambda_function_url" "edge_health" {
  count              = var.use_localstack ? 1 : 0
  function_name      = aws_lambda_function.edge_health.function_name
  authorization_type = "NONE"
}

resource "aws_apigatewayv2_api" "http" {
  count         = var.use_localstack ? 0 : 1
  name          = "${var.project_name}-http-api"
  protocol_type = "HTTP"
  tags          = var.tags
}

resource "aws_apigatewayv2_integration" "lambda" {
  count                  = var.use_localstack ? 0 : 1
  api_id                 = aws_apigatewayv2_api.http[0].id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.edge_health.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "health" {
  count     = var.use_localstack ? 0 : 1
  api_id    = aws_apigatewayv2_api.http[0].id
  route_key = "GET /health"
  target    = "integrations/${aws_apigatewayv2_integration.lambda[0].id}"
}

resource "aws_apigatewayv2_stage" "default" {
  count       = var.use_localstack ? 0 : 1
  api_id      = aws_apigatewayv2_api.http[0].id
  name        = var.environment
  auto_deploy = true
  tags        = var.tags
}

resource "aws_lambda_permission" "apigw" {
  count         = var.use_localstack ? 0 : 1
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.edge_health.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http[0].execution_arn}/*/*"
}
