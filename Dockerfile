FROM node:12.5.0-alpine AS build_web

ARG APP_PATH=/client

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY $APP_PATH .

RUN npm ci

RUN npm run build

FROM golang:1.13-alpine3.10 AS run_server

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

ARG APP_PATH=/app

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

RUN mkdir -p app/client/build

COPY --from=build_web /client/build ./client/build
COPY ./go.mod ./go.mod
COPY ./go.sum ./go.sum
COPY ./main.go ./main.go

ENV GO111MODULE=on
ENV PORT=8080

RUN go get -d -v ./...
RUN go install -v ./...

CMD ["go run main.go"]
