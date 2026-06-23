#
#
# Git (Gogs) service
#
#
FROM gogs/gogs:next-latest AS gogs

ARG APP_NAME
ARG APP_ENV
ARG BRAND_NAME
ARG SSH_LISTEN_PORT

ENV APP_NAME=$APP_NAME
ENV APP_ENV=$APP_ENV
ENV BRAND_NAME=$BRAND_NAME
ENV SSH_LISTEN_PORT=$SSH_LISTEN_PORT

ENV SSH_ROOT_PATH=/data/ssh

# Fix ownership of Git and SSH directories
RUN mkdir -p /data/git && chown -R git:git /data/git
RUN mkdir -p /data/ssh && chown -R git:git /data/ssh

# Web port
EXPOSE 3000

# SSH port
EXPOSE $SSH_LISTEN_PORT
