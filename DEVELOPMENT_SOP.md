# 🚀 全栈自动化协作与部署流程规范 (SOP v7.7 - 动态二级路由专项版)

## ⚠️ 最高优先级铁律 (Iron Laws - Must Follow Strictly)

1.  **流程即法律**: **[DEVELOPMENT_SOP.md](file:///Users/zhoubichuan/antdpro-express/DEVELOPMENT_SOP.md) 是项目执行的唯一准则**。
2.  **动态二级路由部署强制约束**: 
    - **核心原则**: 本项目前后端必须统一通过**以项目名称命名的二级路径**进行部署。
    - **路径来源**: 二级路径前缀必须从 `package.json` 的 `name` 字段或工作区目录名中自动提取（例如：项目名为 `antdpro-express`，则路径为 `/antdpro-express`；项目名为 `antdpro-demo`，则路径为 `/antdpro-demo`）。
    - **前端配置**: `config/proxy.ts` 及 `publicPath` 必须动态设置为 `/${project_name}/`。
    - **后端配置**: Express 路由前缀及 Nginx `location` 必须动态匹配 `/${project_name}/api/`。
    - **严禁硬编码**: 严禁在配置文件或脚本中写死具体的路径字符串，必须使用变量引用项目名称。
3.  **PM 即时指挥权**: 发现配置偏离动态二级路由规范，必须**立即**驳回并责令相关角色整改。
4.  **线上真实性探测**: PM 必须亲自验证 `https://domain.com/{project_name}` 的连通性。
5.  **端到端验收标准**: 必须在浏览器中完成从动态二级路径入口开始的完整业务流程。
6.  **整改闭环机制**: 驳回即重做，PM 必须进行二次复核。
7.  **版本号先行**: 每次需求开发前必须先确认并更新项目版本号。
8.  **生产部署分支锁定**: 生产环境必须且只能从 `release/v{version}` 分支进行部署。
9.  **报告输出规范**: 所有生成的报告必须保存为 `.md` 格式，并严格遵循 `{REPORT_NAME}_v{version}.md` 的命名规则。

---

## 2. 角色自动执行清单 (Auto-Execution List) - **核心驱动**

### 📝 PM/Architect Agent (项目经理/架构) - **监督者与规范校准者**
*   **触发条件**: 任务分配前、配置修改后、或发现线上访问异常。
*   **自动动作**: 
    1.  **规范同步**: 在分配任务时，**必须显式声明**：“本项目采用动态二级路由 `/${package_json.name}` 部署，请确保所有路径配置与此一致。”
    2.  **配置审计**: 检查 `nginx.conf`, `config/proxy.ts`, `app.js` 是否使用了动态变量而非硬编码路径。
    3.  **线上连通性探测**: 执行 `curl -I https://zhoubichuan.com/${project_name}`。

### 👷‍♂️ DevOps Agent (运维) - **动态路径配置执行者**
*   **触发条件**: 收到部署指令或配置更新。
*   **自动动作**: 
    1.  **Nginx 路径映射**: 确保 `location /${project_name}/` 正确指向静态资源目录。
    2.  **API 代理重写**: 在 Nginx 中配置 `rewrite ^/${project_name}/api/(.*)$ /$1 break;` 以适配后端根路径 API。

### 💻 Frontend Agent (前端) - **路径适配者**
*   **触发条件**: 构建前或收到 PM 指令。
*   **自动动作**: 
    1.  **PublicPath 设置**: 确保 `config/config.ts` 中 `publicPath: '/${project_name}/'`。
    2.  **Proxy 配置**: 确保 `proxy` 配置中的 `pathRewrite` 能正确处理动态二级路径。

---

## 3. 强制验证红线 (Quality Gates)

### 3.1 架构与配置阶段
- [ ] **动态路径一致性**: 前端 `publicPath`、Nginx `location`、后端路由前缀必须完全匹配 `package.json` 中的项目名称。
- [ ] **API 转发逻辑**: Nginx 必须能将 `/${project_name}/api/xxx` 正确转发至后端服务的 `/api/xxx`。

### 3.3 部署后验证（严格标准 + 真实探测）
- [ ] **HTTP 状态码**: PM 必须确认 `https://zhoubichuan.com/${project_name}` 返回 **200 OK**。
- [ ] **资源加载**: 浏览器控制台无 CSS/JS 404 错误（路径应包含 `/${project_name}/`）。
- [ ] **接口连通性**: 页面内发起的 API 请求必须成功，无跨域或 404 错误。

---

## 5. 历史教训总结 (Lessons Learned)
- **拒绝硬编码**: 任何涉及项目标识的配置（如路径、服务名）都必须动态获取，严禁在 SOP 或代码中写死具体项目名称，以保证流程的通用性。
- **需求传达必须到位**: 项目初期的核心架构决策（如动态二级路由部署）必须在每次任务分配时重复强调。
- **配置即代码**: Nginx 和前端配置文件必须纳入版本控制，并由 PM 进行专项审计。
- **真实性高于一切**: 绝不能仅凭 AI 生成的文字就相信系统已上线，必须通过真实的网络请求（curl/浏览器）来验证动态路径下的可用性。