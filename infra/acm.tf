locals {
  create_certificate = var.domain_name != null && var.acm_certificate_arn == null
  certificate_arn = (
    var.domain_name == null ? null
    : local.create_certificate ? aws_acm_certificate_validation.site[0].certificate_arn
    : var.acm_certificate_arn
  )
}

# Only created when var.domain_name is set and no var.acm_certificate_arn is
# given. DNS is managed outside Terraform: while `terraform apply` waits on the
# validation, add the CNAME from the `certificate_validation_records` output at
# your DNS provider.
resource "aws_acm_certificate" "site" {
  count    = local.create_certificate ? 1 : 0
  provider = aws.us_east_1

  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "site" {
  count    = local.create_certificate ? 1 : 0
  provider = aws.us_east_1

  certificate_arn = aws_acm_certificate.site[0].arn
}
