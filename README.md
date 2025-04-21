# Hackathon Application

Welcome to the Hackathon Application.

This is a quick setup guide to set up the application contained in this repository.

## Environment setup & Startup
1. Install a Java & Angular IDE, Intellij has a free ultimate licenses for students and teachers, and a 30 day test period. You can also use Visual Studio Code.
2. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/), if not already installed.
3. Clone the repository
4. Execute the [reverse proxy setup](./apps/reverse-proxy/README.md#setup)
5. Execute the [IDP setup](./apps/idp/README.md#setup)
6. run `docker-compose up -d` in the root directory of the repository
   1. You might need to run this command twice, as the IDP container might not be ready when the reverse proxy tries to connect to it.
   2. If the IDP doesn't start, you've probably run `docker-compose up -d` before building the Keycloak extensions
      1. Go to `apps/idp/extensions/magiclink/target` and delete the `ch.planner-magiclink.jar` *folder*, if it exists
      2. Go to `apps/idp/extensions/idp-autolink-and-verify-email/target` and delete the `ch.planner-idp-autolink-and-verify-email.jar` *folder*, if it exists
      3. Go to `apps/idp/extensions/idp-autolink-and-verify-email/target` and delete the `ch.planner-idp-autolink-and-verify-email.jar` *folder*, if it exists
      4. Redo the  [IDP setup]
      5. Redo the `docker-compose up -d` command
7. Follow the instructions in the [UI App](./apps/ui/README.md#setup) to start the UI App
8. Follow the instructions in the [Service App](./apps/svc/README.md#setup) to start the Service App
9. Navigate to [http://app.planner.localhost](http://app.planner.localhost) to access the UI App
   1. Login data is 'admin@planner.ch' with password 'admin'

## Environment variable setup

The application uses the following environment variables:
- `AZURE_RESOURCE_NAME` = The name of the Azure resource
- `AZURE_OPENAI_DEPLOYMENT_NAME` = The name of the Azure OpenAI deployment
- `AZURE_OPENAI_MODEL_VERSION` = The version of the Azure OpenAI model
- `AZURE_OPENAI_API_KEY` = The API key for the Azure OpenAI service



