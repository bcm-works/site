#
#
# Git (Gogs) service
#
#
FROM gogs/gogs:next-0.14 AS gogs

ARG USER_UID
ARG USER_GID
ARG SSH_LISTEN_PORT

ENV USER_UID=$USER_UID
ENV USER_GID=$USER_GID
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

# Make a new non-root 'git' user with the same user id and
# group id as the host user to avoid file ownership issues.
RUN usermod -u $USER_UID git || true && \
    groupmod -g $USER_GID git || true

# Fix ownership of the Git and SSH directories.
RUN mkdir -p /data/git && chown -R git:git /data/git
RUN mkdir -p /data/ssh && chown -R git:git /data/ssh

# Change to the non-root 'git' user to improve security
# of final Docker Image output.
USER git

# Web port
EXPOSE 3000

# SSH port
EXPOSE $SSH_LISTEN_PORT
