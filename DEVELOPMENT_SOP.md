# 🚀 全栈自动化协作与部署流程规范 (SOP v8.0 - 零重复犯错版)

## ⚠️ 最高优先级铁律 (Iron Laws - Must Follow Strictly)

1.  **流程即法律**: **[DEVELOPMENT_SOP.md](file:///Users/zhoubichuan/antdpro-express/DEVELOPMENT_SOP.md) 是项目执行的唯一准则**。
2.  **零重复犯错原则**: 
    - **增量融合**: 任何 SOP 的修改必须是**增量式**的。严禁通过“重写”方式覆盖文档，必须确保 Git Flow、CI/CD、前后端交付物等历史核心规范在任何版本中都完整保留。
    - **全量审计**: PM 在每次提交 SOP 变更前，必须对照“核心管控模块清单”进行逐项核对，缺失一项即为严重违规。
3.  **动态二级路由部署强制约束**: 
    - **核心原则**: 本项目前后端必须统一通过**以项目名称命名的二级路径**进行部署。
    - **路径来源**: 二级路径前缀必须从 `package.json` 的 `name` 字段或工作区目录名中自动提取。
    - **严禁硬编码**: 严禁在配置文件或脚本中写死具体的路径字符串。
4.  **PM 即时指挥权与真实性探测**: 
    - **即时调度**: 发现任务阻塞、报告不合格或流程偏离，必须**立即**下发指令强制整改，严禁等待。
    - **线上核验**: PM 必须在验收前亲自执行 `curl -I <prod_url>`。**若状态码非 200，视为严重事故，立即驳回所有报告。**
5.  **整改闭环机制**: 驳回即重做，PM 必须进行二次复核，直至完全合格。
6.  **版本号先行**: 每次需求开发前必须先确认并更新项目版本号。
7.  **生产部署分支锁定**: 生产环境必须且只能从 `release/v{version}` 分支进行部署。
8.  **报告输出规范**: 所有生成的报告必须保存为 `.md` 格式，并严格遵循 `{REPORT_NAME}_v{version}.md` 的命名规则。

---

## 1. 技术栈与架构规范

### 1.1 技术选型
- **前端**: Ant Design Pro (Umi 4 + React + TypeScript)。
- **后端**: Node.js 18 LTS + Express。
- **数据库**: MongoDB (Mongoose ODM)。
- **包管理**: npm / cnpm。
- **进程管理**: PM2。

### 1.2 部署架构
- **模式**: 动态二级路径部署（基于 `package.json` 中的 `name`）。
- **Nginx 反向代理**: 
  - 静态资源: `location /${project_name}/` 指向 `dist/` 目录，开启 Gzip。
  - API 转发: `location /${project_name}/api/` 转发至后端服务端口，设置必要的 Header。
- **SPA 支持**: 根路径配置 `try_files $uri $uri/ /index.html`。

---

## 2. 版本控制与分支管理 (Git Flow)

### 2.1 分支策略
- **master**: 生产环境稳定分支，仅接受来自 `release` 的合并。
- **dev**: 日常开发分支，集成所有已完成的 `feature`。
- **feature/{version}/{name}**: 特性分支（如 `feature/v1.0.0/user-login`）。
- **release/v{version}**: 发布分支，用于生产环境部署前的最终测试与修复。

### 2.2 版本化管理规范
- **版本号确认**: 每次需求开发前必须先更新 [package.json](file:///Users/zhoubichuan/antdpro-express/package.json) 中的 `version` 字段。
- **交付物规范**: 所有测试报告、验证报告文件名必须包含版本号标识。

---

## 3. CI/CD 自动化流程

- **触发源**: Gitee Actions 或 Webhook。
- **前端构建**: 构建 `dist/`，通过 SSH 原子性替换服务器静态资源。
- **后端部署**: 上传源码至服务器，执行 `npm install --production`，使用 PM2 优雅重启。
- **环境变量**: 敏感信息通过 Secrets 管理，`.env` 文件需被 `.gitignore` 忽略。

---

## 4. API 设计与交互规范

### 4.1 路径规范
- **统一前缀**: 前端请求后端 API 时，路径前缀格式统一为：`/${backend_service_name}/api`。
- **示例**: 若后端服务名为 `antdpro-express`，则接口路径为 `/antdpro-express/api/users`。

### 4.2 响应格式
- **统一结构**: `{ code: Number, data: Any, message: String }`。
- **错误处理**: 后端必须配置全局错误处理中间件；前端通过 umi-request 拦截器统一处理 HTTP 错误通知。

---

## 5. 角色自动执行清单 (Auto-Execution List)

### 💻 Frontend Agent (前端开发)
*   **触发条件**: 需求确认、接口定义完成或 Bug 修复后。
*   **自动动作**: 
    1.  **组件开发与自测**: 遵循 Ant Design Pro 规范开发页面与组件，确保本地 `npm start` 运行无报错。
    2.  **接口联调**: 配合后端完成 API 连通性测试，处理 Token 注入及全局错误拦截。
    3.  **产出物交付**: 
        - **《前端开发总结报告》**: 记录新增/修改的页面路由、核心组件逻辑及 UI 交互细节。
        - **《自测用例清单》**: 列出已完成的功能点自测结果。
        - **构建产物**: 确保 `npm run build` 生成的 `dist/` 目录结构符合二级路由部署规范。

### ⚙️ Backend Agent (后端开发)
*   **触发条件**: 数据库模型设计完成或业务逻辑实现后。
*   **自动动作**: 
    1.  **接口实现与单元测试**: 编写 Express 路由及 Controller 逻辑，确保核心逻辑有对应的单元测试覆盖。
    2.  **API 文档同步**: 维护 [routes/*.js](file:///Users/zhoubichuan/antdpro-express/routes/ruleModel.js) 文件中的注释，确保参数定义与实际代码一致。
    3.  **产出物交付**: 
        - **《后端接口变更说明》**: 详细列出新增/修改的 API 路径、请求方法、入参格式及响应示例。
        - **《数据库迁移脚本》**: 若有 Schema 变动，需提供对应的 MongoDB 迁移命令或脚本。
        - **《服务健康检查报告》**: 记录本地启动日志、端口占用情况及依赖包安装状态。

### 🧪 QA Agent (测试)
*   **触发条件**: 接收到前后端交付物或部署完成信号。
*   **自动动作**: 
    1.  **全量接口扫描**: 遍历后端 `routes/` 目录，提取所有 API。
    2.  **参数明细审计**: 报告中必须展示每个接口的**具体传参结构**和**响应数据结构**。
    3.  **前端功能测试**: 访问生产环境域名，完成真实登录及业务操作。
    4.  **产出物交付**: 
        - **[API_TEST_REPORT_v{version}.md](file:///Users/zhoubichuan/antdpro-express/API_TEST_REPORT_v1.0.0.md)**: 包含详细 Request/Response 示例的全量接口测试报告。
        - **[FRONTEND_FUNCTIONAL_REPORT_v{version}.md](file:///Users/zhoubichuan/antdpro-express/FRONTEND_FUNCTIONAL_REPORT_v1.0.0.md)**: 记录浏览器端操作流程及截图的报告。

### 👷‍♂️ DevOps Agent (运维)
*   **触发条件**: 收到部署指令或配置更新。
*   **自动动作**: 
    1.  **动态路径配置**: 确保 Nginx `location /${project_name}/` 正确指向静态资源目录。
    2.  **API 代理重写**: 配置 `rewrite ^/${project_name}/api/(.*)$ /$1 break;`。
    3.  **产出物交付**: 
        - **《部署执行日志》**: 记录 SSH 连接、文件上传、依赖安装及 PM2 重启的详细过程。
        - **《环境配置清单》**: 记录当前服务器的 Node 版本、Nginx 配置路径及环境变量设置。

### 📝 PM/Architect Agent (项目经理/架构)
*   **核心职责**: 监督者、规范校准者、真实性核验者。
*   **自动动作**: 
    1.  **规范同步**: 分配任务时必须声明动态二级路由规范。
    2.  **配置审计**: 检查 `nginx.conf`, `config/proxy.ts` 是否使用了动态变量。
    3.  **线上连通性探测**: 执行 `curl -I https://domain.com/${project_name}`。
    4.  **产出物复核**: 对前后端及 QA 提交的报告进行二次核对，确保内容真实、完整。
    5.  **SOP 完整性审计**: 每次更新 SOP 前，必须核对 Git Flow、CI/CD、交付物清单等核心模块是否缺失。

---

## 6. 强制验证红线 (Quality Gates)

### 6.1 架构与配置阶段
- [ ] **动态路径一致性**: 前端 `publicPath`、Nginx `location`、后端路由前缀必须完全匹配 `package.json` 中的项目名称。
- [ ] **API 转发逻辑**: Nginx 必须能将 `/${project_name}/api/xxx` 正确转发至后端服务的 `/api/xxx`。

### 6.2 开发与联调阶段
- [ ] **前端自测**: 前端必须提供《自测用例清单》，证明核心交互逻辑已通过本地验证。
- [ ] **后端文档**: 后端必须提供《接口变更说明》，且内容与 [routes/*.js](file:///Users/zhoubichuan/antdpro-express/routes/ruleModel.js) 实际代码一致。

### 6.3 接口测试阶段
- [ ] **全量覆盖**: 测试报告必须列出项目中**每一个**已实现的接口。
- [ ] **参数明细**: 报告必须展示每个接口的**具体传参结构**和**响应数据结构**。

### 6.4 部署后验证
- [ ] **HTTP 状态码**: PM 必须确认 `https://domain.com/${project_name}` 返回 **200 OK**。
- [ ] **真实登录**: **必须在浏览器中完成一次完整的登录流程**。
- [ ] **项目身份确认**: 检查 `<title>` 标签及页面特有 Logo。

---

## 7. 历史教训总结 (Lessons Learned)
- **拒绝硬编码**: 任何涉及项目标识的配置都必须动态获取，严禁写死。
- **文档完整性**: 优化 SOP 时严禁误删核心管控流程（如分支管理、CI/CD），应采用增量融合方式。
- **真实性高于一切**: 绝不能仅凭 AI 生成的文字就相信系统已上线，必须通过真实的网络请求来验证。
- **监督缺位即失职**: 如果 QA 报告说“通过”而 PM 没去核实，PM 承担主要责任。
- **零重复犯错**: 同样的错误（如漏掉前后端交付物、硬编码路径）绝不允许出现第二次。