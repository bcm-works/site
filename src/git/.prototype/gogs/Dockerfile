#
#
# Git (Gogs) service
#
#
FROM gogs/gogs:next-0.14 AS gogs

ARG APP_NAME
ARG APP_ENV
ARG BRAND_NAME
ARG SSH_LISTEN_PORT
ARG USER_UID
ARG USER_GID

ENV APP_NAME=$APP_NAME
ENV APP_ENV=$APP_ENV
ENV BRAND_NAME=$BRAND_NAME
ENV SSH_LISTEN_PORT=$SSH_LISTEN_PORT

ENV SSH_ROOT_PATH=/data/ssh

USER root

# Apply system security upgrades
RUN apk update && \
  apk upgrade --no-cache && \
  apk add --no-cache --upgrade \
    busybox zlib ssl_client scanelf \
    pax-utils musl musl-utils libapk \
    busybox-binsh apk-tools \
    curl openssh git

# Make the 'git' user use the same user id and group id as the host user
RUN usermod -u $USER_ID git || true && \
    groupmod -g $GROUP_ID git || true

# Fix ownership of the Git and SSH directories
RUN mkdir -p /data/git && chown -R git:git /data/git
RUN mkdir -p /data/ssh && chown -R git:git /data/ssh

USER git

# Web port
EXPOSE 3000

# SSH port
EXPOSE $SSH_LISTEN_PORT
