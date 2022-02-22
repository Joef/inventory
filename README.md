# Inventory API

## Setup

```bash
npm i
```

```bash
docker-compose up -d
```

### Init the database

```bash
npm run initdb
```

## Alternate Docker Setup

```
docker pull postgres:latest
docker run -d --name inventory-db -p 5432:5432 -e 'POSTGRES_PASSWORD=postgres' postgres
```

| parameter | description                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -d        | This launches the container in daemon mode, so it runs in the background.                                                                                            |
| –name     | This gives your Docker container a friendly name, which is useful for stopping and starting containers                                                               |
| -p        | This maps the host (your computer) port 5432 to the container’s port 5432. PostgreSQL, by default, listens for connections on TCP port 5432.                         |
| -e        | This sets an environment variable in the container. In this example, the administrator password is p@ssw0rd42. You can change this value to any password you desire. |
| postgres  | This final parameter tells Docker to use the postgres image.                                                                                                         |
