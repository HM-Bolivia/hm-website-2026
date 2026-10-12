variable "project_name" {
  description = "Prefix for resource names."
  type        = string
  default     = "hackmeeting2026"
}

variable "aws_region" {
  description = "Region for the S3 bucket and IAM resources."
  type        = string
  default     = "us-east-1"
}

variable "github_repository" {
  description = "GitHub repository allowed to deploy, as \"owner/name\"."
  type        = string

  validation {
    condition     = can(regex("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$", var.github_repository))
    error_message = "Use the form \"owner/name\"."
  }
}

variable "github_branch" {
  description = "Only workflows running on this branch can assume the deploy role."
  type        = string
  default     = "main"
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub OIDC identity provider. Set to false if the account already has one (only one is allowed per account)."
  type        = bool
  default     = true
}

variable "domain_name" {
  description = "Optional custom domain (e.g. hackmeeting.example.org). Null serves the site on the CloudFront domain only."
  type        = string
  default     = null
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_All includes South American edge locations."
  type        = string
  default     = "PriceClass_All"
}

variable "tags" {
  description = "Extra tags for every resource."
  type        = map(string)
  default     = {}
}
