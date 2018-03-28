############### Dockerfile ##############
# Build ->
#   docker build . -t local/friends-command-api:latest
# Run ->
#   docker run -p 8000:8000 --name friends-command-api local/friends-command-api:latest
# Stop ->
#   docker stop friends-command-api
##########################################

FROM node:6.11.3-alpine
WORKDIR /usr/src/app

# docker build should not rerun npm install unless package.json changes
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/ 
COPY package.json .

# skip red stdout texts, do not install devDependencies
RUN npm install --loglevel warn --production

COPY . .

EXPOSE 8000

# node index.js instead of npm start to reduce number of processes
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
CMD [ "node", "index.js" ]