FROM openjdk:14.0

ARG JAR_FILE
COPY target/controle.app.jar app.jar

#Adicionar Fontes, Descommentar se for utilizar Jasper Reports
#RUN apk --no-cache add msttcorefonts-installer fontconfig && \
#    update-ms-fonts && \
#    fc-cache -f

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
