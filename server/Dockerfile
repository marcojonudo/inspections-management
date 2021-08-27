FROM openjdk:8u171-alpine3.7
LABEL maintainer="marco.martinez@feuvert.es"
VOLUME /logs/inspections-management
EXPOSE 8096
ARG LOCALHOST=localhost
ENV HOST_IP=$LOCALHOST
RUN apk --no-cache add curl
COPY build/libs/*.jar inspections-management.jar
CMD java -Dcom.sun.management.jmxremote -Dmicronaut.environments=$ENV -Xmx$MAX_MEMORY -jar inspections-management.jar
