# HAP 开发技能包 (HAP-DEV-Skills)

> 专为 AI 辅助开发设计的 HAP 平台技能文档集

## 📌 重要说明

本技能包是**专为 AI 阅读和理解**设计的 HAP 开发文档，主要用于指导 AI 在使用 HAP 相关工具时不犯错。

**请 AI 务必遵守以下技能使用规范：**

---

## 🎯 技能使用规范（AI 必读）

### ⚠️ 技能选择原则

**只在明确需要时才读取对应技能文档,不要混用!**

每个技能文档有其特定的使用场景，请严格按照以下规则选择：

---

### 1️⃣ HAP-View-Plugin-Dev-Guide.md

**使用场景：**
- ✅ **仅当需要开发 HAP 视图插件时使用**
- ✅ 用户明确提到"开发视图插件"、"自定义视图"等

**不应使用的场景：**
- ❌ 普通的数据查询操作
- ❌ 通过 API 操作数据
- ❌ 搭建独立网站
- ❌ 使用 MCP 操作数据

**典型关键词：**
- "开发视图插件"
- "自定义看板"
- "HAP 内的自定义展示"
- "@mdfe/view SDK"
- "插件上传到 HAP"

**何时读取：**
```
用户说："我想开发一个自定义的甘特图视图插件"
→ ✅ 读取本文档

用户说："我想查询产品数据"
→ ❌ 不读取,应该使用 MCP 或 API
```

---

### 2️⃣ HAP-MCP-Usage-Guide.md

**使用场景：**
- ✅ **只要用户需要用到 MCP,都应该读取这个文档**
- ✅ 了解 HAP MCP 可用的工具和能力
- ✅ 理解 MCP 的使用场景和限制
- ✅ 作为 MCP 工具使用的参考手册

**不应使用的场景：**
- ❌ 开发视图插件时
- ❌ 编写独立前端代码时（应使用 HAP-API-Usage-Guide）

**典型关键词：**
- "MCP 可以做什么"
- "MCP 支持哪些操作"
- "查询数据"、"批量操作"、"创建工作表"
- 任何涉及 MCP 工具的操作

**何时读取：**
```
用户说："MCP 可以做什么？"
→ ✅ 读取本文档

用户说："帮我查询产品数据"（已有 MCP 连接）
→ ✅ 读取本文档，了解如何使用 MCP 查询工具

用户说："搭建一个官网"（需要用 MCP 创建表结构）
→ ✅ 读取本文档，了解如何用 MCP 管理应用结构
```

---

### 3️⃣ HAP-API-Usage-Guide.md

**使用场景：**
- ✅ **需要通过 API 直接操作 HAP 数据**
- ✅ 在独立项目（非 HAP 内）中集成 HAP API
- ✅ 了解 API 端点、鉴权、筛选器语法
- ✅ 字段类型处理和数据格式转换
- ✅ 视图插件中，当 SDK 函数能力不足时，使用 API 补充

**不应使用的场景：**
- ❌ 视图插件开发中，优先使用 @mdfe/view SDK
- ❌ 通过 MCP 操作数据时（MCP 已封装 API，有更简单的调用方式）

**使用优先级：**
```
视图插件开发：
  优先级 1: @mdfe/view SDK（useData、updateRow 等）
  优先级 2: API V3（SDK 无法满足需求时）

独立项目开发：
  直接使用: API V3（唯一选择）

MCP 操作：
  直接使用: MCP 工具（不需要手动调 API）
```

**典型关键词：**
- "API 调用"
- "筛选器语法"
- "字段类型"
- "鉴权配置"
- "HAP-Appkey"、"HAP-Sign"

**何时读取：**
```
用户说："我要在 React 项目中调用 HAP API 查询数据"
→ ✅ 读取本文档

用户说："视图插件的 SDK 无法实现复杂查询"
→ ✅ 读取本文档，了解如何在插件中使用 API

用户说："我要开发 HAP 插件"
→ ❌ 先读取 HAP-View-Plugin-Dev-Guide
```

---

### 4️⃣ HAP-As-Database-Guide.md

**使用场景：**
- ✅ **使用 HAP 作为数据库,搭建独立的前后端项目**
- ✅ 开发企业官网、内容管理系统、数据展示平台
- ✅ HAP 仅作为后台数据存储,前端完全独立

**不应使用的场景：**
- ❌ 开发 HAP 内的视图插件
- ❌ 仅做数据查询或 CRUD 操作
- ❌ 通过 MCP 操作数据

**典型关键词：**
- "搭建网站"
- "企业官网"
- "前后端分离"
- "HAP 作为数据库"
- "Vercel 部署"

**何时读取：**
```
用户说："我想搭建一个产品展示官网,用 HAP 存储数据"
→ ✅ 读取本文档

用户说："我想在 HAP 里查询数据"
→ ❌ 不读取,应该使用 MCP 或 API 文档
```

---

## 📚 技能文档列表

| 技能文档 | 使用场景 | 关键技术 | 难度 |
|---------|---------|---------|------|
| [HAP-MCP-Usage-Guide.md](HAP-MCP-Usage-Guide.md) | 了解 MCP 能力和限制 | MCP Server | ⭐ |
| [HAP-API-Usage-Guide.md](HAP-API-Usage-Guide.md) | 独立项目中调用 HAP API | REST API、筛选器 | ⭐⭐⭐ |
| [HAP-View-Plugin-Dev-Guide.md](HAP-View-Plugin-Dev-Guide.md) | 开发 HAP 视图插件 | React、@mdfe/view | ⭐⭐⭐⭐ |
| [HAP-As-Database-Guide.md](HAP-As-Database-Guide.md) | 搭建独立网站,HAP 作为数据库 | 前后端分离、部署 | ⭐⭐⭐⭐ |

---

## 🔄 技能使用流程图

```
用户需求
    ↓
┌───────────────────────────────────────┐
│ 判断：是否在 HAP 内开发视图插件？       │
└───────────────────────────────────────┘
         ↓ 是                    ↓ 否
    读取 HAP-View-Plugin         ↓
                    ┌─────────────────────────────┐
                    │ 判断：是否搭建独立网站？      │
                    └─────────────────────────────┘
                              ↓ 是           ↓ 否
                         读取 HAP-As-Database  ↓
                                    ┌──────────────────────┐
                                    │ 判断：是否需要了解 API？│
                                    └──────────────────────┘
                                         ↓ 是         ↓ 否
                                    读取 HAP-API      直接使用 MCP
```

---

## ⚠️ 常见错误场景（AI 必须避免）

### ❌ 错误 1: 在开发视图插件时使用 API V3 端点

```javascript
// ❌ 错误示例：在视图插件中使用 API V3
fetch('https://api.mingdao.com/v3/app/worksheets/{id}/rows/list', {
    headers: {
        'HAP-Appkey': 'xxx',
        'HAP-Sign': 'xxx'
    }
})

// ✅ 正确做法：使用 @mdfe/view SDK
import { useData, updateRow } from '@mdfe/view';
const { data } = useData();
```

**原因：** 视图插件运行在 HAP 内部,应使用 SDK 提供的 Hook,不需要自己调用 API。

---

### ❌ 错误 2: 搭建独立网站时试图使用视图插件 SDK

```javascript
// ❌ 错误示例：在独立网站中使用 @mdfe/view
import { useData } from '@mdfe/view';  // 这是视图插件 SDK！

// ✅ 正确做法：直接调用 API V3
fetch('https://api.mingdao.com/v3/app/worksheets/{id}/rows/list', {
    method: 'POST',
    headers: {
        'HAP-Appkey': 'xxx',
        'HAP-Sign': 'xxx'
    }
})
```

**原因：** 独立网站不在 HAP 环境内运行,必须通过 API 调用。

---

### ❌ 错误 3: 不读取 MCP 文档就使用 MCP 工具

```
用户："帮我查询产品数据"
AI："好的，我直接调用 MCP 查询工具..."

// ❌ 错误：没有先读取 MCP 文档了解工具用法
// ✅ 正确：先读取 HAP-MCP-Usage-Guide，了解可用工具和参数
```

**原因：** MCP 文档包含了工具的正确用法、参数说明、最佳实践，不读取容易出错。

---

### ❌ 错误 4: 在独立网站项目中读取 MCP 文档而不是 API 文档

```
用户："我要在 React 项目中查询 HAP 数据"
AI："让我先读取 HAP-MCP-Usage-Guide..."

// ❌ 错误：独立前端项目应该用 API，不是 MCP
// ✅ 正确：读取 HAP-API-Usage-Guide，了解 API V3 调用方式
```

**原因：** 前端代码运行在浏览器，不能调用 MCP，必须通过 HTTP API。

---

## 🎯 AI 最佳实践

### 1. 先判断场景,再选择技能

```
步骤 1: 理解用户需求
步骤 2: 判断属于哪个场景
步骤 3: 只读取对应的技能文档
步骤 4: 执行任务
```

### 2. 使用关键词快速判断

| 关键词 | 对应技能 |
|-------|---------|
| "开发插件"、"自定义视图"、"@mdfe/view" | HAP-View-Plugin-Dev-Guide |
| "搭建网站"、"企业官网"、"前后端分离" | HAP-As-Database-Guide |
| "API 调用"、"筛选器"、"鉴权"（独立项目中） | HAP-API-Usage-Guide |
| "查询数据"、"批量操作"、"创建工作表"（通过 MCP） | HAP-MCP-Usage-Guide |
| "MCP 能力"、"MCP 支持什么"、任何 MCP 操作 | HAP-MCP-Usage-Guide |

### 3. MCP 使用的正确姿势

```
// ✅ 正确做法
用户："查询产品数据"（已有 MCP）
AI：
  步骤 1: 读取 HAP-MCP-Usage-Guide（了解查询工具的用法）
  步骤 2: 调用 mcp__hap_mcp____get_record_list（正确使用工具）

// ❌ 错误做法 1：不读文档
用户："查询产品数据"
AI：直接调用 MCP 工具 → 可能参数错误

// ❌ 错误做法 2：读错文档
用户："查询产品数据"
AI：读取 HAP-API-Usage-Guide → MCP 和 API 调用方式不同
```

---

## 🔑 核心概念速查（跨技能通用）

### HAP API V3 筛选器语法（重要！）

所有技能都可能用到：

```javascript
filter: {
    type: 'group',          // 'group' 或 'condition'
    logic: 'AND',           // 'AND' 或 'OR'（仅 group 需要）
    children: [{
        type: 'condition',
        field: '字段ID',     // ⚠️ 必须是字段 ID,不是字段名
        operator: 'eq',     // 操作符
        value: ['值']       // ⚠️ 必须是数组
    }]
}
```

### 常用操作符

| 操作符 | 说明 | value 格式 |
|-------|------|-----------|
| `eq` | 等于 | `['客厅']` |
| `ne` | 不等于 | `['卧室']` |
| `contains` | 包含 | `['沙发']` |
| `gt` / `gte` | 大于/大于等于 | `['1000']` |
| `lt` / `lte` | 小于/小于等于 | `['5000']` |
| `between` | 介于 | `['1000', '5000']` |
| `isempty` | 为空 | `[]` |
| `isnotempty` | 不为空 | `[]` |

### 字段类型对照表

| 字段类型 | type | API 返回 | 示例 |
|---------|------|---------|------|
| 文本 | 2/41 | `string` | `"产品名称"` |
| 数值 | 6 | `number` | `1999` |
| 检查框 | 36 | `"1"` / `"0"` | `"1"` |
| 单选 | 11 | `string` | `"客厅"` |
| 多选 | 10 | `string[]` | `["现代", "简约"]` |
| 附件 | 14 | `Array<{url, name}>` | `[{url: "..."}]` |
| 日期 | 15/16 | `string` | `"2024-01-01"` |
| 关联记录 | 29 | `Array<{sid, name}>` | `[{sid: "xxx"}]` |

---

## 📖 快速导航

### 我该看哪个技能？

#### 场景 1: 开发 HAP 视图插件
→ [HAP-View-Plugin-Dev-Guide.md](HAP-View-Plugin-Dev-Guide.md)

**适用于：**
- 开发自定义看板、列表、甘特图、地图等视图
- 扩展 HAP 内置视图功能
- 为特定业务场景定制界面

**核心技术：**
- React + TypeScript + Vite
- @mdfe/view SDK
- useData、useFields、updateRow

---

#### 场景 2: 搭建独立网站（HAP 作为数据库）
→ [HAP-As-Database-Guide.md](HAP-As-Database-Guide.md)

**适用于：**
- 企业官网（产品展示、新闻资讯）
- 内容管理系统（博客、文档库）
- 数据展示平台（看板、报表）
- 表单收集系统（在线预约、问卷）

**核心技术：**
- 前后端分离
- HAP API V3 集成
- Vercel/Netlify 部署

---

#### 场景 3: 在项目中调用 HAP API
→ [HAP-API-Usage-Guide.md](HAP-API-Usage-Guide.md)

**适用于：**
- 在外部系统中读取/写入 HAP 数据
- 开发后端服务与 HAP 集成
- 批量数据导入/导出
- 数据同步和迁移

**核心技术：**
- REST API V3
- 筛选器语法
- 字段类型处理
- 鉴权配置

---

#### 场景 4: 了解 MCP 能力
→ [HAP-MCP-Usage-Guide.md](HAP-MCP-Usage-Guide.md)

**适用于：**
- 了解 MCP 支持哪些操作
- 理解 MCP 的使用限制
- 查看可用的 MCP 工具列表

**核心技术：**
- MCP Server
- MCP 工具集
- AI 辅助开发

---

## 🚀 AI 工作流推荐

### 流程 1: 开发视图插件

```
1. 用户："我要开发一个甘特图插件"
2. AI 判断：属于视图插件开发场景
3. AI 读取：HAP-View-Plugin-Dev-Guide.md
4. AI 执行：初始化项目、安装 @mdfe/view、编写代码
```

### 流程 2: 搭建独立网站

```
1. 用户："我要搭建一个产品展示官网"
2. AI 判断：属于独立网站场景
3. AI 读取：HAP-As-Database-Guide.md
4. AI 执行：创建项目结构、配置 API、编写前端代码
```

### 流程 3: 通过 MCP 查询数据

```
1. 用户："查询所有已上架的产品"
2. AI 判断：已有 MCP 连接，需要使用 MCP 工具
3. AI 读取：HAP-MCP-Usage-Guide.md（了解查询工具用法）
4. AI 调用：mcp__hap_mcp____get_record_list（正确传参）
```

### 流程 4: 独立项目中使用 API

```
1. 用户："我在 Next.js 项目中需要查询 HAP 数据"
2. AI 判断：独立前端项目，需要通过 API
3. AI 读取：HAP-API-Usage-Guide.md（了解 API V3 用法）
4. AI 编写：fetch 调用代码，正确配置 headers 和 filter
```

---

## 📦 资源和工具

### 示例项目
- **定制家具官网**: 完整的前后端分离项目示例
  - 位置: `/Users/yxzuji/ai-xhs/furniture-website/`
  - 包含: 轮播图、产品展示、案例展示、在线询价

### 示例图片资源（可直接使用）
```javascript
const SAMPLE_IMAGES = [
    'https://m1.mingdaoyun.cn/doc/20251205/095p6B8tbW3x9v1A5lc41O8QdYaua101bM8Wb7442Q2ZfKb21m8deM1U0r4UaC9h.png',
    'https://m1.mingdaoyun.cn/doc/20251205/1B4Ed46s1a3wfaeI2RaBdM1Ybb4MeB0je21WcH2d7mal8Q667i2w0A2EaW1t02cS.png',
    'https://m1.mingdaoyun.cn/doc/20251205/0u1r8Rcjb39Uc5fT1edP3w9q8q5y0lc45c657Q8zfG768S3XbF9N148X8Qfc1Rdq.png',
    'https://m1.mingdaoyun.cn/doc/20251205/by1w2D5F9sf08UaL0ddre45x7l1q51cKcT3Pca034h1Pe3b69S9U4O2K0x8T1Nda.png',
    'https://m1.mingdaoyun.cn/doc/20251205/bx6XfH1Neu977X0u6BaB8Q1Occ7ededVdab31QeXfm5vbJ490sda8DddcXadeM22.png',
    'https://m1.mingdaoyun.cn/doc/20251205/8Xd940d48B0t7X3b2tfibo05dcbO1U0B1T9Pfbdye83X3f3S82aj9E625j7a127V.png',
    'https://m1.mingdaoyun.cn/doc/20251205/4rc64S601gaHa78qajbPdRde342V8Z5IcO5m2L848Q7wbtaI9Nd98teDbB5o8Kd9.png',
    'https://m1.mingdaoyun.cn/doc/20251205/9o8r6Lau4s3S5Uen4naY3pfTdGdBb7d3953cbu0U3H22e14Xb71D8e3weDcpf90S.png'
];
```

### 开发工具
- **Node.js**: 视图插件开发
- **Vite**: 插件构建工具
- **Python HTTP Server**: 本地开发服务器
- **Vercel CLI**: 快速部署

---

## 📞 相关链接

- [HAP 官方网站](https://www.mingdao.com)
- [HAP API 官方文档](https://api.mingdao.com/docs)
- [明道云帮助中心](https://help.mingdao.com)
- [明道云社区](https://bbs.mingdao.com)

---

## 📄 版本信息

- **版本**: v2.0.0
- **更新日期**: 2026-01-12
- **维护者**: Claude Code
- **License**: MIT

---

**⚠️ 重要提醒：本技能包专为 AI 设计,请 AI 严格遵守技能使用规范,避免混用导致错误！**
