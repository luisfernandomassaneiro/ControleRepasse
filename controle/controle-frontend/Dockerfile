FROM nginx:alpine

COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template

RUN rm -rf /usr/share/nginx/html/*

COPY ng-app/ /usr/share/nginx/html

ADD entrypoint.sh entrypoint.sh
RUN chmod 755 entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

