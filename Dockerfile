FROM node:argon

# Create www directory for web server
RUN mkdir -p /usr/src
WORKDIR /usr/src

# Install www dependencies
COPY package.json /usr/src
RUN npm install

# Bundle web application source
COPY www-server.js /usr/src
RUN mkdir -p /usr/src/lib /usr/src/www
ADD lib /usr/src/lib
ADD www /usr/src/www

EXPOSE 3000

#CMD pwd && ls -la www

CMD node www-server.js
