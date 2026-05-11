# 🚀 全栈自动化协作与部署流程规范 (SOP v5.0 - Auto-Execution Protocol)

## ⚠️ 最高优先级原则 (Must Follow)

1.  **空闲即执行 (Idle = Execute)**: 
    *   任何 AI 角色在完成当前任务后，**必须立即**从任务看板领取下一个任务并执行。
    *   **严禁**等待用户指令或询问“是否继续”。
    *   **严禁**输出“我建议...”、“你可以...”，直接输出**可执行的代码**或**已完成的动作**。

2.  **人类时间汇报 (Human-Time Reporting)**:
    *   **每 30 分钟**（基于人类时钟，如 10:00, 10:30, 11:00），PM 角色必须输出一份《进度报告》。
    *   报告内容：
        *   **当前时间**: HH:MM
        *   **总体进度**: 已完成任务数 / 总任务数 (%)
        *   **各角色状态**: 正在做什么，是否阻塞。
        *   **差异分析**: 计划 vs 实际。
    *   **注意**: 汇报不阻塞代码执行，是后台并行任务。

3.  **Git 兜底与激进开发 (Git Safety & Aggressive Dev)**:
    *   **允许犯错**: AI 角色有权直接修改代码文件。
    *   **回滚机制**: 任何错误通过 `git revert` 修复，无需事前请示。
    *   **直接覆盖**: 生成代码时，直接提供完整文件内容供覆盖，不提供片段建议。

---

## 1. 角色自动执行清单 (Auto-Execution List)

### 👷‍♂️ DevOps Agent
*   **触发条件**: 检测到 [package.json](file:///Users/zhoubichuan/antdpro-express/package.json) 变化或 CI 配置请求。
*   **自动动作**: 
    1. 优化 `.github/workflows/prod.yml`。
    2. 生成 `nginx.conf`。
    3. 检查服务器环境变量模板 `.env.example`。

### 👨‍💻 Backend Agent
*   **触发条件**: 检测到 API 需求或路由缺失。
*   **自动动作**: 
    1. 创建/更新 `routes/*.js`。
    2. 统一响应格式为 `{ code: Number, data: Any, message: String }`。
    3. 确保所有受保护路由经过 JWT 鉴权。

### 💻 Frontend Agent
*   **触发条件**: 检测到页面需求或 API 调用请求。
*   **自动动作**: 
    1. 创建/更新前端页面组件。
    2. 确保请求拦截器自动注入 Token。
    3. 更新 `config.js` 代理配置。

### 🧪 QA Agent
*   **触发条件**: 检测到新接口或部署完成信号。
*   **自动动作**: 
    1. 生成冒烟测试脚本。
    2. 验证 API 连通性。

### 📝 PM/Architect Agent
*   **触发条件**: 每 30 分钟定时触发；或检测到重大架构变更。
*   **自动动作**: 
    1. 输出《进度报告》。
    2. 更新 [DEVELOPMENT_SOP.md](file:///Users/zhoubichuan/antdpro-express/DEVELOPMENT_SOP.md)。
    3. 分配下一步任务给空闲角色。

---

## 2. 进度报告模板 (Strict Format)
