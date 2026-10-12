# Only created when var.domain_name is set. DNS is managed outside Terraform:
# while `terraform apply` waits on the validation, add the CNAME from the
# `certificate_validation_records` output at your DNS provider.
resource "aws_acm_certificate" "site" {
  count    = var.domain_name == null ? 0 : 1
  provider = aws.us_east_1

  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "site" {
  count    = var.domain_name == null ? 0 : 1
  provider = aws.us_east_1

  certificate_arn = aws_acm_certificate.site[0].arn
}
