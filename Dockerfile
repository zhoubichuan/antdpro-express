#设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM node

#创建app目录,保存我们的代码
RUN mkdir -p /usr/src/node/antdpro-express
#设置工作目录
WORKDIR /usr/src/node/antdpro-express

#复制所有文件到 工作目录。
COPY . /usr/src/node/antdpro-express

#编译运行node项目，使用npm安装程序的所有依赖,利用taobao的npm安装

WORKDIR /usr/src/node/antdpro-express
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm install nodemon

#暴露container的端口
EXPOSE 9000

#运行命令

CMD ["npm", "start"]

