FROM node:16-alpine3.11
WORKDIR app

COPY package*.json ./

RUN npm install && \
    npm install -g firebase-tools
    
ENV LANG=C.UTF-8 \
    TZ=Asia/Tokyo \
    HOST=0.0.0.0

EXPOSE 8888
EXPOSE 9005