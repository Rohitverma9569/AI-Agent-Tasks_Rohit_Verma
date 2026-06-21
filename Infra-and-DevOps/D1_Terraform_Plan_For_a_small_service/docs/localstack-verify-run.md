# LocalStack Verification Run

> **Date:** 2026-06-21  
> **Target:** `Infra-and-DevOps/D1_Terraform_Plan_For_a_small_service/terraform`  
> **Environment:** LocalStack 3.8.1 (`use_localstack=true`)  
> **Result:** Apply succeeded; health check returned `{"status":"ok"}`

---

## Commands

```bash
docker run --rm -d --name d1-localstack -p 4566:4566 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e SERVICES=s3,lambda,iam,logs,sts \
  -e LAMBDA_EXECUTOR=docker \
  localstack/localstack:3.8.1

cd "Infra-and-DevOps/D1_Terraform_Plan_For_a_small_service/terraform"
terraform apply -auto-approve -var="use_localstack=true"
curl -s "$(terraform output -raw health_check_url)"
```

Follow-up health check:

```bash
curl -s "$(terraform output -raw health_check_url)"
```

---

## Summary

| Item | Value |
| ---- | ----- |
| LocalStack container ID | `a398c0cf10df40303f5a53244fd6eff8e3d812ff9fca7c53d337e55fe0a3e6cb` |
| Resources created | 10 added, 0 changed, 0 destroyed |
| Artifacts bucket | `d1-small-service-artifacts-b054e221` |
| Lambda function | `d1-small-service-edge-health` |
| Health check URL | `http://jkr2b5swe9c9xxi0lsu69dwnbsi5dpxy.lambda-url.ap-south-1.localhost.localstack.cloud:4566/` |
| First health response | `{"status":"ok","service":"d1-small-service","timestamp":"2026-06-21T08:40:53.642Z"}` |
| Second health response | `{"status":"ok","service":"d1-small-service","timestamp":"2026-06-21T08:42:08.036Z"}` |

Terraform detected prior LocalStack state drift (resources deleted outside Terraform after a container restart) and recreated:

- `aws_iam_role.lambda`
- `aws_lambda_function.edge_health`
- `aws_lambda_function_url.edge_health[0]`
- `aws_s3_bucket.artifacts`
- `aws_s3_object.lambda_package`

---

## Full terminal output

```
rohitverma@PMLMBT4677 AI-Agents-Tasks -PML % docker run --rm -d --name d1-localstack -p 4566:4566 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e SERVICES=s3,lambda,iam,logs,sts \
  -e LAMBDA_EXECUTOR=docker \
  localstack/localstack:3.8.1

cd "Infra-and-DevOps/D1_Terraform_Plan_For_a_small_service/terraform"
terraform apply -auto-approve -var="use_localstack=true"
curl -s "$(terraform output -raw health_check_url)"
a398c0cf10df40303f5a53244fd6eff8e3d812ff9fca7c53d337e55fe0a3e6cb
random_id.suffix: Refreshing state... [id=sFTiIQ]
data.archive_file.lambda_zip: Reading...
data.archive_file.lambda_zip: Read complete after 0s [id=58c773eb89923140f9d87a46ec77dd6134eef59a]
aws_cloudwatch_log_group.lambda: Refreshing state... [id=/aws/lambda/d1-small-service-edge-health]
aws_iam_role.lambda: Refreshing state... [id=d1-small-service-lambda-role]
aws_s3_bucket.artifacts: Refreshing state... [id=d1-small-service-artifacts-b054e221]
aws_iam_role_policy_attachment.lambda_basic: Refreshing state... [id=d1-small-service-lambda-role-20260621083841216800000001]
aws_iam_role_policy.lambda_s3_read: Refreshing state... [id=d1-small-service-lambda-role:d1-small-service-lambda-s3-read]
aws_s3_bucket_public_access_block.artifacts: Refreshing state... [id=d1-small-service-artifacts-b054e221]
aws_s3_bucket_server_side_encryption_configuration.artifacts: Refreshing state... [id=d1-small-service-artifacts-b054e221]
aws_s3_object.lambda_package: Refreshing state... [id=lambda/edge-health.zip]
aws_lambda_function.edge_health: Refreshing state... [id=d1-small-service-edge-health]
aws_lambda_function_url.edge_health[0]: Refreshing state... [id=d1-small-service-edge-health]

Note: Objects have changed outside of Terraform

Terraform detected the following changes made outside of Terraform since the last "terraform apply"
which may have affected this plan:

  # aws_iam_role.lambda has been deleted
  - resource "aws_iam_role" "lambda" {
      - arn                   = "arn:aws:iam::000000000000:role/d1-small-service-lambda-role" -> null
      - id                    = "d1-small-service-lambda-role" -> null
      - name                  = "d1-small-service-lambda-role" -> null
        tags                  = {
            "Managed" = "terraform"
            "Project" = "d1-terraform-plan"
        }
        # (11 unchanged attributes hidden)
    }

  # aws_lambda_function.edge_health has been deleted
  - resource "aws_lambda_function" "edge_health" {
      - arn                            = "arn:aws:lambda:ap-south-1:000000000000:function:d1-small-service-edge-health" -> null
      - function_name                  = "d1-small-service-edge-health" -> null
        id                             = "d1-small-service-edge-health"
        tags                           = {
            "Managed" = "terraform"
            "Project" = "d1-terraform-plan"
        }
        # (26 unchanged attributes hidden)

        # (3 unchanged blocks hidden)
    }

  # aws_lambda_function_url.edge_health[0] has been deleted
  - resource "aws_lambda_function_url" "edge_health" {
      - function_url       = "http://bibndny3nt5y894zjqtcefb9fmbfgegc.lambda-url.ap-south-1.localhost.localstack.cloud:4566/" -> null
        id                 = "d1-small-service-edge-health"
        # (6 unchanged attributes hidden)
    }

  # aws_s3_bucket.artifacts has been deleted
  - resource "aws_s3_bucket" "artifacts" {
      - arn                         = "arn:aws:s3:::d1-small-service-artifacts-b054e221" -> null
      - id                          = "d1-small-service-artifacts-b054e221" -> null
        tags                        = {
            "Managed" = "terraform"
            "Project" = "d1-terraform-plan"
        }
        # (12 unchanged attributes hidden)

        # (3 unchanged blocks hidden)
    }

  # aws_s3_object.lambda_package has been deleted
  - resource "aws_s3_object" "lambda_package" {
        id                            = "lambda/edge-health.zip"
      - key                           = "lambda/edge-health.zip" -> null
        # (24 unchanged attributes hidden)
    }


Unless you have made equivalent changes to your configuration, or ignored the relevant attributes
using ignore_changes, the following plan may include actions to undo or respond to these changes.

─────────────────────────────────────────────────────────────────────────────────────────────────────

Terraform used the selected providers to generate the following execution plan. Resource actions are
indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_cloudwatch_log_group.lambda will be created
  + resource "aws_cloudwatch_log_group" "lambda" {
      + arn               = (known after apply)
      + id                = (known after apply)
      + log_group_class   = (known after apply)
      + name              = "/aws/lambda/d1-small-service-edge-health"
      + name_prefix       = (known after apply)
      + retention_in_days = 14
      + skip_destroy      = false
      + tags              = {
          + "Managed" = "terraform"
          + "Project" = "d1-terraform-plan"
        }
      + tags_all          = {
          + "Managed" = "terraform"
          + "Project" = "d1-terraform-plan"
        }
    }

  # aws_iam_role.lambda will be created
  + resource "aws_iam_role" "lambda" {
      + arn                   = (known after apply)
      + assume_role_policy    = jsonencode(
            {
              + Statement = [
                  + {
                      + Action    = "sts:AssumeRole"
                      + Effect    = "Allow"
                      + Principal = {
                          + Service = "lambda.amazonaws.com"
                        }
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + managed_policy_arns   = (known after apply)
      + max_session_duration  = 3600
      + name                  = "d1-small-service-lambda-role"
      + name_prefix           = (known after apply)
      + path                  = "/"
      + tags                  = {
          + "Managed" = "terraform"
          + "Project" = "d1-terraform-plan"
        }
      + tags_all              = {
          + "Managed" = "terraform"
          + "Project" = "d1-terraform-plan"
        }
      + unique_id             = (known after apply)

      + inline_policy (known after apply)
    }

  # aws_iam_role_policy.lambda_s3_read will be created
  + resource "aws_iam_role_policy" "lambda_s3_read" {
      + id          = (known after apply)
      + name        = "d1-small-service-lambda-s3-read"
      + name_prefix = (known after apply)
      + policy      = (known after apply)
      + role        = (known after apply)
    }

  # aws_iam_role_policy_attachment.lambda_basic will be created
  + resource "aws_iam_role_policy_attachment" "lambda_basic" {
      + id         = (known after apply)
      + policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
      + role       = "d1-small-service-lambda-role"
    }

  # aws_lambda_function.edge_health will be created
  + resource "aws_lambda_function" "edge_health" {
      + architectures                  = (known after apply)
      + arn                            = (known after apply)
      + code_sha256                    = (known after apply)
      + filename                       = "./.build/lambda.zip"
      + function_name                  = "d1-small-service-edge-health"
      + handler                        = "index.handler"
      + id                             = (known after apply)
      + invoke_arn                     = (known after apply)
      + last_modified                  = (known after apply)
      + memory_size                    = 128
      + package_type                   = "Zip"
      + publish                        = false
      + qualified_arn                  = (known after apply)
      + qualified_invoke_arn           = (known after apply)
      + reserved_concurrent_executions = -1
      + role                           = (known after apply)
      + runtime                        = "nodejs20.x"
      + signing_job_arn                = (known after apply)
      + signing_profile_version_arn    = (known after apply)
      + skip_destroy                   = false
      + source_code_hash               = "pxFMkJfz+Tlx+aGQETBDRLBXBjuC4ZUykYJ0crDDqbo="
      + source_code_size               = (known after apply)
      + tags                           = {
          + "Managed" = "terraform"
          + "Project" = "d1-terraform-plan"
        }
      + tags_all                       = {
          + "Managed" = "terraform"
          + "Project" = "d1-terraform-plan"
        }
      + timeout                        = 10
      + version                        = (known after apply)

      + ephemeral_storage (known after apply)

      + logging_config (known after apply)

      + tracing_config (known after apply)
    }

  # aws_lambda_function_url.edge_health[0] will be created
  + resource "aws_lambda_function_url" "edge_health" {
      + authorization_type = "NONE"
      + function_arn       = (known after apply)
      + function_name      = "d1-small-service-edge-health"
      + function_url       = (known after apply)
      + id                 = (known after apply)
      + invoke_mode        = "BUFFERED"
      + url_id             = (known after apply)
    }

  # aws_s3_bucket.artifacts will be created
  + resource "aws_s3_bucket" "artifacts" {
      + acceleration_status         = (known after apply)
      + acl                         = (known after apply)
      + arn                         = (known after apply)
      + bucket                      = "d1-small-service-artifacts-b054e221"
      + bucket_domain_name          = (known after apply)
      + bucket_prefix               = (known after apply)
      + bucket_regional_domain_name = (known after apply)
      + force_destroy               = false
      + hosted_zone_id              = (known after apply)
      + id                          = (known after apply)
      + object_lock_enabled         = (known after apply)
      + policy                      = (known after apply)
      + region                      = (known after apply)
      + request_payer               = (known after apply)
      + tags                        = {
          + "Managed" = "terraform"
          + "Project" = "d1-terraform-plan"
        }
      + tags_all                    = {
          + "Managed" = "terraform"
          + "Project" = "d1-terraform-plan"
        }
      + website_domain              = (known after apply)
      + website_endpoint            = (known after apply)

      + cors_rule (known after apply)

      + grant (known after apply)

      + lifecycle_rule (known after apply)

      + logging (known after apply)

      + object_lock_configuration (known after apply)

      + replication_configuration (known after apply)

      + server_side_encryption_configuration (known after apply)

      + versioning (known after apply)

      + website (known after apply)
    }

  # aws_s3_bucket_public_access_block.artifacts will be created
  + resource "aws_s3_bucket_public_access_block" "artifacts" {
      + block_public_acls       = true
      + block_public_policy     = true
      + bucket                  = (known after apply)
      + id                      = (known after apply)
      + ignore_public_acls      = true
      + restrict_public_buckets = true
    }

  # aws_s3_bucket_server_side_encryption_configuration.artifacts will be created
  + resource "aws_s3_bucket_server_side_encryption_configuration" "artifacts" {
      + bucket = (known after apply)
      + id     = (known after apply)

      + rule {
          + apply_server_side_encryption_by_default {
              + sse_algorithm     = "AES256"
                # (1 unchanged attribute hidden)
            }
        }
    }

  # aws_s3_object.lambda_package will be created
  + resource "aws_s3_object" "lambda_package" {
      + acl                    = (known after apply)
      + arn                    = (known after apply)
      + bucket                 = (known after apply)
      + bucket_key_enabled     = (known after apply)
      + checksum_crc32         = (known after apply)
      + checksum_crc32c        = (known after apply)
      + checksum_crc64nvme     = (known after apply)
      + checksum_sha1          = (known after apply)
      + checksum_sha256        = (known after apply)
      + content_type           = (known after apply)
      + etag                   = "9824098a5e4a1c554804be470685f7bf"
      + force_destroy          = false
      + id                     = (known after apply)
      + key                    = "lambda/edge-health.zip"
      + kms_key_id             = (known after apply)
      + server_side_encryption = (known after apply)
      + source                 = "./.build/lambda.zip"
      + storage_class          = (known after apply)
      + tags_all               = (known after apply)
      + version_id             = (known after apply)
    }

Plan: 10 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  ~ api_base_url          = "http://bibndny3nt5y894zjqtcefb9fmbfgegc.lambda-url.ap-south-1.localhost.localstack.cloud:4566/" -> (known after apply)
  ~ artifacts_bucket_name = "d1-small-service-artifacts-b054e221" -> (known after apply)
  ~ health_check_url      = "http://bibndny3nt5y894zjqtcefb9fmbfgegc.lambda-url.ap-south-1.localhost.localstack.cloud:4566/" -> (known after apply)
  ~ lambda_function_arn   = "arn:aws:lambda:ap-south-1:000000000000:function:d1-small-service-edge-health" -> (known after apply)
aws_cloudwatch_log_group.lambda: Creating...
aws_iam_role.lambda: Creating...
aws_s3_bucket.artifacts: Creating...
aws_iam_role.lambda: Creation complete after 0s [id=d1-small-service-lambda-role]
aws_iam_role_policy_attachment.lambda_basic: Creating...
aws_iam_role_policy_attachment.lambda_basic: Creation complete after 0s [id=d1-small-service-lambda-role-20260621084046687300000001]
aws_cloudwatch_log_group.lambda: Creation complete after 0s [id=/aws/lambda/d1-small-service-edge-health]
aws_s3_bucket.artifacts: Creation complete after 0s [id=d1-small-service-artifacts-b054e221]
aws_s3_bucket_public_access_block.artifacts: Creating...
aws_iam_role_policy.lambda_s3_read: Creating...
aws_s3_bucket_server_side_encryption_configuration.artifacts: Creating...
aws_s3_object.lambda_package: Creating...
aws_iam_role_policy.lambda_s3_read: Creation complete after 0s [id=d1-small-service-lambda-role:d1-small-service-lambda-s3-read]
aws_s3_bucket_public_access_block.artifacts: Creation complete after 0s [id=d1-small-service-artifacts-b054e221]
aws_s3_bucket_server_side_encryption_configuration.artifacts: Creation complete after 0s [id=d1-small-service-artifacts-b054e221]
aws_s3_object.lambda_package: Creation complete after 0s [id=lambda/edge-health.zip]
aws_lambda_function.edge_health: Creating...
aws_lambda_function.edge_health: Creation complete after 5s [id=d1-small-service-edge-health]
aws_lambda_function_url.edge_health[0]: Creating...
aws_lambda_function_url.edge_health[0]: Creation complete after 0s [id=d1-small-service-edge-health]

Apply complete! Resources: 10 added, 0 changed, 0 destroyed.

Outputs:

api_base_url = "http://jkr2b5swe9c9xxi0lsu69dwnbsi5dpxy.lambda-url.ap-south-1.localhost.localstack.cloud:4566/"
artifacts_bucket_name = "d1-small-service-artifacts-b054e221"
health_check_url = "http://jkr2b5swe9c9xxi0lsu69dwnbsi5dpxy.lambda-url.ap-south-1.localhost.localstack.cloud:4566/"
lambda_function_arn = "arn:aws:lambda:ap-south-1:000000000000:function:d1-small-service-edge-health"
lambda_function_name = "d1-small-service-edge-health"
{"status":"ok","service":"d1-small-service","timestamp":"2026-06-21T08:40:53.642Z"}%
rohitverma@PMLMBT4677 terraform % curl -s "$(terraform output -raw health_check_url)"
{"status":"ok","service":"d1-small-service","timestamp":"2026-06-21T08:42:08.036Z"}%
rohitverma@PMLMBT4677 terraform %
```
