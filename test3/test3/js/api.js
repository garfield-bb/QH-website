// HAP API 调用封装
class HAPAPI {
    constructor(config) {
        this.baseURL = config.BASE_URL;
        this.appKey = config.APP_KEY;
        this.sign = config.SIGN;
        this.worksheetIds = config.WORKSHEET_IDS;
    }

    // 获取请求头
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'HAP-Appkey': this.appKey,
            'HAP-Sign': this.sign
        };
    }

    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!data.success && data.error_code !== 1) {
                throw new Error(data.error_msg || 'API 请求失败');
            }
            
            return data;
        } catch (error) {
            console.error('API 请求错误:', error);
            throw error;
        }
    }

    // 获取记录列表
    async getRecords(worksheetId, options = {}) {
        const {
            pageIndex = 1,
            pageSize = 100,
            filter = {},
            sorts = [],
            fields = []
        } = options;

        const response = await this.request(
            `/app/worksheets/${worksheetId}/rows/list`,
            {
                method: 'POST',
                body: JSON.stringify({
                    pageIndex,
                    pageSize,
                    filter,
                    sorts,
                    fields
                })
            }
        );

        return response.data || { rows: [], total: 0 };
    }

    // 获取单条记录详情
    async getRecord(worksheetId, rowId) {
        const response = await this.request(
            `/app/worksheets/${worksheetId}/rows/${rowId}`,
            {
                method: 'GET'
            }
        );

        return response.data || {};
    }

    // 获取轮播图
    async getBanners() {
        const data = await this.getRecords(this.worksheetIds.banners, {
            filter: {
                type: 'group',
                logic: 'AND',
                children: [
                    {
                        type: 'condition',
                        field: 'is_enabled',
                        operator: 'eq',
                        value: ['1']
                    }
                ]
            },
            sorts: [
                {
                    field: 'sort_order',
                    isAsc: true
                }
            ]
        });

        return data.rows || [];
    }

    // 获取公告列表
    async getAnnouncements(limit = 6) {
        const data = await this.getRecords(this.worksheetIds.announcements, {
            pageSize: limit,
            sorts: [
                {
                    field: 'publish_date',
                    isAsc: false
                }
            ]
        });

        return data.rows || [];
    }

    // 获取新闻列表
    async getNews(limit = 6) {
        const data = await this.getRecords(this.worksheetIds.news, {
            pageSize: limit,
            sorts: [
                {
                    field: 'publish_date',
                    isAsc: false
                }
            ]
        });

        return data.rows || [];
    }

    // 获取院系列表
    async getDepartments(limit = 6) {
        const data = await this.getRecords(this.worksheetIds.departments, {
            pageSize: limit,
            sorts: [
                {
                    field: 'sort_order',
                    isAsc: true
                }
            ]
        });

        return data.rows || [];
    }

    // 获取招生信息列表
    async getAdmissions(limit = 6) {
        const data = await this.getRecords(this.worksheetIds.admissions, {
            pageSize: limit,
            sorts: [
                {
                    field: 'publish_date',
                    isAsc: false
                }
            ]
        });

        return data.rows || [];
    }

    // 获取校园风采列表
    async getCampusGallery(limit = 12) {
        const data = await this.getRecords(this.worksheetIds.campus, {
            pageSize: limit,
            sorts: [
                {
                    field: 'sort_order',
                    isAsc: true
                }
            ]
        });

        return data.rows || [];
    }
}

// 创建 API 实例（延迟初始化，确保 HAP_CONFIG 已加载）
let api;
if (typeof HAP_CONFIG !== 'undefined') {
    api = new HAPAPI(HAP_CONFIG);
} else {
    // 如果 HAP_CONFIG 未定义，等待 DOMContentLoaded 后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof HAP_CONFIG !== 'undefined') {
                api = new HAPAPI(HAP_CONFIG);
            }
        });
    } else {
        // 如果 DOM 已加载，直接初始化
        setTimeout(() => {
            if (typeof HAP_CONFIG !== 'undefined') {
                api = new HAPAPI(HAP_CONFIG);
            }
        }, 100);
    }
}

// 工具函数：格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 工具函数：获取附件 URL
function getAttachmentUrl(attachment) {
    if (!attachment || !Array.isArray(attachment) || attachment.length === 0) {
        return null;
    }
    // HAP API V3 返回的附件字段包含 downloadUrl
    // 支持多种可能的字段名：downloadUrl, DownloadUrl, url
    const item = attachment[0];
    return item.downloadUrl || item.DownloadUrl || item.url || null;
}

// 工具函数：获取选项值
function getOptionValue(option) {
    if (!option || !Array.isArray(option) || option.length === 0) {
        return '';
    }
    return option[0].value || '';
}
