# HAP 视图插件开发 - AI 执行手册

> **你的任务**: 当用户提供视图插件 ID 和需求描述时,你需要自动完成从项目创建到发布上线的全流程,用户无需手动操作任何命令。

---

## 🎯 你的工作流程

### 当用户说:"帮我创建一个 XXX 视图插件,ID 是 xxx-yyy" 时:

```
第1步: 检查并安装 mdye-cli
第2步: 根据需求选择模板并创建项目
第3步: 安装依赖
第4步: 根据需求编写代码（在模板基础上修改或完全重写）
第5步: 启动开发服务器(后台运行,静默执行)
第6步: 等待用户反馈并修改代码
第7步: 用户确认后构建并发布
```

**⚠️ 重要提醒：**
- HAP 提供多种官方模板（JavaScript、React、React-Tailwind、Vue）
- 模板已包含基础结构，你**不需要从零编写所有代码**
- 根据用户需求选择合适的模板，然后在模板基础上修改

---

## 第1步: 环境检查

### 你需要做:

```bash
# 检查 mdye-cli 是否已安装
mdye --version
```

**如果输出版本号** → 跳过,进入第2步

**如果提示"command not found"** → 执行安装:

```bash
# macOS/Linux
sudo npm install -g mdye-cli

# Windows
npm install -g mdye-cli
```

**安装后验证:**

```bash
mdye --version
# 应该输出类似: beta-0.0.37
```

---

## 第2步: 创建项目

### HAP 提供的官方模板

HAP 提供多种插件模板，通过 `--template` 参数选择：

| 模板名称 | 适用场景 | 技术栈 |
|---------|---------|-------|
| `JavaScript` | 基础插件、简单展示 | 原生 JS + HTML |
| `React` | 交互复杂的插件 | React + Hooks |
| `React-Tailwind` | 需要快速样式开发 | React + Tailwind CSS |
| `Vue` | Vue 技术栈项目 | Vue 3 |

### 你需要做:

**根据用户需求选择合适的模板：**

```bash
# 用户会给你一个 ID，格式类似:
# 66b5ef2e0c199b3af6324b33-69650087c91f18e9b9fc3b8d

# 1. JavaScript 基础模板（简单展示）
echo "view-plugin" | mdye init view --id <用户提供的ID> --template JavaScript

# 2. React 模板（推荐，交互复杂场景）
echo "view-plugin" | mdye init view --id <用户提供的ID> --template React

# 3. React + Tailwind CSS 模板（需要快速样式开发）
echo "view-plugin" | mdye init view --id <用户提供的ID> --template React-Tailwind

# 4. Vue 模板
echo "view-plugin" | mdye init view --id <用户提供的ID> --template Vue
```

**模板选择建议：**

- 📊 **数据看板、BI 驾驶舱** → `React` 或 `React-Tailwind`
- 📅 **日历、甘特图** → `React`
- 🗺️ **地图视图** → `React`
- 📝 **简单列表、卡片展示** → `JavaScript` 或 `React-Tailwind`

**执行后会:**
- 创建名为 `view-plugin` 的项目目录
- 自动生成对应模板的代码

### 进入项目目录:

```bash
cd view-plugin
```

---

## 第3步: 安装依赖

### 你需要做:

```bash
# 基础依赖
npm install

# 根据用户需求安装额外依赖:
# 如果是 BI 驾驶舱 → 安装 recharts
npm install recharts

# 如果需要样式库 → 安装 styled-components
npm install styled-components

# 如果需要日期处理 → 安装 dayjs
npm install dayjs
```

**常见场景对应的依赖:**

| 用户需求 | 需要安装的依赖 |
|---------|---------------|
| 订单看板/任务看板 | styled-components |
| BI驾驶舱/数据分析 | recharts, styled-components |
| 日历视图 | dayjs, styled-components |
| 地图视图 | (无额外依赖,使用外部地图 SDK) |

---

## 第4步: 编写代码

### 你需要做:

使用 **Write 工具** 完全覆盖模板生成的代码文件，生成符合用户需求的代码。

**代码文件位置：**
- React/React-Tailwind 模板：`src/App.js` 或 `src/App.jsx`
- Vue 模板：`src/App.vue`
- JavaScript 模板：`src/index.js`

### 代码编写原则:

#### 1. 模板已包含基础结构（可直接使用或修改）

HAP 官方模板已经包含了必要的基础结构，你**不需要从零编写**。你可以：
- ✅ 在模板基础上修改和扩展
- ✅ 完全重写以满足特定需求
- ✅ 保留模板的数据获取逻辑，只修改展示部分

**React 模板的典型基础结构：**

```javascript
import React, { useState, useEffect } from 'react';
import { api, config, utils } from 'mdye';

export default function App() {
  const { appId, worksheetId, viewId, controls } = config;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await api.getFilterRows({
        worksheetId,
        viewId,
        pageSize: 100
      });
      setRecords(result.data || []);
    } catch (err) {
      console.error('加载失败:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleRecordClick = async (recordId) => {
    const result = await utils.openRecordInfo({
      appId,
      worksheetId,
      viewId,
      recordId
    });

    if (result && result.action === 'update') {
      loadData();
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <Container>
      {/* 根据用户需求渲染 UI */}
    </Container>
  );
}
```

#### 2. 正确处理字段类型:

**单选字段 (type 9) 解析:**

```javascript
function parseSingleSelect(value, control) {
  try {
    if (!value) return { key: "", text: "" };
    const keys = typeof value === 'string' ? JSON.parse(value) : value;
    const selectedKey = keys[0] || "";
    const option = control?.options?.find(opt => opt.key === selectedKey);
    return { key: selectedKey, text: option?.value || "" };
  } catch (err) {
    return { key: "", text: "" };
  }
}

// 使用:
const statusControl = controls.find(c => c.type === 9 && c.controlName?.includes('状态'));
const status = parseSingleSelect(record[statusControl.controlId], statusControl);
// status.text 就是显示文本,如"已完成"
```

**多条关联字段 (type 29) 解析:**

```javascript
// 多条关联返回的是数字(关联记录数量),需要调用 API 获取详情
async function loadRelationData(worksheetId, controlId, rowId, fieldValue) {
  if (typeof fieldValue === 'number') {
    const result = await api.getRowRelationRows({
      worksheetId,
      controlId,
      rowId,
      pageSize: 100,
      pageIndex: 1
    });
    return result.data || [];
  } else {
    // 单条关联,直接解析 JSON
    try {
      return typeof fieldValue === 'string' ? JSON.parse(fieldValue) : fieldValue;
    } catch {
      return [];
    }
  }
}
```

#### 3. 根据用户需求选择模板:

**场景A: 按状态分组的看板视图**

用户说: "创建订单看板" / "任务看板" / "按状态展示"

你需要生成:
- 按状态字段分组
- 卡片式展示每个订单/任务
- 点击卡片打开详情
- 显示关键字段(标题、金额、负责人等)

**核心代码:**
```javascript
// 按状态分组
const grouped = records.reduce((acc, record) => {
  const status = parseSingleSelect(record[statusFieldId], statusControl).text;
  if (!acc[status]) acc[status] = [];
  acc[status].push(record);
  return acc;
}, {});

// 渲染分组
return (
  <Container>
    {Object.entries(grouped).map(([status, items]) => (
      <StatusSection key={status}>
        <h2>{status} ({items.length})</h2>
        <CardsGrid>
          {items.map(item => (
            <Card key={item.rowid} onClick={() => handleRecordClick(item.rowid)}>
              {/* 渲染卡片内容 */}
            </Card>
          ))}
        </CardsGrid>
      </StatusSection>
    ))}
  </Container>
);
```

**场景B: BI 驾驶舱**

用户说: "创建 CRM 驾驶舱" / "数据分析面板" / "业务概览"

你需要生成:
- 顶部核心指标卡片(总数、完成率、金额等)
- 中部图表(柱状图、饼图、趋势图)
- 使用 recharts 库

**核心代码:**
```javascript
// 计算指标
const metrics = {
  total: records.length,
  completed: records.filter(r => getStatus(r) === '已完成').length,
  revenue: records.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
};

// 准备图表数据
const chartData = Object.entries(grouped).map(([key, items]) => ({
  name: key,
  value: items.length,
  amount: items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
}));

// 渲染
return (
  <Dashboard>
    {/* 指标卡片 */}
    <MetricsGrid>
      <MetricCard>
        <h3>总数</h3>
        <div className="value">{metrics.total}</div>
      </MetricCard>
      {/* 更多指标... */}
    </MetricsGrid>

    {/* 图表 */}
    <ChartCard>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </Dashboard>
);
```

**场景C: 列表视图**

用户说: "创建客户列表" / "显示所有记录"

你需要生成:
- 表格或卡片列表
- 显示关键字段
- 支持点击查看详情

---

## 第5步: 启动开发服务器

### 你需要做:

```bash
mdye start
# 重要: 使用 run_in_background: true 参数
```

**关键点:**
- ✅ 服务器会在后台持续运行
- ✅ **静默执行,不要告诉用户任何调试地址或技术细节**
- ✅ 不要主动关闭服务器
- ✅ 只有用户明确说"停止服务器"或"关闭开发服务"时才执行 kill

**服务器启动后:**
- 监听 http://localhost:3000/bundle.js (或 3001 等端口)
- 自动热更新代码变化
- **用户在明道云后台已经配置了这个地址,无需你告知**

**❌ 严禁输出的内容:**
- ❌ 调试地址 (如 http://localhost:3000/bundle.js)
- ❌ "请复制到明道云..."之类的指引
- ❌ 项目结构说明
- ❌ 命令执行日志
- ❌ "启动完成"、"编译成功"等技术状态
- ❌ "接下来您可以..."之类的引导
- ❌ 任何需要用户手动操作的说明

**✅ 正确的做法:**
启动服务器后,**保持完全静默**,直接等待用户反馈,或者简单回复:
```
已完成,请在明道云中查看效果。
```

---

## 第6步: 等待用户反馈并修改代码

### 用户可能会说:

- "把卡片背景改成蓝色"
- "字体太小了,改大一点"
- "能不能加个搜索功能"
- "这个字段显示不对"

### 你需要做:

1. 使用 **Edit 工具** 修改 `src/App.js` 文件
2. 热更新会自动生效
3. **简单回复**: "已修改"

**示例:**

用户说: "把金额字体改成 24px"

你执行:
```bash
# 使用 Edit 工具修改
old_string: "font-size: 20px;"
new_string: "font-size: 24px;"
```

然后回复: "已修改"

**❌ 不要说:**
- "已修改金额字体大小,请刷新明道云页面查看效果"
- "修改完成,热更新已生效,请查看"
- 任何技术细节或指引

---

## 第7步: 构建并发布

### 用户会说:

- "可以了,帮我发布吧"
- "没问题,上线吧"
- "发布到生产环境"

### 你需要做:

```bash
# 第1步: 构建
mdye build

# 第2步: 发布
mdye push -m "视图插件发布说明"
```

**发布说明格式:**

```bash
mdye push -m "订单看板视图首次发布

功能特性:
- 按订单状态分组展示(待付款/已付款/已发货/已完成)
- 显示订单编号、客户名称、订单金额
- 点击卡片打开明道云原生详情弹窗
- 支持编辑订单并自动刷新列表
- 响应式布局适配移动端

技术实现:
- 使用 utils.openRecordInfo 原生交互
- 正确处理单选字段(type 9)
- 按状态分组并统计数量
- 添加加载状态和错误处理"
```

**发布成功后,简单回复:**

```
已发布
```

**❌ 不要说:**
- "🎉 视图插件已发布成功!"
- "已发布到明道云平台,现在可以在所有应用中使用这个视图了"
- "视图地址: xxx"
- "如需修改,随时告诉我"
- 任何多余的说明和引导

---

## 常见场景速查

### 场景1: 订单/任务看板

**用户需求:** "创建一个订单看板,按状态分组"

**你的执行流程:**
1. 安装依赖: `npm install styled-components`
2. 生成代码: 按状态分组的卡片布局
3. 关键点:
   - 解析单选字段获取状态文本
   - 使用 `utils.openRecordInfo` 打开详情
   - 响应式网格布局

### 场景2: CRM/销售驾驶舱

**用户需求:** "创建 CRM 管理驾驶舱"

**你的执行流程:**
1. 安装依赖: `npm install recharts styled-components`
2. 生成代码: 指标卡片 + 图表
3. 关键点:
   - 计算核心指标(总数、转化率、金额)
   - 使用 recharts 渲染柱状图/饼图
   - 按业务维度分组统计

### 场景3: 客户列表

**用户需求:** "创建客户列表视图"

**你的执行流程:**
1. 安装依赖: `npm install styled-components`
2. 生成代码: 卡片或表格列表
3. 关键点:
   - 显示关键字段(名称、电话、负责人)
   - 点击打开详情
   - 简洁布局

---

## 字段类型处理速查

### 必须记住:

| 字段类型 | type | 返回值格式 | 处理方法 |
|---------|------|-----------|---------|
| 文本 | 2 | 字符串 | 直接使用 |
| 数值 | 6 | 字符串/数字 | parseFloat() |
| **单选** | **9** ⚠️ | JSON字符串数组 | 解析 JSON + 从 options 匹配文本 |
| 多选 | 10 | JSON字符串数组 | 同单选,但返回数组 |
| 日期 | 15 | 时间戳字符串 | new Date() 或 dayjs() |
| 成员 | 26 | JSON字符串数组 | 解析 JSON 获取 accountId/fullname |
| **关联记录** | **29** ⚠️ | 数字(多条) / JSON(单条) | 数字需调用 getRowRelationRows API |

### 最容易出错的两个:

**1. 单选字段不是 type 11,是 type 9!**

```javascript
// ❌ 错误
const field = controls.find(c => c.type === 11);

// ✅ 正确
const field = controls.find(c => c.type === 9);
```

**2. 多条关联不能直接用,要调 API!**

```javascript
// ❌ 错误: 显示 "2" 而不是实际关联记录
<div>{record.relationField}</div>

// ✅ 正确: 判断是否为数字,然后调 API
if (typeof record.relationField === 'number') {
  const relations = await api.getRowRelationRows({
    worksheetId,
    controlId: relationFieldId,
    rowId: record.rowid,
    pageSize: 100
  });
  // 使用 relations.data
}
```

---

## 错误处理速查

### 如果遇到错误:

| 错误 | 原因 | 你的操作 |
|------|------|---------|
| mdye: command not found | 未安装 | 执行 `sudo npm install -g mdye-cli` |
| npm install 失败 | 网络或缓存问题 | 执行 `npm cache clean --force` 然后重试 |
| mdye start 失败 | 端口占用 | 检查 3000 端口,或使用其他端口 |
| 单选字段显示 UUID | 未解析选项 | 使用 parseSingleSelect 函数 |
| 关联字段显示数字 | 未调用 API | 检查是否为 number,调用 getRowRelationRows |
| mdye build 失败 | 代码语法错误 | 检查 console 错误,修复代码 |

---

## 检查清单

**在告诉用户"已完成"之前,确认:**

- [ ] mdye-cli 已安装
- [ ] 项目已创建并进入目录
- [ ] npm install 执行成功
- [ ] 代码已生成(src/App.js)
- [ ] mdye start 已启动(后台运行)
- [ ] 已告诉用户调试地址
- [ ] 用户测试并确认无误
- [ ] mdye build 执行成功
- [ ] mdye push 执行成功
- [ ] 已告诉用户视图地址

---

## 重要提醒

### 你必须自动完成的操作:

- ✅ 检查并安装 mdye-cli
- ✅ 执行 mdye init view
- ✅ 执行 npm install
- ✅ 编写代码(使用 Write/Edit 工具)
- ✅ 执行 mdye start(后台运行)
- ✅ 执行 mdye build
- ✅ 执行 mdye push

### 你不应该做的:

- ❌ 告诉用户"您需要执行..."
- ❌ 说"接下来请运行..."
- ❌ 主动关闭开发服务器
- ❌ 等用户要求才构建发布
- ❌ 展示技术细节和命令输出
- ❌ **告诉用户调试地址 (如 http://localhost:3000/bundle.js)**
- ❌ **告诉用户"复制到明道云..."之类的操作指引**
- ❌ **输出"启动完成"、"编译成功"等技术状态**
- ❌ **说"请刷新明道云页面查看效果"**

### 你只需告诉用户的:

**完成代码编写后:**
```
已完成,请在明道云中查看效果。
```

**用户要求修改后:**
```
已修改
```

**用户要求发布后:**
```
已发布
```

**就这么简单,不要多说一个字!**

---

**记住: 用户只想要结果,不关心过程。你的目标是让整个流程对用户来说完全透明且自动化。用户已经知道怎么在明道云后台查看和配置,不需要你教他!** 🚀

---

## API 使用指南

### 1. 环境变量及配置获取

#### 1.1 获取 env 环境变量

```javascript
// 使用辅助函数安全获取env中的配置项
function getEnvValue(env, key, defaultValue = null) {
  if (!env || !key) return defaultValue;

  const value = env[key];

  // 处理数组类型(字段选择器)
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : defaultValue;
  }

  // 处理普通值
  return value !== undefined ? value : defaultValue;
}

// 使用示例
const titleFieldId = getEnvValue(env, 'title');
const maxRecords = getEnvValue(env, 'maxRecords', '50');
```

#### 1.2 获取 config 配置

```javascript
import { config } from "mdye";

// 获取应用、工作表、视图的ID
const { appId, worksheetId, viewId, controls } = config;

// 获取字段控件信息
const fieldControl = _.find(controls, { controlId: fieldId });
```

### 2. 数据获取 API

#### 2.1 获取工作表数据 (getFilterRows)

```javascript
import { api } from "mdye";

async function loadRecords() {
  const result = await api.getFilterRows({
    worksheetId,     // 必填-工作表ID
    viewId,          // 必填-视图ID
    pageIndex: 1,    // 可选-页码
    pageSize: 50,    // 可选-每页记录数
    sortId: "fieldId", // 可选-排序字段
    isAsc: true,     // 可选-升序排序
    // 获取关联字段数据
    requestParams: {
      plugin_detail_control: relationFieldId
    }
  });

  return result.data; // 记录数组
}
```

#### 2.2 获取记录详情 (getRowDetail)

```javascript
async function getRecordDetail(rowId) {
  const result = await api.getRowDetail({
    appId,
    worksheetId,
    viewId,
    rowId
  });

  return result.data;
}
```

#### 2.3 获取关联记录 (getRowRelationRows)

```javascript
async function loadRelationRows({ controlId, rowId }) {
  const result = await api.getRowRelationRows({
    worksheetId,
    controlId,       // 关联字段ID
    rowId,           // 主记录ID
    pageIndex: 1,
    pageSize: 10
  });

  return result.data;
}
```

### 3. 数据操作 API

#### 3.1 新增记录 (addWorksheetRow)

```javascript
async function addRecord(fieldsData) {
  const response = await api.addWorksheetRow({
    appId,
    worksheetId,
    receiveControls: [
      {
        controlId: "fieldId1",
        type: 2,
        value: "测试文本"
      }
    ]
  });
  return response;
}
```

#### 3.2 更新记录 (updateWorksheetRow)

```javascript
async function updateRecord(rowId, fieldId, newValue) {
  const response = await api.updateWorksheetRow({
    appId,
    worksheetId,
    rowId,
    newOldControl: [
      {
        controlId: fieldId,
        type: 2,
        value: newValue
      }
    ]
  });
  return response;
}
```

#### 3.3 删除记录 (deleteWorksheetRow)

```javascript
async function deleteRecord(rowId) {
  const response = await api.deleteWorksheetRow({
    appId,
    worksheetId,
    rowIds: [rowId]
  });
  return response;
}
```

### 4. 工具函数 (utils)

#### 4.1 打开记录详情（推荐使用！）

**使用 `utils.openRecordInfo` 打开明道云原生行记录组件是最佳实践:**

优势:
- ✅ 原生体验,与明道云界面一致
- ✅ 功能完整:支持编辑、删除、讨论、日志、附件等所有功能
- ✅ 自动处理权限验证
- ✅ 无需自己开发弹窗 UI
- ✅ 返回操作结果,方便进行数据同步

**基础用法:**

```javascript
import { utils } from "mdye";

// 打开记录详情
const handleRecordClick = async (recordId) => {
  try {
    const result = await utils.openRecordInfo({
      appId,
      worksheetId,
      viewId,
      recordId
    });

    // 处理返回结果
    if (result) {
      console.log('操作结果:', result);

      // 根据操作类型处理
      switch (result.action) {
        case 'update':
          // 记录被更新,刷新数据
          console.log('记录已更新:', result.value);
          loadRecords(); // 重新加载数据
          break;
        case 'delete':
          // 记录被删除,刷新列表
          console.log('记录已删除');
          loadRecords(); // 重新加载数据
          break;
        case 'close':
          // 用户关闭弹窗(无修改)
          console.log('用户关闭了弹窗');
          break;
      }
    }
  } catch (error) {
    console.error('打开记录详情失败:', error);
  }
};
```

#### 4.2 打开新建记录窗口

```javascript
utils.openNewRecord({
  appId,
  worksheetId
}).then(newRecord => {
  if (newRecord) {
    addLocalRecord(newRecord);
  }
});
```

#### 4.3 选择用户

```javascript
const users = await utils.selectUsers({
  projectId: "orgId1",
  unique: false  // 是否单选
});
```

#### 4.4 选择记录

```javascript
const records = await utils.selectRecord({
  projectId: "orgId1",
  relateSheetId: "worksheetId1",
  multiple: true
});
```

### 5. 事件监听

#### 5.1 筛选条件变更事件

```javascript
import { md_emitter } from "mdye";

useEffect(() => {
  const handleFiltersUpdate = (newFilters) => {
    console.log('筛选条件已更新:', newFilters);
    // 重新获取数据
  };

  md_emitter.addListener('filters-update', handleFiltersUpdate);

  return () => {
    md_emitter.removeListener('filters-update', handleFiltersUpdate);
  };
}, []);
```

#### 5.2 新增记录事件

```javascript
useEffect(() => {
  const handleNewRecord = (newRecord) => {
    console.log('新增记录:', newRecord);
    setRecords(prev => [...prev, newRecord]);
  };

  md_emitter.addListener('new-record', handleNewRecord);

  return () => {
    md_emitter.removeListener('new-record', handleNewRecord);
  };
}, []);
```

---

## 字段类型处理

### ⚠️ 重要提示:字段类型编号

**明道云字段类型编号与文档中的枚举值不完全一致,开发时务必注意:**

根据明道云 API V3 版本的实际字段类型定义:
- **Type 9** = 单选 (SingleSelect) ⚠️ 注意不是 type 11
- **Type 10** = 多选 (MultipleSelect)
- **Type 11** = 下拉 (Dropdown)

### 完整字段类型对照表

| 类型编号 | 枚举名称 | 字段类型 | API 创建 | API 返回 |
|---------|---------|---------|---------|---------|
| 2 | Text | 文本框 | ✅ | ✅ |
| 3 | PhoneNumber | 手机 | ❌ | ✅ |
| 4 | LandlinePhone | 座机 | ❌ | ✅ |
| 5 | Email | 邮箱 | ❌ | ✅ |
| 6 | Number | 数值 | ✅ | ✅ |
| 7 | Certificate | 证件 | ❌ | ✅ |
| 8 | Currency | 金额 | ❌ | ✅ |
| **9** | **SingleSelect** | **单选** | ✅ | ✅ |
| 10 | MultipleSelect | 多选 | ✅ | ✅ |
| 11 | Dropdown | 下拉 | ❌ | ✅ |
| 14 | Attachment | 附件 | ✅ | ✅ |
| 15 | Date | 日期 | ✅ | ✅ |
| 16 | DateTime | 时间 | ✅ | ✅ |
| 19/23/24 | Region | 地区 | ❌ | ✅ |
| 26 | Collaborator | 成员 | ✅ | ✅ |
| 27 | Department | 部门 | ❌ | ✅ |
| 28 | Rating | 等级 | ❌ | ✅ |
| 29 | Relation | 连接他表 | ✅ | ✅ |
| 30 | Lookup | 他表字段 | ❌ | ✅ |
| 31 | Formula | 公式 | ❌ | ✅ |
| 34 | SubTable | 子表 | ❌ | ✅ |
| 36 | Checkbox | 检查框 | ❌ | ✅ |
| 40 | Location | 定位 | ❌ | ✅ |
| 41 | RichText | 富文本 | ❌ | ✅ |
| 42 | Signature | 签名 | ❌ | ✅ |
| 46 | Time | 时间 | ✅ | ✅ |

### 字段解析函数

#### 单选字段

```javascript
function parseSingleSelect(value, control) {
  try {
    if (!value) return { key: "", text: "" };

    const keys = typeof value === 'string'
      ? JSON.parse(value)
      : (Array.isArray(value) ? value : []);

    const selectedKey = keys[0] || "";

    let selectedText = "";
    if (control && control.options) {
      const option = control.options.find(opt => opt.key === selectedKey);
      selectedText = option ? option.value : "";
    }

    return { key: selectedKey, text: selectedText };
  } catch (err) {
    console.error("解析单选字段失败:", err);
    return { key: "", text: "" };
  }
}
```

#### 多选字段

```javascript
function parseMultiSelect(value, control) {
  try {
    if (!value) return [];

    const keys = typeof value === 'string'
      ? JSON.parse(value)
      : (Array.isArray(value) ? value : []);

    const result = [];
    if (control && control.options) {
      keys.forEach(key => {
        const option = control.options.find(opt => opt.key === key);
        if (option) {
          result.push({ key: key, text: option.value });
        }
      });
    }

    return result;
  } catch (err) {
    console.error("解析多选字段失败:", err);
    return [];
  }
}
```

#### 关联记录字段（⚠️ 重要！）

**关联字段 (type 29) 的特殊处理规则:**

关联字段根据 `enumDefault` 或 `subType` 属性分为两种类型:

1. **单条关联** (enumDefault=1 或 subType=1)
   - 返回格式: JSON 数组字符串
   - 处理方式: 直接解析 JSON 字符串即可

2. **多条关联** (enumDefault=2 或 subType=2)
   - 返回格式: 数字(表示关联记录的数量)
   - 处理方式: **必须调用 `getRowRelationRows` API** 才能获取实际数据

```javascript
// 判断是否为多条关联
function isMultipleRelation(value) {
  return typeof value === 'number' || (!isNaN(value) && value !== '');
}

// 解析单条关联数据
function parseRelationData(value) {
  try {
    if (!value) return [];

    const relations = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(relations)) return [];

    return relations.map(item => ({
      sid: item.sid || '',
      name: item.name || '',
      ...item
    }));
  } catch (err) {
    console.error("解析关联记录字段失败:", err);
    return [];
  }
}

// 完整处理示例
async function handleRelationField(worksheetId, controlId, rowId, fieldValue) {
  let relationData = [];

  if (isMultipleRelation(fieldValue)) {
    // 多条关联:调用 API 获取详情
    const result = await api.getRowRelationRows({
      worksheetId,
      controlId,
      rowId,
      pageSize: 100,
      pageIndex: 1
    });

    if (result && result.data) {
      relationData = result.data;
    }
  } else {
    // 单条关联:直接解析
    relationData = parseRelationData(fieldValue);
  }

  return relationData;
}
```

#### 附件字段

```javascript
function parseAttachments(value) {
  try {
    if (!value) return [];
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (err) {
    return [];
  }
}
```

#### 成员字段

```javascript
function parseMembers(value) {
  try {
    if (!value) return [];
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (err) {
    return [];
  }
}
```

### 自动获取字段值的工具函数

```javascript
function getFieldValue(fieldId, record, controls) {
  if (!fieldId || !record) return null;

  const rawValue = record[fieldId];
  if (rawValue === undefined) return null;

  const control = controls.find(ctrl => ctrl.controlId === fieldId);
  if (!control) return rawValue;

  const fieldType = getFieldTypeByControlType(control.type);

  switch (fieldType) {
    case 'text':
    case 'email':
    case 'phone':
      return rawValue;

    case 'number':
      return parseFloat(rawValue) || 0;

    case 'select':
      return parseSingleSelect(rawValue, control);

    case 'multiselect':
      return parseMultiSelect(rawValue, control);

    case 'user':
      return parseMembers(rawValue);

    case 'attachment':
      return parseAttachments(rawValue);

    case 'boolean':
      return rawValue === "1" || rawValue === 1 || rawValue === true;

    case 'relation':
      return parseRelationData(rawValue);

    default:
      return rawValue;
  }
}

function getFieldTypeByControlType(controlType) {
  const typeMap = {
    2: 'text',           // 文本框
    3: 'phone',          // 手机
    4: 'phone',          // 座机
    5: 'email',          // 邮箱
    6: 'number',         // 数值
    7: 'certificate',    // 证件
    8: 'number',         // 金额
    9: 'select',         // 单选 ⚠️ 重要:type 9 是单选
    10: 'multiselect',   // 多选
    11: 'select',        // 下拉
    14: 'attachment',    // 附件
    15: 'date',          // 日期
    16: 'datetime',      // 时间
    19: 'region',        // 地区
    23: 'region',        // 地区
    24: 'region',        // 地区
    26: 'user',          // 成员
    27: 'department',    // 部门
    28: 'rating',        // 等级
    29: 'relation',      // 连接他表
    36: 'boolean',       // 检查框
    40: 'location',      // 定位
    41: 'richtext',      // 富文本
    42: 'signature',     // 签名
    46: 'time',          // 时间
    48: 'role',          // 组织角色
  };
  return typeMap[controlType] || 'unknown';
}
```

---

## V3 接口集成

### 数据操作方式对比

明道云 HAP 视图插件支持两种数据操作方式:

#### 1. 使用插件内部函数和组件 (mdye API)

**适用场景:** 视图插件内的标准数据操作

**特点:**
- ✅ 已封装好鉴权,开箱即用
- ✅ 自动处理权限和上下文
- ✅ 提供完整的 TypeScript 类型定义
- ✅ 与明道云原生 UI 组件集成
- ⚠️ 仅限当前工作表和视图的数据操作
- ⚠️ 部分高级功能未封装

**推荐使用的内部函数:**
```javascript
import { api, utils, config, md_emitter } from 'mdye';

// 获取当前视图数据
api.getFilterRows({ worksheetId, viewId });

// 打开原生记录详情弹窗
utils.openRecordInfo({ appId, worksheetId, viewId, recordId });

// 获取工作表结构信息
config.controls; // 字段列表
```

#### 2. 使用 HAP V3 公开接口 (REST API)

**适用场景:**
- ✅ 需要调用 mdye 未封装的接口
- ✅ 跨工作表、跨应用的数据操作
- ✅ 构建复杂的业务逻辑页面
- ✅ 使用高级功能（选项集、角色、工作流等）
- ✅ 批量数据导入导出
- ✅ 自定义数据聚合统计

**特点:**
- ✅ 完整的 RESTful API
- ✅ 支持所有明道云功能
- ✅ 可在任何环境使用(插件/独立页面)
- ✅ 灵活的数据筛选和排序
- ⚠️ 需要手动配置鉴权(Appkey & Sign)
- ⚠️ 需要处理跨域问题（插件内无此问题）

### 在视图插件中使用 V3 接口构建复杂页面

#### 方案1: 使用 mdye 封装的 api（推荐用于当前表操作）

```javascript
import { api, config } from 'mdye';

const { appId, worksheetId, viewId } = config;

// 已包含鉴权,直接调用
const result = await api.getFilterRows({
  worksheetId,
  viewId,
  pageSize: 50
});
```

**局限性:**
- 仅限当前工作表和视图
- 无法访问其他工作表数据
- 部分高级功能（选项集、角色、聚合查询）未封装

#### 方案2: 直接调用 V3 接口（推荐用于复杂业务场景）

**✅ 适用场景示例:**
1. **多表关联展示** - 在一个视图中展示多个工作表的数据
2. **跨应用数据整合** - 从多个应用汇总数据
3. **高级数据统计** - 使用透视表API进行复杂聚合
4. **选项集管理** - 动态加载和使用应用选项集
5. **角色权限控制** - 根据用户角色显示不同内容
6. **批量数据操作** - 批量创建、更新记录

**配置步骤:**

**第1步：配置鉴权信息**

```javascript
// 在项目根目录创建 config/api.config.js
const API_CONFIG = {
  baseUrl: 'https://api.mingdao.com',
  appkey: 'YOUR_APPKEY',  // 从明道云后台获取
  sign: 'YOUR_SIGN'       // 从明道云后台获取
};

export default API_CONFIG;
```

**第2步：封装通用请求函数**

```javascript
// utils/v3Api.js
import API_CONFIG from '../config/api.config';

class V3Api {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'HAP-Appkey': config.appkey,
      'HAP-Sign': config.sign
    };
  }

  async request(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: this.headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}${endpoint}`,
        options
      );

      const data = await response.json();

      if (data.success) {
        return data;
      } else {
        throw new Error(data.error_msg || '请求失败');
      }
    } catch (error) {
      console.error('API请求错误:', error);
      throw error;
    }
  }

  // GET 请求
  async get(endpoint) {
    return await this.request(endpoint, 'GET');
  }

  // POST 请求
  async post(endpoint, body) {
    return await this.request(endpoint, 'POST', body);
  }

  // PUT 请求
  async put(endpoint, body) {
    return await this.request(endpoint, 'PUT', body);
  }

  // DELETE 请求
  async delete(endpoint, body) {
    return await this.request(endpoint, 'DELETE', body);
  }
}

export default new V3Api(API_CONFIG);
```

**第3步：封装业务接口**

```javascript
// api/worksheet.js
import v3Api from '../utils/v3Api';

// 获取工作表记录列表
export async function getRecordList(worksheetId, options = {}) {
  const endpoint = `/v3/app/worksheets/${worksheetId}/rows/list`;

  const body = {
    pageSize: options.pageSize || 100,
    pageIndex: options.pageIndex || 1,
    filter: options.filter || null,
    sorts: options.sorts || [],
    search: options.search || '',
    useFieldIdAsKey: true,
    includeTotalCount: options.includeTotalCount || false
  };

  const result = await v3Api.post(endpoint, body);
  return result.data || { rows: [], total: 0 };
}

// 获取工作表结构
export async function getWorksheetStructure(worksheetId) {
  const endpoint = `/v3/app/worksheets/${worksheetId}/structure`;
  const result = await v3Api.get(endpoint);
  return result.data;
}

// 获取透视表统计数据
export async function getPivotData(worksheetId, config) {
  const endpoint = `/v3/app/worksheets/${worksheetId}/rows/pivot`;

  const body = {
    values: config.values,      // 统计字段配置
    rows: config.rows || [],    // 行维度字段
    columns: config.columns || [], // 列维度字段
    filter: config.filter || null,
    pageSize: config.pageSize || 1000,
    pageIndex: config.pageIndex || 1
  };

  const result = await v3Api.post(endpoint, body);
  return result.data;
}

// 获取选项集列表
export async function getOptionSets() {
  const endpoint = '/v3/app/optionsets';
  const result = await v3Api.get(endpoint);
  return result.data;
}

// 获取角色列表
export async function getRoles() {
  const endpoint = '/v3/app/roles';
  const result = await v3Api.get(endpoint);
  return result.data;
}
```

### 实战案例：跨表数据整合视图

#### 需求场景
在一个视图插件中展示：
- **客户工作表**的客户信息
- **订单工作表**的订单统计
- **产品工作表**的热销产品
- 使用**选项集**统一状态显示

#### 完整实现代码

```javascript
// App.jsx
import React, { useState, useEffect } from 'react';
import { getRecordList, getPivotData, getOptionSets } from './api/worksheet';
import { config } from 'mdye';

function MultiTableDashboard() {
  const [customers, setCustomers] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [products, setProducts] = useState([]);
  const [statusOptions, setStatusOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      setLoading(true);

      // 并行加载所有数据
      const [
        customersData,
        ordersData,
        productsData,
        optionSets
      ] = await Promise.all([
        // 1. 加载客户数据
        getRecordList('CUSTOMER_WORKSHEET_ID', {
          pageSize: 10,
          sorts: [{ field: 'CREATE_TIME_FIELD_ID', isAsc: false }]
        }),

        // 2. 加载订单统计（使用透视表API）
        getPivotData('ORDER_WORKSHEET_ID', {
          values: [
            {
              field: 'rowid',
              aggregation: 'COUNT',
              displayName: '订单数量'
            },
            {
              field: 'AMOUNT_FIELD_ID',
              aggregation: 'SUM',
              displayName: '订单总额'
            }
          ],
          rows: [
            {
              field: 'STATUS_FIELD_ID',
              displayName: '订单状态'
            }
          ]
        }),

        // 3. 加载热销产品
        getRecordList('PRODUCT_WORKSHEET_ID', {
          pageSize: 5,
          filter: {
            type: 'group',
            logic: 'AND',
            children: [{
              type: 'condition',
              field: 'HOT_SALE_FIELD_ID',
              operator: 'eq',
              value: ['1']
            }]
          }
        }),

        // 4. 加载选项集
        getOptionSets()
      ]);

      // 处理选项集数据
      const statusOptionSet = optionSets.find(
        opt => opt.name === '订单状态'
      );
      if (statusOptionSet) {
        const optionsMap = {};
        statusOptionSet.options.forEach(opt => {
          optionsMap[opt.key] = opt.value;
        });
        setStatusOptions(optionsMap);
      }

      setCustomers(customersData.rows);
      setOrderStats(ordersData);
      setProducts(productsData.rows);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="multi-table-dashboard">
      {/* 订单统计卡片 */}
      <section className="stats-section">
        <h2>订单统计</h2>
        <div className="stats-grid">
          {orderStats.rows?.map(row => (
            <div key={row.value} className="stat-card">
              <h3>{statusOptions[row.value] || row.value}</h3>
              <p className="count">{row.COUNT}单</p>
              <p className="amount">¥{row.SUM?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 最新客户 */}
      <section className="customers-section">
        <h2>最新客户</h2>
        <div className="customer-list">
          {customers.map(customer => (
            <div key={customer.rowid} className="customer-card">
              <h4>{customer.NAME_FIELD_ID}</h4>
              <p>{customer.PHONE_FIELD_ID}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 热销产品 */}
      <section className="products-section">
        <h2>热销产品</h2>
        <div className="product-grid">
          {products.map(product => (
            <div key={product.rowid} className="product-card">
              <img
                src={getImageUrl(product.IMAGE_FIELD_ID)}
                alt={product.NAME_FIELD_ID}
              />
              <h4>{product.NAME_FIELD_ID}</h4>
              <p className="price">¥{product.PRICE_FIELD_ID}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// 辅助函数：获取图片URL
function getImageUrl(attachments) {
  if (!attachments || attachments.length === 0) {
    return 'https://via.placeholder.com/200';
  }

  const files = typeof attachments === 'string'
    ? JSON.parse(attachments)
    : attachments;

  return files[0]?.url || 'https://via.placeholder.com/200';
}

export default MultiTableDashboard;
```

### 常用 V3 接口完整列表

#### 应用管理
- `GET /v3/app` - 获取应用信息
- `POST /v3/app/worksheets/list` - 获取工作表列表
- `GET /v3/app/worksheets/{worksheet_id}` - 获取工作表详情
- `GET /v3/app/worksheets/{worksheet_id}/structure` - 获取工作表结构

#### 数据查询
- `POST /v3/app/worksheets/{worksheet_id}/rows/list` - 获取记录列表（⭐最常用）
- `GET /v3/app/worksheets/{worksheet_id}/rows/{row_id}` - 获取单条记录
- `POST /v3/app/worksheets/{worksheet_id}/rows/pivot` - 透视表统计（⭐推荐用于数据分析）

#### 数据操作
- `POST /v3/app/worksheets/{worksheet_id}/rows` - 创建记录
- `PUT /v3/app/worksheets/{worksheet_id}/rows/{row_id}` - 更新记录
- `DELETE /v3/app/worksheets/{worksheet_id}/rows/{row_id}` - 删除记录
- `POST /v3/app/worksheets/{worksheet_id}/rows/batch` - 批量创建
- `PUT /v3/app/worksheets/{worksheet_id}/rows/batch` - 批量更新

#### 选项集和角色
- `GET /v3/app/optionsets` - 获取选项集列表（⭐推荐用于统一状态管理）
- `GET /v3/app/optionsets/{optionset_id}` - 获取选项集详情
- `GET /v3/app/roles` - 获取角色列表
- `GET /v3/app/roles/{role_id}/members` - 获取角色成员

#### 工作流
- `GET /v3/app/workflows` - 获取工作流列表
- `POST /v3/app/workflows/{workflow_id}/trigger` - 触发工作流

### 最佳实践

#### 1. API 调用优化
```javascript
// ✅ 推荐：并行加载多个无依赖的数据
const [data1, data2, data3] = await Promise.all([
  getRecordList(worksheet1),
  getRecordList(worksheet2),
  getPivotData(worksheet3, config)
]);

// ❌ 避免：串行加载导致性能差
const data1 = await getRecordList(worksheet1);
const data2 = await getRecordList(worksheet2);
const data3 = await getPivotData(worksheet3, config);
```

#### 2. 错误处理
```javascript
try {
  const data = await getRecordList(worksheetId, options);
  setRecords(data.rows);
} catch (error) {
  console.error('加载失败:', error);
  // 显示友好错误提示
  if (error.message.includes('401')) {
    alert('认证失败，请检查 API 密钥');
  } else {
    alert('加载失败，请稍后重试');
  }
}
```

#### 3. 数据缓存
```javascript
// 简单的内存缓存
const cache = new Map();

async function getCachedData(key, fetchFn, ttl = 5 * 60 * 1000) {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });

  return data;
}

// 使用
const products = await getCachedData(
  'hot-products',
  () => getRecordList('PRODUCT_ID', { pageSize: 5 })
);
```

---

## 构建和发布

### ⚠️ 重要：完整开发流程

**插件开发完成后，必须执行构建和发布步骤！**

完整的开发流程包括：
1. 本地开发（mdye start）
2. **构建项目（mdye build）** ⭐
3. **提交发布（mdye push）** ⭐

### 插件发布流程

#### 第1步：构建项目

执行以下命令将本地项目打包：

```bash
cd your_plugin_project
mdye build
```

**构建输出示例：**
```
[21:20:33] 开始构建代码
ℹ Compiling Webpack
✔ Webpack: Compiled successfully in 1.94s
asset bundle.js 228 KiB [emitted] [minimized] (name: main)
webpack 5.98.0 compiled successfully in 1947 ms
[21:20:35] 构建代码完成
```

#### 第2步：提交并发布

执行以下命令将本地项目提交并推送到线上：

```bash
mdye push -m "提交说明"
```

**提交说明编写建议：**

建议在提交信息中包含以下内容：
1. **功能特性**：列出插件的主要功能
2. **技术实现**：说明关键技术点和优化
3. **版本说明**：首次发布/功能更新/Bug修复

**完整示例：**

```bash
mdye push -m "订单状态视图插件首次发布

功能特性:
- 按订单状态分类展示(待付款/已付款/已发货/已完成/已取消)
- 完整订单信息展示(订单编号/客户/联系人/日期/金额/负责人)
- 多条关联产品信息展示(产品名称/编号/分类/单价)
- 点击订单卡片打开原生行记录弹窗
- 支持编辑/删除订单并自动刷新列表
- 响应式网格布局和流畅动画效果

技术实现:
- 正确处理单选字段(type 9)和关联记录字段(type 29)
- 使用 getRowRelationRows API 处理多条关联
- 使用 utils.openRecordInfo 实现原生交互
- Promise.all 并行加载提升性能"
```

#### 第3步：确认发布成功

发布成功后会显示插件信息：

```
[21:20:54] 文件上传成功
[21:20:55] push成功
┌──────────────────────────────────────────────────────────┐
│  ---- 插件信息 ----                                       │
│                                                           │
│  插件名称: 自定义视图                                     │
│  视图名称: 自定义视图                                     │
│  视图地址: https://www.mingdao.com/worksheet/...         │
│  提交信息: 订单状态视图插件首次发布                       │
│  提交人: 用户名                                           │
└──────────────────────────────────────────────────────────┘
```

#### 发布后的状态

✅ **插件已发布** - 可以在组织内所有应用中使用
✅ **视图地址** - 可以通过返回的 URL 直接访问插件
✅ **组织共享** - 组织内其他成员可以使用该插件

---

## BI 驾驶舱设计

### 什么是 BI 驾驶舱？

BI 驾驶舱（Business Intelligence Dashboard）是从**业务分析师视角**设计的数据可视化界面，而不是简单的数据列表展示。

### BI 驾驶舱 vs 普通视图的区别

**❌ 错误的驾驶舱设计（普通视图思维）：**
- 只显示当前工作表的记录列表
- 简单统计总数、今日新增
- 没有业务逻辑，只是数据展示

**✅ 正确的 BI 驾驶舱设计（分析师思维）：**
- 展示跨表汇总的业务指标
- 显示业务转化漏斗（如销售漏斗）
- 提供多维度趋势分析
- 按业务模块组织数据


### 设计 BI 驾驶舱的思维流程

当用户要求创建 BI 驾驶舱时，按以下步骤思考：

1. **分析业务场景**
   - 这是什么类型的应用？（CRM/ERP/项目管理等）
   - 核心业务流程是什么？
   - 管理层最关心哪些指标？

2. **确定指标维度**
   - 什么是核心 KPI？（客户数、销售额、转化率等）
   - 需要哪些时间维度？（今日/本周/本月/本季度）
   - 需要哪些分类维度？（按产品/按地区/按团队等）

3. **设计数据展示**
   - 顶部：核心 KPI 卡片（4-6个）
   - 中部：业务流程分析（漏斗图、趋势图）
   - 底部：详细模块统计

4. **选择可视化方式**
   - 根据数据类型选择合适的图表
   - 保持视觉一致性（配色、字体、间距）
   - 突出重点数据

### 总结

设计 BI 驾驶舱的核心是：**从业务分析师的视角思考**，而不是从技术视角简单展示数据。

- ✅ 展示业务指标，而不是原始数据
- ✅ 提供业务洞察，而不是数据列表
- ✅ 关注业务流程，而不是单表统计
- ✅ 支持决策分析，而不是查询检索

---

## 常见问题

### 问题 1：选项字段显示 key 而不是文本

**问题描述:** 单选或多选字段显示的是 UUID 格式的 key,而不是选项的显示文本。

**原因分析:**
1. 明道云选项字段返回的原始值是 JSON 格式的 key 数组
2. 需要从 `config.controls` 中找到对应字段的 `options`,然后根据 key 匹配出 value

**解决方案:**
```javascript
// 1. 获取字段控件定义(包含options)
const control = config.controls.find(ctrl => ctrl.controlId === fieldId);

// 2. 解析选项字段
function parseSingleSelect(value, control) {
  try {
    if (!value) return { key: "", text: "" };

    const keys = typeof value === 'string' ? JSON.parse(value) : value;
    const selectedKey = keys[0] || "";

    // 从 options 中查找对应的显示文本
    let selectedText = "";
    if (control && control.options) {
      const option = control.options.find(opt => opt.key === selectedKey);
      selectedText = option ? option.value : selectedKey;
    }

    return { key: selectedKey, text: selectedText };
  } catch (err) {
    console.error("解析单选字段失败:", err, value);
    return { key: "", text: "" };
  }
}
```

### 问题 2：找不到单选字段

**问题描述:** 使用 `controls.find()` 查找单选字段时,返回 `undefined`。

**原因分析:**
- 单选字段的 type 是 **9** 而不是 11
- type 10 是多选,type 11 是下拉
- 如果只检查 `ctrl.type === 11`,会遗漏 type 9 的单选字段

**解决方案:**
```javascript
// ✅ 正确:包含所有选项字段类型
const selectField = controls?.find(ctrl =>
  ctrl.controlName?.includes('状态') &&
  (ctrl.type === 9 || ctrl.type === 10 || ctrl.type === 11)
);

// ❌ 错误:会遗漏 type 9
const selectField = controls?.find(ctrl =>
  ctrl.controlName?.includes('状态') &&
  (ctrl.type === 10 || ctrl.type === 11)
);
```

### 问题 3：多条关联字段只显示数字

**问题描述:** 关联字段显示的是数字(如 `2`、`3`),而不是实际的关联记录信息。

**原因分析:**
1. 多条关联字段 (enumDefault=2 或 subType=2) 返回的原始值是数字,表示关联记录的数量
2. 与单条关联不同,多条关联不会直接返回 JSON 数组字符串
3. 必须调用 `getRowRelationRows` API 才能获取实际的关联记录数据

**解决方案:**

```javascript
// 1. 判断是否为多条关联
function isMultipleRelation(value) {
  return typeof value === 'number' || (!isNaN(value) && value !== '');
}

// 2. 处理关联字段(支持单条和多条)
async function handleRelationField(worksheetId, controlId, rowId, fieldValue) {
  let relationData = [];

  if (isMultipleRelation(fieldValue)) {
    // 多条关联:调用 API 获取详情
    try {
      const result = await api.getRowRelationRows({
        worksheetId,
        controlId,
        rowId,
        pageSize: 100,
        pageIndex: 1
      });

      if (result && result.data) {
        relationData = result.data;
      }
    } catch (error) {
      console.error('获取多条关联失败:', error);
    }
  } else {
    // 单条关联:直接解析
    relationData = parseRelationData(fieldValue);
  }

  return relationData;
}
```

### 问题 4：npm 安装失败
- 检查网络连接
- 清理 npm 缓存：`npm cache clean --force`
- 使用淘宝镜像：`npm config set registry https://registry.npmmirror.com`

### 问题 5：mdye 命令不存在
- 重新安装 mdye-cli
- 检查 PATH 环境变量
- 使用 `which mdye` 检查安装位置

### 问题 6：项目启动失败
- 检查端口是否被占用
- 检查依赖是否完整安装
- 查看错误日志信息

---

## 参考资源

### 官方文档
- [明道云开发者文档](https://developers.mingdao.com/)
- [React 官方文档](https://react.dev/)
- [Node.js 官方文档](https://nodejs.org/)

### 技术社区
- 明道云开发者社区
- GitHub Issues

### 图表库
- [Recharts 图表库文档](https://recharts.org/)
- [Ant Design Charts](https://charts.ant.design/)

### 相关技能
- `hap-v3-api` - HAP V3 接口完整文档
- `hap-api-doc-updater` - HAP API 文档维护

---

## 最佳实践

### 1. 项目组织
- 保持项目结构清晰
- 合理划分组件和模块
- 使用有意义的文件命名

### 2. 代码质量
- 遵循 React 最佳实践
- 使用 ESLint 和 Prettier
- 编写清晰的注释和文档

### 3. 性能优化
- 使用 React.memo 优化渲染
- 避免不必要的重渲染
- 优化状态管理
- 使用代码分割

### 4. 安全注意事项
- 避免硬编码敏感信息
- 使用环境变量管理配置
- 验证用户输入
- 防止 XSS 攻击

### 5. 调试技巧
- 使用浏览器开发者工具
- 查看控制台输出
- 使用 React 开发者工具
- 添加调试日志

---

## 更新日志

### v1.0.0 (2026-01-11)
- 初始版本发布
- 整合完整的技能文档体系
- 包含项目初始化、API 使用、字段处理、V3 集成等全流程
- 提供详细的示例代码和最佳实践
- 添加 BI 驾驶舱设计指南
- 包含完整的常见问题解决方案

---

**注意：** 此文档是 HAP 视图插件开发 Agent 的完整技能包，包含了从项目创建到发布的全流程指导。实际开发中请根据具体需求调整配置和代码。

**版权信息：**
- 文档基于明道云 HAP V3 API
- 适用于 mdye-cli beta-0.0.37+
- 更新时间：2026-01-12
