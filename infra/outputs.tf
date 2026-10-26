output "site_url" {
  description = "Public URL of the site."
  value       = "https://${coalesce(var.domain_name, aws_cloudfront_distribution.site.domain_name)}"
}

output "cloudfront_domain_name" {
  description = "Point your custom domain here (CNAME, or ALIAS/ANAME at the apex)."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "certificate_validation_records" {
  description = "DNS records to create so ACM can validate the certificate (only when Terraform creates it)."
  value = !local.create_certificate ? [] : [
    for o in aws_acm_certificate.site[0].domain_validation_options : {
      name  = o.resource_record_name
      type  = o.resource_record_type
      value = o.resource_record_value
    }
  ]
}

# Values for the GitHub repository variables used by .github/workflows/deploy.yml.
output "github_actions_variables" {
  description = "Set these as repository variables (Settings → Secrets and variables → Actions → Variables)."
  value = {
    AWS_REGION                 = var.aws_region
    AWS_ROLE_ARN               = aws_iam_role.deploy.arn
    S3_BUCKET                  = aws_s3_bucket.site.id
    CLOUDFRONT_DISTRIBUTION_ID = aws_cloudfront_distribution.site.id
  }
}
