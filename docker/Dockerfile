ARG TARGETPLATFORM
FROM --platform=$TARGETPLATFORM busybox:stable
ARG TARGETARCH

#HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl --fail http://localhost:8080/health || exit 1

COPY linux/${TARGETARCH}/gridbeat /gridbeat
COPY config/gridbeat-docker.yaml /config/gridbeat.yaml

RUN mkdir -p /log /data /extra

VOLUME /log /data /extra

EXPOSE 8080

RUN  chmod +x /gridbeat
CMD ["/gridbeat","server", "-c", "/config/gridbeat.yaml"]
