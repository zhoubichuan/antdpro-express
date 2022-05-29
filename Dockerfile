FROM node:10.15.3         
LABEL maintainer="zhoubichuan@icloud.com" 
RUN mkdir -p /usr/src/node/antdpro-express
WORKDIR /usr/src/node/antdpro-express  
COPY . /usr/src/node/antdpro-express             
RUN npm install --registry=https://registry.npm.taobao.org 
EXPOSE 4000
CMD [ "npm", "start"]                      
