variable "AUTOSCALE_TARGET_CPU_UTILIZATION" {
  default = "60"
}
variable "AUTOSCALE_MIN_REPLICAS" {
  default = "1"
}
variable "AUTOSCALE_MAX_REPLICAS" {
  default = "10"
}

resource "kubernetes_horizontal_pod_autoscaler" "PROJECT_NAME-autoscaler" {
  metadata {
    name = "PROJECT_NAME-autoscaler"
  }

  spec {
    max_replicas = var.AUTOSCALE_MAX_REPLICAS
    min_replicas = var.AUTOSCALE_MIN_REPLICAS

    target_cpu_utilization_percentage = var.AUTOSCALE_TARGET_CPU_UTILIZATION

    scale_target_ref {
      api_version = "apps/v1"
      kind = "Deployment"
      name = kubernetes_deployment.PROJECT_NAME.metadata.0.name
    }
  }
}
