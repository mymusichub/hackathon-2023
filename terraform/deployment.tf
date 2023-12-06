variable "RESOURCES_CPU_LIMITS" {
  default = "1.7"
}
variable "RESOURCES_CPU_REQUESTS" {
  default = "1.7"
}

resource "kubernetes_deployment" "PROJECT_NAME" {
  metadata {
    name = "PROJECT_NAME"
    labels = {
      App = "PROJECT_NAME"
      "tags.datadoghq.com/env" = var.ENVIRONMENT
      "tags.datadoghq.com/service" = "PROJECT_NAME"
      "tags.datadoghq.com/version" = var.DEPLOYMENT_VERSION
    }
  }

  spec {
    replicas = var.AUTOSCALE_MIN_REPLICAS
    revision_history_limit = 3
    selector {
      match_labels = {
        App = "PROJECT_NAME"
      }
    }
    template {
      metadata {
        labels = {
          App = "PROJECT_NAME"
          "admission.datadoghq.com/enabled" = "true"
          "tags.datadoghq.com/env" = var.ENVIRONMENT
          "tags.datadoghq.com/service" = "PROJECT_NAME"
          "tags.datadoghq.com/version" = var.DEPLOYMENT_VERSION
        }
      }
      spec {
        container {
          image = var.IMAGE_NAME
          name = "PROJECT_NAME"

          port {
            container_port = 3000
          }

          env {
            name = "HOSTNAME"
            value = "localhost"
          }
          env {
            name = "GOOGLE_PROJECT_ID"
            value = var.GOOGLE_PROJECT_ID
          }
          env {
            name = "GCP_PROJECT_ID"
            value = var.GOOGLE_PROJECT_ID
          }
          env {
            name = "REACT_APP_ENVIRONMENT"
            value = var.ENVIRONMENT
          }
          env {
            name = "API_URL"
            value = var.API_URL
          }
          env {
            name = "SENTRY_DSN"
            value = var.SENTRY_DSN
          }
          env {
            name = "SENTRY_STACKTRACE_APP_PACKAGES"
            value = var.SENTRY_STACKTRACE_APP_PACKAGES
          }
          env {
            name = "SENTRY_ENVIRONMENT"
            value = var.ENVIRONMENT
          }
          env {
            name = "DD_ENV"
            value = var.ENVIRONMENT
          }
          env {
            name = "DD_VERSION"
            value = var.DEPLOYMENT_VERSION
          }
          env {
            name = "MANAGEMENT_METRICS_EXPORT_DATADOG_API_KEY"
            value = var.DATADOG_API_KEY
          }
          readiness_probe {
            http_get {
              path = "/api/healthcheck"
              port = 3000
            }
            failure_threshold = 10
            period_seconds = 15
          }
          startup_probe {
            http_get {
              path = "/api/healthcheck"
              port = 3000
            }
            initial_delay_seconds = 45
            failure_threshold = 10
            period_seconds = 15
          }
          resources {
            limits = {
              cpu = var.RESOURCES_CPU_LIMITS
              memory = "1536Mi"
            }
            requests = {
              cpu = var.RESOURCES_CPU_REQUESTS
              memory = "1536Mi"
            }
          }
        }
      }
    }
  }
}
