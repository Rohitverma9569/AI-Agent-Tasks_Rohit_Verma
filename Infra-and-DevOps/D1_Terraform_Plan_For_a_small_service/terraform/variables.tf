variable "aws_region" {
  type        = string
  description = "AWS region for resource deployment"
  default     = "ap-south-1"
}

variable "project_name" {
  type        = string
  description = "Project prefix used in resource names"
  default     = "d1-small-service"
}

variable "environment" {
  type        = string
  description = "Deployment environment and API Gateway stage name"
  default     = "dev"
}

variable "lambda_runtime" {
  type        = string
  description = "Lambda runtime identifier"
  default     = "nodejs20.x"
}

variable "use_localstack" {
  type        = bool
  description = "When true, target LocalStack instead of real AWS (for local validation)"
  default     = false
}

variable "localstack_endpoint" {
  type        = string
  description = "LocalStack base URL when use_localstack is true"
  default     = "http://localhost:4566"
}

variable "tags" {
  type        = map(string)
  description = "Tags applied to supported resources"
  default = {
    Project = "d1-terraform-plan"
    Managed = "terraform"
  }
}
