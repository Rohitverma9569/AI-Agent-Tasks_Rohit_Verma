output "api_base_url" {
  description = "API Gateway stage invoke URL (AWS) or Lambda Function URL (LocalStack)"
  value       = var.use_localstack ? aws_lambda_function_url.edge_health[0].function_url : aws_apigatewayv2_stage.default[0].invoke_url
}

output "health_check_url" {
  description = "Full URL for the GET /health endpoint"
  value       = var.use_localstack ? aws_lambda_function_url.edge_health[0].function_url : "${aws_apigatewayv2_stage.default[0].invoke_url}/health"
}

output "lambda_function_name" {
  description = "Deployed Lambda function name"
  value       = aws_lambda_function.edge_health.function_name
}

output "lambda_function_arn" {
  description = "Deployed Lambda function ARN"
  value       = aws_lambda_function.edge_health.arn
}

output "artifacts_bucket_name" {
  description = "S3 bucket storing the Lambda deployment package"
  value       = aws_s3_bucket.artifacts.id
}

output "api_gateway_id" {
  description = "API Gateway HTTP API identifier (null when using LocalStack Function URL)"
  value       = var.use_localstack ? null : aws_apigatewayv2_api.http[0].id
}
