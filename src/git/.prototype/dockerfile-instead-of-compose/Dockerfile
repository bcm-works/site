# FROM codeberg.org/forgejo/forgejo:15-rootless AS git
FROM codeberg.org/forgejo/forgejo:15 AS forgejo
WORKDIR /app

ARG USER_UID
ARG USER_GID
ARG PORT_WEB
ARG PORT_SSH
ARG APP_NAME
ARG APP_ENV
ARG APP_SLOGAN
ARG APP_DISPLAY_NAME_FORMAT
ARG ROOT_URL
ARG APP_THEME_LIST
ARG APP_THEME_DEFAULT

ENV PUID=${USER_UID}
ENV PGID=${USER_GID}
ENV PORT_WEB=${PORT_WEB}
ENV PORT_SSH=${PORT_SSH}
ENV FORGEJO____APP_NAME=${APP_NAME}
ENV FORGEJO____APP_SLOGAN=${APP_SLOGAN}
ENV FORGEJO____APP_DISPLAY_NAME_FORMAT=${APP_DISPLAY_NAME_FORMAT}
ENV FORGEJO__server__ROOT_URL=${ROOT_URL}
ENV FORGEJO__ui__SHOW_USER_EMAIL="false"
ENV FORGEJO__ui__THEMES=${APP_THEME_LIST}
ENV FORGEJO__ui__DEFAULT_THEME=${APP_THEME_DEFAULT}
ENV FORGEJO__database__DB_TYPE="sqlite3"
ENV FORGEJO__database__PATH="data/${APP_NAME}.${APP_ENV}.live.db"

# Apply security updates and install required system packages.
RUN apk update && \
    apk add --no-cache --upgrade openssl busybox ssl_client && \
    apk add --no-cache curl openssh git-lfs

VOLUME ["/data"]

# Expose the required ports.
EXPOSE ${PORT_WEB}
EXPOSE ${PORT_SSH}
