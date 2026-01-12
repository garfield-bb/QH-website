# 清华大学官网项目

一个基于 HAP（明道云）作为数据源的动态官网项目，采用年轻活泼的设计风格。

## 项目特点

- 🎨 **年轻活泼的设计风格**：采用渐变色彩、动画效果和现代化 UI
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🔄 **实时数据同步**：通过 HAP API 实时读取数据，无需重新部署
- ⚡ **轻量级**：纯 HTML/CSS/JS，无需构建工具
- 🎯 **易于维护**：数据在 HAP 后台管理，前端代码简洁清晰

## 项目结构

```
test3/
├── index.html              # 首页
├── news.html              # 新闻动态页
├── departments.html        # 院系介绍页
├── admissions.html         # 招生信息页
├── campus.html            # 校园风采页
├── announcements.html      # 学校公告页
├── css/
│   ├── style.css          # 主样式文件
│   └── pages.css          # 页面样式文件
├── js/
│   ├── config.js          # API 配置
│   ├── api.js             # API 封装
│   ├── index.js           # 首页逻辑
│   └── pages.js           # 页面通用逻辑
└── README.md              # 项目说明文档
```

## 快速开始

### 1. 配置 API 凭证

编辑 `js/config.js` 文件，填入你的 HAP API 凭证：

```javascript
const HAP_CONFIG = {
    BASE_URL: 'https://api.mingdao.com/v3',
    APP_KEY: 'your-app-key-here',      // 替换为你的 AppKey
    SIGN: 'your-sign-key-here',        // 替换为你的 Sign
    APP_ID: 'eb819670-1739-4818-a0c6-3b10cf97cfe1',
    // ...
};
```

### 2. 获取 API 凭证

1. 登录明道云管理后台
2. 进入「API 管理」
3. 获取以下信息：
   - **AppKey**: 应用标识
   - **Sign**: 签名密钥

### 3. 运行项目

#### 方式一：直接打开 HTML 文件

直接在浏览器中打开 `index.html` 文件即可。

#### 方式二：使用本地服务器（推荐）

```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server -p 8000
```

然后在浏览器中访问 `http://localhost:8000`

## HAP 数据结构

项目使用以下工作表：

### 1. 首页轮播图 (banners)
- 标题 (title)
- 副标题 (subtitle)
- 图片 (image)
- 链接地址 (link_url)
- 是否启用 (is_enabled)
- 排序 (sort_order)

### 2. 学校公告 (announcements)
- 标题 (title)
- 内容 (content)
- 发布时间 (publish_date)
- 公告类型 (announcement_type)
- 是否重要 (is_important)

### 3. 新闻动态 (news)
- 标题 (title)
- 摘要 (summary)
- 内容 (content)
- 发布时间 (publish_date)
- 新闻分类 (category)
- 封面图片 (cover_image)
- 是否置顶 (is_top)

### 4. 院系介绍 (departments)
- 院系名称 (name)
- 英文名称 (english_name)
- 简介 (description)
- 详细介绍 (detail_content)
- 院系Logo (logo)
- 院系图片 (images)
- 官网链接 (website_url)
- 排序 (sort_order)

### 5. 招生信息 (admissions)
- 标题 (title)
- 内容 (content)
- 招生类型 (admission_type)
- 发布时间 (publish_date)
- 截止日期 (deadline)
- 封面图片 (cover_image)

### 6. 校园风采 (campus_gallery)
- 标题 (title)
- 描述 (description)
- 图片 (images)
- 分类 (category)
- 排序 (sort_order)

## 功能说明

### 首页功能
- 轮播图自动播放
- 重要公告展示
- 最新新闻展示
- 院系介绍展示
- 招生信息展示

### 各页面功能
- **新闻动态页**：展示所有新闻列表
- **院系介绍页**：展示所有院系信息
- **招生信息页**：展示所有招生信息
- **校园风采页**：展示校园图片和活动
- **学校公告页**：展示所有公告信息

## 设计特色

### 色彩方案
- 主色调：紫色渐变 (#732ED1 → #FF6B9D)
- 辅助色：青色 (#00D4FF)、绿色 (#00E676)
- 强调色：黄色 (#FFC107)

### 动画效果
- 卡片悬停动画
- 轮播图切换动画
- 页面加载动画
- 按钮交互动画

### 响应式设计
- 桌面端：多列网格布局
- 平板端：自适应列数
- 移动端：单列布局

## 部署说明

### 静态网站托管

项目可以部署到任何静态网站托管服务：

- **GitHub Pages**
- **Vercel**
- **Netlify**
- **阿里云 OSS**
- **腾讯云 COS**

### 部署步骤（以 GitHub Pages 为例）

1. 将项目推送到 GitHub 仓库
2. 进入仓库 Settings → Pages
3. 选择分支和目录
4. 保存设置，等待部署完成

## 注意事项

1. **API 凭证安全**：不要将包含真实 API 凭证的代码提交到公开仓库
2. **CORS 配置**：确保 HAP API 允许你的域名访问
3. **数据更新**：在 HAP 后台更新数据后，前端会自动显示最新内容
4. **图片资源**：建议使用 HAP 附件字段存储图片，确保图片链接可访问

## 常见问题

### Q: 页面显示"加载失败"？
A: 检查 `js/config.js` 中的 API 凭证是否正确配置。

### Q: 图片无法显示？
A: 检查 HAP 附件字段是否正确上传图片，以及图片链接是否可访问。

### Q: 如何修改样式？
A: 编辑 `css/style.css` 和 `css/pages.css` 文件。

### Q: 如何添加新功能？
A: 在 `js/api.js` 中添加新的 API 方法，然后在对应页面调用。

## 技术支持

如有问题，请参考：
- [HAP API 文档](https://apifox.mingdao.com/)
- [HAP 使用指南](./HAP-DEV-Skills/)

## 许可证

MIT License
