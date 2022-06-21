#设置构建的基础镜像
FROM node
RUN mkdir -p /project/
WORKDIR /project/
COPY package.json /project/
#设置npm下载依赖来源为淘宝源
RUN npm config set registry https://registry.npm.taobao.org
RUN rm -rf node_modules && npm install -g npm && cd /project
#安装项目依赖
RUN npm install
COPY . /project/
#在启动镜像时执行启动项目的命令
CMD npm run dev
#暴露端口用于外部访问
EXPOSE 4000