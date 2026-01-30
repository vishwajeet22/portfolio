# Deployment to Google Cloud Run

This document describes how to deploy the frontend application to Google Cloud Run.

## Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and initialized.
- Access to a Google Cloud Project with Cloud Run and Container Registry/Artifact Registry enabled.

## Build the Docker Image

Build the Docker image using Google Cloud Build. Replace `PROJECT-ID` and `IMAGE-NAME` with your project ID and desired image name.

```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/IMAGE-NAME .
```

## Deploy to Cloud Run

Deploy the built image to Google Cloud Run. Replace `SERVICE-NAME`, `PROJECT-ID`, `IMAGE-NAME`, and `REGION` with your configuration.

```bash
gcloud run deploy SERVICE-NAME \
  --image gcr.io/PROJECT-ID/IMAGE-NAME \
  --platform managed \
  --region REGION \
  --allow-unauthenticated
```

The `--allow-unauthenticated` flag allows public access to the service. Remove it if you want to restrict access.

## Optimizations included

- **Multi-stage Build**: The Dockerfile uses a multi-stage build to keep the final image size small.
- **Standalone Output**: Next.js standalone output is used to include only necessary files for production.
- **Alpine Linux**: The base image is `node:20-alpine` for a lightweight container.
