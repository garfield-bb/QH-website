// HAP API 配置
// 请替换为你的实际 API 凭证
const HAP_CONFIG = {
    // API 基础地址
    BASE_URL: 'https://api.mingdao.com/v3',
    
    // API 凭证（需要从明道云后台获取）
    APP_KEY: '918d66b1b47f7525',
    SIGN: 'MjBhZGE2NjFhNTI5OTYyNDg3ZjAyNDQzYjM1YWRmMTVhNzRkMGMzMGRiMzZiMjZjOGJmOTY0NzM5ZDY3ODc3MQ==',
    
    // 应用 ID
    APP_ID: 'eb819670-1739-4818-a0c6-3b10cf97cfe1',
    
    // 工作表 ID 映射
    WORKSHEET_IDS: {
        banners: '696520acd31b02b31f62b5b0',           // 首页轮播图
        announcements: '69651bdfd31b02b31f62b535',     // 学校公告
        departments: '69651be11019c0d5cfa23c90',       // 院系介绍
        admissions: '69651be3c8453bb1e4731e88',        // 招生信息
        campus: '69651be5c8453bb1e4731e96',            // 校园风采
        news: '69651be8d31b02b31f62b586'               // 新闻动态
    }
};

// API 凭证已配置完成
console.log('✅ HAP API 配置已加载');
