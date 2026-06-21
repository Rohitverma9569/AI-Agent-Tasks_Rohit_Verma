# D1 Small Service — Terraform (AWS)

Terraform module for a small edge health service on AWS:

```
Client → API Gateway HTTP API (GET /health) → Lambda (Node.js 20) → CloudWatch Logs
S3 artifacts bucket ← Lambda deployment package
```

## Architecture

| Component | Resource | Purpose |
| --------- | -------- | ------- |
| Storage | `aws_s3_bucket.artifacts` | Stores the Lambda deployment zip |
| Compute | `aws_lambda_function.edge_health` | Returns JSON health response |
| API | `aws_apigatewayv2_api.http` | Public HTTP entry point |
| Identity | `aws_iam_role.lambda` | Least-privilege execution role |
| Observability | `aws_cloudwatch_log_group.lambda` | Lambda logs (14-day retention) |

Security controls:

- S3 public access blocked
- SSE-S3 (AES256) encryption on the artifacts bucket
- Lambda IAM limited to CloudWatch Logs + read access on the artifacts bucket only

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.5.0
- **Real AWS:** configured credentials (`AWS_PROFILE` or `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`)
- **Local validation:** [Docker](https://www.docker.com/) + [LocalStack](https://localstack.cloud/) (optional)

## Versions used

| Tool / provider | Version |
| --------------- | ------- |
| Terraform | >= 1.5.0 |
| hashicorp/aws | ~> 5.0 |
| hashicorp/archive | ~> 2.4 |
| hashicorp/random | ~> 3.6 |

## Setup

```bash
cd Infra-and-DevOps/D1_Terraform_Plan_For_a_small_service/terraform
cp terraform.tfvars.example terraform.tfvars   # optional
```

### LocalStack (no AWS account required)

```bash
docker run --rm -d --name d1-localstack -p 4566:4566 localstack/localstack
```

Create `terraform.tfvars`:

```hcl
use_localstack      = true
localstack_endpoint = "http://localhost:4566"
```

## Commands

### init

Initialize providers and the local backend:

```bash
terraform init
```

### validate

Check configuration syntax and provider schema:

```bash
terraform validate
```

### plan

Preview infrastructure changes:

```bash
# Real AWS
terraform plan -out=tfplan

# LocalStack
terraform plan -var="use_localstack=true" -out=tfplan
```

### apply

Create resources (only when ready):

```bash
terraform apply tfplan
```

After apply, test the health endpoint:

```bash
curl "$(terraform output -raw health_check_url)"
```

### destroy

Remove all managed resources:

```bash
terraform destroy
```

Stop LocalStack when finished:

```bash
docker stop d1-localstack
```

## Formatting

```bash
terraform fmt -recursive
terraform fmt -check -recursive
```

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| `InvalidClientTokenId` | Configure valid AWS credentials or use LocalStack (`use_localstack = true`) |
| LocalStack connection refused | Ensure Docker container is running on port 4566 |
| S3 bucket name conflict | Re-run plan; `random_id` suffix makes bucket names unique |
| Lambda zip missing | Run `terraform plan`; `archive_file` builds `.build/lambda.zip` automatically |

## Outputs

| Output | Description |
| ------ | ----------- |
| `api_base_url` | API Gateway stage URL |
| `health_check_url` | Full `GET /health` URL |
| `lambda_function_name` | Lambda function name |
| `lambda_function_arn` | Lambda function ARN |
| `artifacts_bucket_name` | S3 artifacts bucket |
| `api_gateway_id` | HTTP API ID |
