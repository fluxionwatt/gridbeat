FROM alpine:3.22
RUN apk --update upgrade && \
    apk add sqlite && \
    rm -rf /var/cache/apk/*
# ENV GOPROXY https://goproxy.cn/

#RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

ADD gridbeat /gridbeat

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl --fail http://localhost:8080/health || exit 1

RUN mkdir -p /config /log /data /extra

VOLUME /config /log /data /extra

EXPOSE 8080 8443

RUN  chmod +x /gridbeat
CMD ["/gridbeat","server","--config", "/config/gridbeat.yaml"]
