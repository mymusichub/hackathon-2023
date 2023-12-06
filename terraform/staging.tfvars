GOOGLE_PROJECT_ID = "musichub-staging-278316"
GOOGLE_COMPUTE_REGION = "europe-west3"

RESOURCES_CPU_LIMITS = "1"
RESOURCES_CPU_REQUESTS = "1"

AUTOSCALE_TARGET_CPU_UTILIZATION = 75
AUTOSCALE_MIN_REPLICAS = 1
AUTOSCALE_MAX_REPLICAS = 5

ENVIRONMENT = "staging"
API_URL="https://mh-api.mymusichub.io/"