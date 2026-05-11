#!/bin/bash

# ==========================================
# 生产环境 SSH 直连部署脚本 (v5.0 - 跨项目协同版)
# ==========================================

SERVER_HOST="zhoubichuan.com"
SERVER_USER="root"
SERVER_PASS="ZBCzbc123"

# 后端项目配置
BACKEND_NAME="antdpro-express"
BACKEND_DIR="/usr/src/zhoubichuan/prod/${BACKEND_NAME}"

# 前端项目配置 (假设前端源码在当前工作区的上级目录或指定路径，此处模拟同步逻辑)
FRONTEND_NAME="antdpro-demo"
FRONTEND_DIR="/usr/src/zhoubichuan/prod/${FRONTEND_NAME}"

echo "🚀 开始执行跨项目协同部署..."

# --- 1. 后端部署 (antdpro-express) ---
echo "📦 [1/3] 正在部署后端项目 ${BACKEND_NAME}..."
rsync -avz --delete -e "sshpass -p '${SERVER_PASS}' ssh -o StrictHostKeyChecking=no" \
    --exclude='.git' \
    --exclude='node_modules' \
    ./ ${SERVER_USER}@${SERVER_HOST}:${BACKEND_DIR}/

sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} << EOF
    cd ${BACKEND_DIR}
    npm install --production
    pm2 restart ${BACKEND_NAME} || pm2 start app.js --name ${BACKEND_NAME}
    pm2 save
EOF

# --- 2. 前端部署 (antdpro-demo) ---
# 注意：由于当前工作区是后端，我们需要确认前端 dist 的位置。
# 假设前端已经构建好，或者我们同步一个已知的 dist 包。
# 这里我们尝试从本地可能的 frontend 目录同步，如果不存在则报错提示。
if [ -d "../antdpro-demo/dist" ]; then
    echo "📦 [2/3] 正在部署前端项目 ${FRONTEND_NAME}..."
    # 同步整个前端项目根目录到服务器，确保结构完整
    rsync -avz --delete -e "sshpass -p '${SERVER_PASS}' ssh -o StrictHostKeyChecking=no" \
        ../antdpro-demo/ ${SERVER_USER}@${SERVER_HOST}:${FRONTEND_DIR}/
    
    sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} << EOF
        cd ${FRONTEND_DIR}
        # 如果服务器端没有构建，则在此构建；如果已有 dist 则跳过
        if [ ! -d "dist" ]; then
            npm install
            npm run build
        fi
EOF
else
    echo "⚠️ 警告: 未在 ../antdpro-demo/dist 找到前端构建产物，请确认前端已构建。"
fi

# --- 3. Nginx 配置与重载 ---
echo "🌐 [3/3] 正在更新 Nginx 配置并重载..."
# 确保 nginx.conf 中的 alias 指向正确的 dist 路径
sshpass -p "${SERVER_PASS}" scp -o StrictHostKeyChecking=no ./nginx.conf ${SERVER_USER}@${SERVER_HOST}:/etc/nginx/conf.d/${FRONTEND_NAME}.conf

sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} << EOF
    nginx -t
    systemctl reload nginx
EOF

echo "✅ 协同部署完成！"
echo "   后端地址: https://${SERVER_HOST}/${BACKEND_NAME}/api"
echo "   前端地址: https://${SERVER_HOST}/${FRONTEND_NAME}"