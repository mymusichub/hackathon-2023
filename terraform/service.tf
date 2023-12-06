resource "kubernetes_service" "PROJECT_NAME-service" {
  metadata {
    name = "PROJECT_NAME-service"
  }
  spec {
    selector = {
      App = kubernetes_deployment.PROJECT_NAME.spec.0.template.0.metadata[0].labels.App
    }
    port {
      port        = 80
      protocol    = "TCP"
      target_port = 3000
    }

    type = "NodePort"
  }
}
