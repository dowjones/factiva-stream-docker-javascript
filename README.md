# Factiva News Stream Client for Docker

Factiva Analytics Stream Client project template to be executed as part of a Docker container.

Getting a runing client is as easy as 1, 2, 3...

## 1. Customise the `app/main.js` file

Create your own logic to handle messages by creating/modifying the `messageHandler` method in the `app/main.js` file.

There's a list of pre-built handlers that can be used:

* **[BigQueryHandler](https://devportal/bigqueryhandler/docs)**: Save each message to to a BigQuery table. As prerequisite, it is necessary to define the following `env` variables:

    | Var Name | Description |
    | ----- | ----- |
    | GOOGLE_APPLICATION_CREDENTIALS | A path to a JSON credentials file exported from Google Cloud, and having the right privilegdes to write records to the table. Example: `/app/svcacc.json` |
    | BIGQUERY_DATA_SET | A BQ dataset like `dataset` |
    | BIGQUERY_TABLE | A BQ table name like `streams` |

* **[JSONFileHander](https://devportal/jsonfile/docs)**: Save each mesasge to a JSONL file. This file contains one document per line. The following `env` variables are needed:
    | Var Name | Description |
    | ----- | ----- |
    | STREAM_FILES_DIR | A path to a folder that will contain the JSONL files, like `/articles` |

* **[MongoDBHandler](https://devportal/jsonfile/docs)**: Save each mesasge to a MongoDB collection. As prerequisite, it is necessary to define the following `env` variables:
    | Var Name | Description |
    | ----- | ----- |
    | MONGODB_CONNECTION_STRING | MongoDB url instance, like `mongodb://localhost:27017` |
    | MONGODB_DATABASE_NAME | Name of the database, like `factiva-stream` |
    | MONGODB_COLLECTION_NAME | Name of the collection (table) where the logs will be stored, like `streams` |

Also, we provide the following optional environment vars to allow you customize certain functions.

Enable proxy request

* **Proxy request**: Allow to perform http request through a proxy server:
    | Var Name | Description |
    | ----- | ----- |
    | PROXY_USE | Flag to enable proxy, like `true`|
    | PROXY_PROTOCOL | Proxy protocol to be used, like `https` |
    | PROXY_HOST | Host server, like `127.0.0.1`|
    | PROXY_PORT | Host port, like `9000`|
    | PROXY_AUTH_USER | User to be used on auth|
    | PROXY_AUTH_PASSWORD | Password to be used on auth|
  
* **Files directories**: Path where the downloaded files and logs will be stored:

    | Var Name | Description |
    | ----- | ----- |
    | DOWNLOAD_FILES_DIR | Directory where the taxonomies, companies categories and job files will be stored, like `/files`. The `rootProject/downloads` is using by default|
    | LOG_FILES_DIR | Directory where the logs will be stored, like `/logs`. The `rootProject/logs` is using by default|

## 2. Run `docker build` to create the Docker Image

Review the `Dockerfile` before creating the image in order to enable/disable the relevant configurations according to the handlers or operations that will be used within the `app/main.js` script.

After the `Dockerfile` review is complete, just run the following command:

```bash
docker build -t fstream-client-js .
```

## 3. Start the Container instance

The container instance can be started either by running `docker run` or using `docker-compose`.

### Docker Run

This command starts the client in dettached mode.

```bash
docker run -d --name mystream-bqlogger \
 -v <host_logs_path>:/logs \
 -v <host_path_to>/service_account.json:/app/service_account.json \
 -e FACTIVA_USERKEY=<your user KEY> \
 -e FACTIVA_STREAMID=<your full stream ID> \
 -e <ENV_VAR_REQUIRED_BY_A_HANDLER>=<handler env var value> \
 fstream-client-js
```

### Docker-Compose

Use the following template as reference:

```yaml
version: '3.9'

services:
  listener:
    image: fstream-client-js
    volumes:
      - <host_logs_path>:/log
      - <host_path_to>/service_account.json:/app/service_account.json
    restart: always
    environment:
      FACTIVA_USERKEY: <your user KEY>
      FACTIVA_STREAMID: <your full stream ID>
      <ENV_VAR_REQUIRED_BY_A_HANDLER>: <handler env var value>

```
