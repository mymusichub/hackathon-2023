provider "google" {
  project = var.GOOGLE_PROJECT_ID
  region  = var.GOOGLE_COMPUTE_REGION
}
variable "GOOGLE_PROJECT_ID" {
  description = "project id"
}
variable "GOOGLE_COMPUTE_REGION" {
  description = "region"
}
variable "IMAGE_NAME" {
  default = ""
}
variable "DATADOG_API_KEY" {
  default = ""
}
variable "ENVIRONMENT" {
  default = ""
}
variable "SENTRY_DSN" {
  default = "https://11c8f5cc6f7342b4b1a9c68deb0b81d0@o398435.ingest.sentry.io/4505443143581696"
}
variable "SENTRY_STACKTRACE_APP_PACKAGES" {
  default = "com.musichub.PROJECT_NAME"
}
variable "DEPLOYMENT_VERSION" {}
variable "SERVER_PORT" {
  default = 3000
}
variable "API_URL" {
  default = ""
}

