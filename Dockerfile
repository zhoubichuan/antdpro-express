#设置构建的基础镜像
<<<<<<< HEAD
FROM node
=======
FROM node:16.5.0
>>>>>>> a1571fa9fe96e6b50f68d172ccb82585acb28d45
RUN mkdir -p /project/
WORKDIR /project/
COPY package.json /project/
#设置npm下载依赖来源为淘宝源
RUN npm config set registry https://registry.npm.taobao.org
<<<<<<< HEAD
RUN rm -rf node_modules && npm install -g npm && cd /project
=======
RUN rm -rf node_modules && npm install -g npm && cd /project && npm install nodemon -g
>>>>>>> a1571fa9fe96e6b50f68d172ccb82585acb28d45
#安装项目依赖
RUN npm install
COPY . /project/
#在启动镜像时执行启动项目的命令
CMD npm run dev
#暴露端口用于外部访问
EXPOSE 4000