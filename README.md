# Node.js App cluster with Nginx Load Balancing & MongoDB $ MongoDB-express

This project provides a fully containerized development environment with:
- Multiple node.js application instances
- Nginx acting as a load balancer 
- MongoDB as the database
- Mongo Express as a visual admin UI
- Docker secrets for secure credentials handling

The setup runs entirely over **HTTP** during development (no HTTPS or certificates required)

---

## Secrets Setup 

Before running the environment, create these files in the secrets directory:

db_admin.txt ...... write in it the desired database admin username

db_pass.txt  ...... write in it the desired database admin password

or simply from the nodejs-nginx-main directory in terminal:

$ echo "your_admin_username" > secrets/db_admin.txt

$ echo "your_admin_password" > secrets/db_pass.txt

---

## Requirements 

- Docker
- Docker Compose

Node.js is optional unless running the app outside containers

---

## Running The Project

in terminal from nodejs-nginx-main directory:

$ docker compose -f mongo.yaml up --build 

detached mode:

$ docker compose -f mongo.yaml up --build -d

### Service access

App (via Nginx) -> http://localhost:8080
Mongo Express(via Nginx) -> http://localhost:8082

### Stopping the services 

in terminal from nodejs-nginx-main directory:

$ docker compose -f mongo.yaml down 

### Removing the containers with the volumes

in terminal from nodejs-nginx-main directory:

$ docker compose -f mongo.yaml down -v