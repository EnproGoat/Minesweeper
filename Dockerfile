FROM httpd:alpine
#trp perturbant de voir le warn xd
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf
COPY . /usr/local/apache2/htdocs/

EXPOSE 80
