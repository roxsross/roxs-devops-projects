FROM public.ecr.aws/amazonlinux/amazonlinux:2023
RUN dnf --setopt=install_weak_deps=False -y install nginx

EXPOSE 8080

COPY default.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY public/ /usr/share/nginx/html

RUN chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d && \
        chown -R nginx:nginx /usr/share/nginx/html
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

USER nginx

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
