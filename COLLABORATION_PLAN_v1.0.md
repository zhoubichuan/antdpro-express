# 多角色协同工作计划 (v1.0)

## 1. 项目架构说明
- **后端项目**: `antdpro-express` (Node.js + Express)，负责 API 接口服务。
- **前端项目**: `antdpro-demo` (Ant Design Pro)，负责页面展示与交互。
- **服务器地址**: `zhoubichuan.com`
- **SSH 凭证**: 用户 `root`, 密码 `ZBCzbc123`

## 2. 部署路径规范 (严禁硬编码 /dist)
- **后端部署目录**: `/usr/src/zhoubichuan/prod/antdpro-express`
- **前端部署目录**: `/usr/src/zhoubichuan/prod/antdpro-demo` (注意：直接指向项目根目录，**不含 /dist**)
- **Nginx 静态资源指向**: `/usr/src/zhoubichuan/prod/antdpro-demo/dist` (Nginx 配置内部指向 dist 子目录)

## 3. 角色分工与任务清单

### 💻 Frontend Agent (前端)
- **任务**: 在本地或服务器完成 `antdpro-demo` 的构建，确保 `publicPath` 设置为 `/antdpro-demo/`。
- **交付物**: 包含 `index.html` 及静态资源的 `dist/` 文件夹。

### ⚙️ Backend Agent (后端)
- **任务**: 维护 `antdpro-express` 的 API 逻辑，确保端口监听正常。
- **交付物**: 可运行的 Node.js 源码及 `package.json`。

### 👷‍♂️ DevOps Agent (运维)
- **任务**: 
  1. 使用 SSH (`root@zhoubichuan.com`) 连接服务器。
  2. 将前端产物同步至 `/usr/src/zhoubichuan/prod/antdpro-demo`。
  3. 将后端源码同步至 `/usr/src/zhoubichuan/prod/antdpro-express`。
  4. 配置 Nginx，使 `https://zhoubichuan.com/antdpro-demo` 指向前端 `dist` 目录。
  5. 重载 Nginx 并重启后端 PM2 进程。

### 📝 PM Agent (项目经理)
- **任务**: 监督上述流程，执行线上连通性探测 (`curl -I https://zhoubichuan.com/antdpro-demo`)。