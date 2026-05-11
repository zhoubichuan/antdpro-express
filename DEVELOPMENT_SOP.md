# 🚀 全栈自动化协作与部署流程规范 (SOP v8.0 - 零容忍闭环版)

## ⚠️ 最高优先级铁律 (Iron Laws - Must Follow Strictly)

1.  **流程即法律**: **[DEVELOPMENT_SOP.md](file:///Users/zhoubichuan/antdpro-express/DEVELOPMENT_SOP.md) 是项目执行的唯一准则**。
2.  **动态二级路由强制约束**: 
    - **核心原则**: 前后端必须统一通过**以项目名称命名的二级路径**部署。
    - **动态获取**: 路径前缀必须从 `package.json` 的 `name` 字段自动提取（如 `antdpro-express` -> `/antdpro-express`）。
    - **严禁硬编码**: 任何配置文件中严禁出现写死的路径字符串，必须使用变量引用。
3.  **PM 真实性探测与即时指挥**: 
    - **线上核验**: PM 必须在验收前亲自执行 `curl -I <prod_url>`。**若状态码非 200，视为严重事故，立即驳回。**
    - **即时调度**: 发现任务阻塞或报告不合格，必须**立即**下发指令，严禁等待。
4.  **文档完整性保护机制**: 
    - **严禁误删**: 优化 SOP 时，严禁直接删除核心管控模块（如 Git Flow、CI/CD、角色交付清单）。
    - **增量融合**: 新规则必须以增量方式融入现有框架，修改前需进行“完整性比对”。
5.  **整改闭环与二次复核**: 驳回即重做，PM 必须进行二次复核，直至完全合格。
6.  **版本号先行**: 每次需求开发前必须先确认并更新项目版本号。
7.  **生产部署分支锁定**: 生产环境必须且只能从 `release/v{version}` 分支进行部署。
8.  **报告输出规范**: 所有生成的报告必须保存为 `.md` 格式，并严格遵循 `{REPORT_NAME}_v{version}.md` 的命名规则。

---

## 1. 技术栈与架构规范

- **前端**: Ant Design Pro (Umi 4 + React + TypeScript)。
- **后端**: Node.js 18 LTS + Express。
- **数据库**: MongoDB (Mongoose ODM)。
- **包管理**: npm / cnpm。
- **进程管理**: PM2。
- **部署模式**: 动态二级路径部署（Nginx 反向代理）。

---

## 2. 版本控制与分支管理 (Git Flow)

- **master**: 生产环境稳定分支。
- **dev**: 日常开发分支。
- **feature/{version}/{name}**: 特性分支（如 `feature/v1.0.0/user-login`）。
- **release/v{version}**: 发布分支，用于生产环境部署前的最终测试。
- **版本化管理**: 每次需求开发前必须更新 [package.json](file:///Users/zhoubichuan/antdpro-express/package.json) 中的 `version` 字段。

---

## 3. CI/CD 自动化流程

- **触发源**: Gitee Actions。
- **前端构建**: 构建 `dist/`，通过 SSH 原子性替换服务器静态资源。
- **后端部署**: 上传源码至服务器，执行 `npm install --production`，使用 PM2 优雅重启。
- **环境变量**: 敏感信息通过 Secrets 管理，`.env` 文件需被 `.gitignore` 忽略。

---

## 4. API 设计与交互规范

- **统一前缀**: 前端请求后端 API 时，路径前缀格式统一为：`/${project_name}/api`。
- **响应格式**: `{ code: Number, data: Any, message: String }`。
- **错误处理**: 后端必须配置全局错误处理中间件；前端通过 umi-request 拦截器统一处理 HTTP 错误通知。

---

## 5. 角色自动执行清单 (Auto-Execution List)

### 💻 Frontend Agent (前端开发)
*   **产出物交付**: 
    - **《前端开发总结报告》**: 记录新增/修改的页面路由、核心组件逻辑及 UI 交互细节。
    - **《自测用例清单》**: 列出已完成的功能点自测结果（如：表单校验、跳转逻辑）。
    - **构建产物**: 确保 `npm run build` 生成的 `dist/` 目录结构符合动态二级路由规范。

### ⚙️ Backend Agent (后端开发)
*   **产出物交付**: 
    - **《后端接口变更说明》**: 详细列出新增/修改的 API 路径、请求方法、入参格式及响应示例。
    - **《数据库迁移脚本》**: 若有 Schema 变动，需提供对应的 MongoDB 迁移命令或脚本。
    - **《服务健康检查报告》**: 记录本地启动日志、端口占用情况及依赖包安装状态。

### 🧪 QA Agent (测试)
*   **产出物交付**: 
    - **[API_TEST_REPORT_v{version}.md](file:///Users/zhoubichuan/antdpro-express/API_TEST_REPORT_v1.0.0.md)**: 包含详细 Request/Response 示例的全量接口测试报告。
    - **[FRONTEND_FUNCTIONAL_REPORT_v{version}.md](file:///Users/zhoubichuan/antdpro-express/FRONTEND_FUNCTIONAL_REPORT_v1.0.0.md)**: 记录浏览器端操作流程及截图的报告。

### 👷‍♂️ DevOps Agent (运维)
*   **产出物交付**: 
    - **《部署执行日志》**: 记录 SSH 连接、文件上传、依赖安装及 PM2 重启的详细过程。
    - **《环境配置清单》**: 记录当前服务器的 Node 版本、Nginx 配置路径及环境变量设置。

### 📝 PM/Architect Agent (项目经理/架构)
*   **核心职责**: 监督者、规范校准者、真实性核验者。
*   **自动动作**: 
    1.  **规范同步**: 分配任务时必须声明动态二级路由规范。
    2.  **完整性审计**: 每次修改 SOP 前，必须对比历史版本，确保核心条款未被误删。
    3.  **线上连通性探测**: 执行 `curl -I https://domain.com/${project_name}`。
    4.  **产出物复核**: 对前后端及 QA 提交的报告进行二次核对，确保内容真实、完整。

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
- **文档完整性**: 优化 SOP 时严禁误删核心管控流程，应采用增量融合方式。
- **真实性高于一切**: 绝不能仅凭 AI 生成的文字就相信系统已上线，必须通过真实的网络请求来验证。
- **监督缺位即失职**: 如果 QA 报告说“通过”而 PM 没去核实，PM 承担主要责任。
- **零容忍纠错**: 同样的错误绝不允许出现第三次，PM 必须建立“强制性回溯检查”机制。