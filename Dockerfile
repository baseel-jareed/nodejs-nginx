FROM node:24.11.1-trixie-slim  
RUN mkdir -p /home/app
WORKDIR /home/app
COPY contapp .
RUN npm install
CMD ["node" , "server.js"]
