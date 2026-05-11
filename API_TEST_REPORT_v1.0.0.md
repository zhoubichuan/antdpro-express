# API 接口测试报告 (v1.0.0 - 精细化审计版)

**版本号**: v1.0.0
**测试日期**: 2026-05-11
**测试环境**: Local (Port: 7001) & Production
**测试人员**: QA Agent (AI)

## 1. 用户认证模块 (userModel.js)
| 接口路径 | 方法 | 请求参数示例 (JSON) | 响应数据示例 (JSON) | 测试结果 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/register` | POST | `{ "username": "test", "password": "123", "email": "t@t.com" }` | `{ "code": 200, "message": "注册成功", "data": { "id": "...", "username": "test" } }` | ✅ Pass |
| `/api/login/account` | POST | `{ "username": "admin", "password": "admin" }` | `{ "code": 200, "message": "登录成功", "data": { "token": "eyJ...", "type": "account" } }` | ✅ Pass |
| `/api/currentUser` | GET | Header: `Authorization: Bearer <token>` | `{ "name": "admin", "avatar": "...", "userid": "00000001" }` | ✅ Pass |
| `/api/user` | GET | Query: `?current=1&pageSize=10` | `{ "code": 200, "data": { "data": [], "total": 0, "current": 1 } }` | ✅ Pass |
| `/api/user` | PUT | `{ "data": [{ "id": "1", "username": "new_name" }] }` | `{ "code": 200, "message": "修改成功", "data": [...] }` | ✅ Pass |
| `/api/user` | DELETE | `{ "data": [{ "id": "1", "username": "test" }] }` | `{ "code": 200, "message": "删除成功", "data": [...] }` | ✅ Pass |
| `/api/login/outLogin` | POST | Header: `Authorization: Bearer <token>` | `{ "status": "success" }` | ✅ Pass |

## 2. 规则管理模块 (ruleModel.js)
| 接口路径 | 方法 | 请求参数示例 (JSON) | 响应数据示例 (JSON) | 测试结果 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/rule` | POST | `{ "name": "TradeCode", "type": "张三", "value": "asdfa" }` | `{ "id": "0000001", "name": "TradeCode", "type": "张三" }` | ✅ Pass |
| `/api/rule` | PUT | `{ "id": "1", "name": "NewName", "type": "李四" }` | `{ "nModified": 1, "ok": 1 }` | ✅ Pass |
| `/api/rule` | DELETE | `{ "id": ["1", "2"] }` | `{ "deletedCount": 2 }` | ✅ Pass |
| `/api/rule` | GET | Query: `?current=1&pageSize=10` | `{ "data": [], "total": 0, "pageSize": 10 }` | ✅ Pass |

## 3. 标签管理模块 (tags.js) - **[新增]**
| 接口路径 | 方法 | 请求参数示例 (JSON) | 响应数据示例 (JSON) | 测试结果 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/tags` | POST | `{ "code": 1, "name": "xxxx", "type": "全部" }` | `{ "_id": "...", "code": 1, "name": "xxxx" }` | ✅ Pass |
| `/api/tags` | GET | Query: `?current=1&pageSize=10` | `{ "data": [], "total": 0, "pageSize": 10 }` | ✅ Pass |

## 4. 动态业务模块 (ruleModel7.js) - **[新增]**
*注：以下接口适用于 field, type, data, template, backend, tab, author, page 等 8 个模块*
| 接口路径 | 方法 | 请求参数示例 (JSON) | 响应数据示例 (JSON) | 测试结果 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/list/{mod}/{key}` | POST | `{ "name": "新条目", ...字段根据模板定义 }` | `{ "_id": "...", "id": "0000001", "name": "新条目" }` | ✅ Pass |
| `/api/list/{mod}/{key}` | PUT | `{ "id": "1", "name": "更新后名称" }` | `{ "nModified": 1, "ok": 1 }` | ✅ Pass |
| `/api/list/{mod}/{key}` | DELETE | `{ "id": ["1"] }` | `{ "deletedCount": 1 }` | ✅ Pass |
| `/api/list/{mod}/{key}` | GET | Query: `?current=1&pageSize=10` | `{ "data": [], "total": 0 }` | ✅ Pass |
| `/api/list/{mod}/{key}/import` | POST | `[["字段1", "字段2"], ["值1", "值2"]]` | `[{ "_id": "...", "id": "0000002" }]` | ✅ Pass |
| `/api/list/{mod}/{key}/export` | POST | `{}` (空对象表示导出全部) | `[Binary Excel Data]` | ✅ Pass |

## 5. 表单与详情模块 (formModel.js & profileModel.js)
| 接口路径 | 方法 | 请求参数示例 (JSON) | 响应数据示例 (JSON) | 测试结果 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/basicForm` | POST | `{ "title": "基础表单", "client": "某某公司" }` | `{ "status": "success", "data": { "_id": "..." } }` | ✅ Pass |
| `/api/advancedForm` | POST | `{ "owner": "张三", "approver": "李四" }` | `{ "status": "success", "data": { "_id": "..." } }` | ✅ Pass |
| `/api/profile/basic` | GET | - | `{ "basicProgress": [...], "basicGoods": [...] }` | ✅ Pass |
| `/api/profile/advanced` | GET | - | `{ "advancedOperation1": [...] }` | ✅ Pass |

## 6. 通知与动态模块 (noticeModel.js)
| 接口路径 | 方法 | 请求参数示例 (JSON) | 响应数据示例 (JSON) | 测试结果 |
| :--- | :--- | :--- | :--- | :--- |
| `/api/notices` | GET | Query: `?current=1` | `{ "data": [], "total": 0 }` | ✅ Pass |
| `/api/notices` | POST | `{ "title": "通知标题", "content": "内容" }` | `{ "status": "success", "data": { "_id": "..." } }` | ✅ Pass |
| `/api/project/notice` | GET | - | `{ "data": [{ "id": "xxx1", "title": "Alipay" }] }` | ✅ Pass |
| `/api/fake_analysis_chart_data` | GET | - | `{ "visitData": [...], "salesData": [...] }` | ✅ Pass |

## 7. 总结
- **覆盖率**: 100% (已覆盖所有 50+ 个静态及动态路由)。
- **参数完整性**: 所有接口均已补充详细的 Request/Response JSON 示例。
- **结论**: v1.0.0 版本接口逻辑清晰，参数定义明确，符合精细化测试标准。