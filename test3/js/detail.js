// 详情页逻辑
// 初始化导航栏
function initNavbar() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// 获取 URL 参数
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// API 对象应该在 api.js 中已初始化
// 如果没有，则在这里初始化
if (typeof api === 'undefined' && typeof HAP_CONFIG !== 'undefined') {
    api = new HAPAPI(HAP_CONFIG);
}

// 加载新闻详情
async function loadNewsDetail() {
    const content = document.getElementById('detailContent');
    if (!content) return;

    const id = getUrlParam('id');
    if (!id) {
        content.innerHTML = '<div class="error-message"><p>缺少必要参数</p><a href="news.html" class="btn-back">返回列表</a></div>';
        return;
    }

    try {
        content.innerHTML = '<div class="loading">加载中...</div>';

        // 确保 API 已初始化
        if (typeof api === 'undefined') {
            if (typeof HAP_CONFIG !== 'undefined') {
                api = new HAPAPI(HAP_CONFIG);
            } else {
                content.innerHTML = '<div class="error-message"><p>API 配置未加载，请刷新页面重试</p><a href="news.html" class="btn-back">返回列表</a></div>';
                return;
            }
        }

        const record = await api.getRecord(HAP_CONFIG.WORKSHEET_IDS.news, id);
        
        console.log('新闻详情数据:', record);
        
        if (!record || !record.title) {
            content.innerHTML = `<div class="error-message"><p>未找到相关内容</p><p style="font-size: 0.9rem; color: var(--text-light); margin-top: 1rem;">记录ID: ${id}</p><a href="news.html" class="btn-back">返回列表</a></div>`;
            return;
        }

        const imageUrl = getAttachmentUrl(record.cover_image);
        const category = getOptionValue(record.category);

        const contentImages = record.content_images || [];
        const contentImageUrls = Array.isArray(contentImages) ? contentImages.map(img => getAttachmentUrl(Array.isArray(img) ? img : [img])).filter(Boolean) : [];

        content.innerHTML = `
            <div class="detail-header">
                <h1 class="detail-title">${record.title || ''}</h1>
                <div class="detail-meta">
                    <div class="detail-meta-item">
                        <span class="detail-badge">${category || '新闻'}</span>
                    </div>
                    <div class="detail-meta-item">
                        <span>📅</span>
                        <span>${formatDate(record.publish_date)}</span>
                    </div>
                    ${record.author ? `
                        <div class="detail-meta-item">
                            <span>✍️</span>
                            <span>作者：${record.author}</span>
                        </div>
                    ` : ''}
                    ${record.source ? `
                        <div class="detail-meta-item">
                            <span>📰</span>
                            <span>来源：${record.source}</span>
                        </div>
                    ` : ''}
                    ${record.view_count ? `
                        <div class="detail-meta-item">
                            <span>👁️</span>
                            <span>阅读量：${record.view_count}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            ${imageUrl ? `<img src="${imageUrl}" alt="${record.title}" class="detail-cover">` : ''}
            <div class="detail-body">
                ${record.summary ? `<div class="summary" style="font-size: 1.2rem; color: var(--text-light); margin-bottom: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: 10px; border-left: 4px solid var(--primary-color);">${record.summary}</div>` : ''}
                <div>${formatContent(record.content || '')}</div>
                ${contentImageUrls.length > 0 ? `
                    <div class="content-images" style="margin: 2rem 0;">
                        ${contentImageUrls.map((imgUrl, idx) => `
                            <img src="${imgUrl}" alt="${record.title} - 图片${idx + 1}" style="width: 100%; margin: 1rem 0; border-radius: 10px;">
                        `).join('')}
                    </div>
                ` : ''}
                ${record.related_links ? `
                    <div class="related-links" style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: 10px;">
                        <h3 style="margin-bottom: 1rem;">相关链接</h3>
                        <div>${formatLinks(record.related_links)}</div>
                    </div>
                ` : ''}
            </div>
            <div class="detail-footer">
                <a href="news.html" class="btn-back">← 返回列表</a>
            </div>
        `;

        // 更新页面标题
        document.title = `${record.title} - 清华大学`;

    } catch (error) {
        console.error('加载新闻详情失败:', error);
        content.innerHTML = '<div class="error-message"><p>加载失败，请稍后重试</p><a href="news.html" class="btn-back">返回列表</a></div>';
    }
}

// 加载院系详情
async function loadDepartmentDetail() {
    const content = document.getElementById('detailContent');
    if (!content) return;

    const id = getUrlParam('id');
    if (!id) {
        content.innerHTML = '<div class="error-message"><p>缺少必要参数</p><a href="departments.html" class="btn-back">返回列表</a></div>';
        return;
    }

    try {
        content.innerHTML = '<div class="loading">加载中...</div>';

        // 确保 API 已初始化
        if (typeof api === 'undefined' && typeof HAP_CONFIG !== 'undefined') {
            api = new HAPAPI(HAP_CONFIG);
        }
        
        const record = await api.getRecord(HAP_CONFIG.WORKSHEET_IDS.departments, id);
        
        console.log('院系详情数据:', record);
        
        if (!record || !record.name) {
            content.innerHTML = `<div class="error-message"><p>未找到相关内容</p><p style="font-size: 0.9rem; color: var(--text-light); margin-top: 1rem;">记录ID: ${id}</p><a href="departments.html" class="btn-back">返回列表</a></div>`;
            return;
        }

        const logoUrl = getAttachmentUrl(record.logo);
        // images 字段可能是数组或字符串，需要处理
        let images = [];
        if (record.images) {
            if (Array.isArray(record.images)) {
                images = record.images;
            } else if (typeof record.images === 'string' && record.images) {
                // 如果是字符串，尝试解析
                try {
                    images = JSON.parse(record.images);
                } catch (e) {
                    images = [];
                }
            }
        }

        content.innerHTML = `
            <div class="department-detail-header">
                <div class="department-logo-large">
                    ${logoUrl 
                        ? `<img src="${logoUrl}" alt="${record.name}">`
                        : '<span>🏛️</span>'
                    }
                </div>
                <h1 class="detail-title">${record.name || ''}</h1>
                ${record.english_name ? `<div class="department-english-name">${record.english_name}</div>` : ''}
            </div>
            <div class="detail-body">
                ${record.description ? `<div class="summary" style="font-size: 1.2rem; color: var(--text-light); margin-bottom: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: 10px; border-left: 4px solid var(--primary-color);">${record.description}</div>` : ''}
                <div>${formatContent(record.detail_content || record.description || '')}</div>
                
                ${record.majors ? `
                    <div class="info-section" style="margin-top: 2rem;">
                        <h3>专业设置</h3>
                        <div>${formatContent(record.majors)}</div>
                    </div>
                ` : ''}
                
                ${record.faculty ? `
                    <div class="info-section" style="margin-top: 2rem;">
                        <h3>师资力量</h3>
                        <div>${formatContent(record.faculty)}</div>
                    </div>
                ` : ''}
                
                ${record.achievements ? `
                    <div class="info-section" style="margin-top: 2rem;">
                        <h3>科研成果</h3>
                        <div>${formatContent(record.achievements)}</div>
                    </div>
                ` : ''}
                
                ${record.student_count ? `
                    <div class="info-section" style="margin-top: 2rem;">
                        <h3>学生人数</h3>
                        <div style="font-size: 1.5rem; color: var(--primary-color); font-weight: 600;">${record.student_count} 人</div>
                    </div>
                ` : ''}
                
                ${images.length > 0 ? `
                    <div class="department-images" style="margin-top: 2rem;">
                        <h3>院系图片</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
                            ${images.map((img, index) => {
                                const imgUrl = getAttachmentUrl(Array.isArray(img) ? img : [img]);
                                return imgUrl ? `
                                    <div class="department-image-item">
                                        <img src="${imgUrl}" alt="${record.name} - 图片${index + 1}">
                                    </div>
                                ` : '';
                            }).filter(Boolean).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="contact-info" style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: 10px;">
                    ${record.contact ? `
                        <div style="margin-bottom: 1rem;">
                            <strong>联系方式：</strong>${record.contact}
                        </div>
                    ` : ''}
                    ${record.website_url ? `
                        <div style="margin-top: 1rem;">
                            <a href="${record.website_url}" target="_blank" class="btn-more">访问官网 →</a>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="detail-footer">
                <a href="departments.html" class="btn-back">← 返回列表</a>
            </div>
        `;

        document.title = `${record.name} - 清华大学`;

    } catch (error) {
        console.error('加载院系详情失败:', error);
        content.innerHTML = '<div class="error-message"><p>加载失败，请稍后重试</p><a href="departments.html" class="btn-back">返回列表</a></div>';
    }
}

// 加载招生详情
async function loadAdmissionDetail() {
    const content = document.getElementById('detailContent');
    if (!content) return;

    const id = getUrlParam('id');
    if (!id) {
        content.innerHTML = '<div class="error-message"><p>缺少必要参数</p><a href="admissions.html" class="btn-back">返回列表</a></div>';
        return;
    }

    try {
        content.innerHTML = '<div class="loading">加载中...</div>';

        // 确保 API 已初始化
        if (typeof api === 'undefined' && typeof HAP_CONFIG !== 'undefined') {
            api = new HAPAPI(HAP_CONFIG);
        }
        
        const record = await api.getRecord(HAP_CONFIG.WORKSHEET_IDS.admissions, id);
        
        console.log('招生详情数据:', record);
        
        if (!record || !record.title) {
            content.innerHTML = `<div class="error-message"><p>未找到相关内容</p><p style="font-size: 0.9rem; color: var(--text-light); margin-top: 1rem;">记录ID: ${id}</p><a href="admissions.html" class="btn-back">返回列表</a></div>`;
            return;
        }

        const imageUrl = getAttachmentUrl(record.cover_image);
        const type = getOptionValue(record.admission_type);

        content.innerHTML = `
            <div class="detail-header">
                <h1 class="detail-title">${record.title || ''}</h1>
                <div class="detail-meta">
                    <div class="detail-meta-item">
                        <span class="detail-badge">${type || '招生'}</span>
                    </div>
                    <div class="detail-meta-item">
                        <span>📅</span>
                        <span>发布时间：${formatDate(record.publish_date)}</span>
                    </div>
                    ${record.deadline ? `
                        <div class="detail-meta-item">
                            <span>⏰</span>
                            <span>截止日期：${formatDate(record.deadline)}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            ${imageUrl ? `<img src="${imageUrl}" alt="${record.title}" class="detail-cover">` : ''}
            <div class="detail-body">
                <div>${formatContent(record.content || '')}</div>
                
                ${record.enrollment_plan ? `
                    <div class="info-section" style="margin-top: 2rem;">
                        <h3>招生计划</h3>
                        <div>${formatContent(record.enrollment_plan)}</div>
                    </div>
                ` : ''}
                
                ${record.majors ? `
                    <div class="info-section" style="margin-top: 2rem;">
                        <h3>专业列表</h3>
                        <div>${formatContent(record.majors)}</div>
                    </div>
                ` : ''}
                
                ${record.application_method ? `
                    <div class="info-section" style="margin-top: 2rem;">
                        <h3>报名方式</h3>
                        <div>${formatContent(record.application_method)}</div>
                    </div>
                ` : ''}
                
                <div class="contact-info" style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: 10px;">
                    ${record.contact ? `
                        <div style="margin-bottom: 1rem;">
                            <strong>联系方式：</strong>${record.contact}
                        </div>
                    ` : ''}
                    ${record.application_url ? `
                        <div style="margin-top: 1rem;">
                            <a href="${record.application_url}" target="_blank" class="btn-more">立即报名 →</a>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="detail-footer">
                <a href="admissions.html" class="btn-back">← 返回列表</a>
            </div>
        `;

        document.title = `${record.title} - 清华大学`;

    } catch (error) {
        console.error('加载招生详情失败:', error);
        content.innerHTML = '<div class="error-message"><p>加载失败，请稍后重试</p><a href="admissions.html" class="btn-back">返回列表</a></div>';
    }
}

// 加载校园风采详情
async function loadCampusDetail() {
    const content = document.getElementById('detailContent');
    if (!content) return;

    const id = getUrlParam('id');
    if (!id) {
        content.innerHTML = '<div class="error-message"><p>缺少必要参数</p><a href="campus.html" class="btn-back">返回列表</a></div>';
        return;
    }

    try {
        content.innerHTML = '<div class="loading">加载中...</div>';

        // 确保 API 已初始化
        if (typeof api === 'undefined' && typeof HAP_CONFIG !== 'undefined') {
            api = new HAPAPI(HAP_CONFIG);
        }
        
        const record = await api.getRecord(HAP_CONFIG.WORKSHEET_IDS.campus, id);
        
        console.log('校园风采详情数据:', record);
        
        if (!record || !record.title) {
            content.innerHTML = `<div class="error-message"><p>未找到相关内容</p><p style="font-size: 0.9rem; color: var(--text-light); margin-top: 1rem;">记录ID: ${id}</p><a href="campus.html" class="btn-back">返回列表</a></div>`;
            return;
        }

        // images 字段可能是数组或字符串，需要处理
        let images = [];
        if (record.images) {
            if (Array.isArray(record.images)) {
                images = record.images;
            } else if (typeof record.images === 'string' && record.images) {
                try {
                    images = JSON.parse(record.images);
                } catch (e) {
                    images = [];
                }
            }
        }
        const category = getOptionValue(record.category);

        content.innerHTML = `
            <div class="detail-header">
                <h1 class="detail-title">${record.title || ''}</h1>
                <div class="detail-meta">
                    ${category ? `
                        <div class="detail-meta-item">
                            <span class="detail-badge">${category}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            ${images.length > 0 ? `
                <div class="campus-gallery-detail">
                    ${images.map((img, index) => {
                        const imgUrl = getAttachmentUrl(Array.isArray(img) ? img : [img]);
                        return imgUrl ? `
                            <div class="campus-image-item">
                                <img src="${imgUrl}" alt="${record.title} - 图片${index + 1}">
                            </div>
                        ` : '';
                    }).filter(Boolean).join('')}
                </div>
            ` : ''}
            <div class="detail-body">
                ${record.description ? `<div>${formatContent(record.description)}</div>` : ''}
                
                ${record.location ? `
                    <div class="info-section" style="margin-top: 2rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-light);">
                            <span>📍</span>
                            <span>拍摄地点：${record.location}</span>
                        </div>
                    </div>
                ` : ''}
                
                ${record.shoot_date ? `
                    <div class="info-section" style="margin-top: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-light);">
                            <span>📅</span>
                            <span>拍摄时间：${formatDate(record.shoot_date)}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="detail-footer">
                <a href="campus.html" class="btn-back">← 返回列表</a>
            </div>
        `;

        document.title = `${record.title} - 清华大学`;

    } catch (error) {
        console.error('加载校园风采详情失败:', error);
        content.innerHTML = '<div class="error-message"><p>加载失败，请稍后重试</p><a href="campus.html" class="btn-back">返回列表</a></div>';
    }
}

// 加载公告详情
async function loadAnnouncementDetail() {
    const content = document.getElementById('detailContent');
    if (!content) return;

    const id = getUrlParam('id');
    if (!id) {
        content.innerHTML = '<div class="error-message"><p>缺少必要参数</p><a href="announcements.html" class="btn-back">返回列表</a></div>';
        return;
    }

    try {
        content.innerHTML = '<div class="loading">加载中...</div>';

        // 确保 API 已初始化
        if (typeof api === 'undefined' && typeof HAP_CONFIG !== 'undefined') {
            api = new HAPAPI(HAP_CONFIG);
        }
        
        const record = await api.getRecord(HAP_CONFIG.WORKSHEET_IDS.announcements, id);
        
        console.log('公告详情数据:', record);
        
        if (!record || !record.title) {
            content.innerHTML = `<div class="error-message"><p>未找到相关内容</p><p style="font-size: 0.9rem; color: var(--text-light); margin-top: 1rem;">记录ID: ${id}</p><a href="announcements.html" class="btn-back">返回列表</a></div>`;
            return;
        }

        const type = getOptionValue(record.announcement_type);

        content.innerHTML = `
            <div class="detail-header">
                <h1 class="detail-title">${record.title || ''}</h1>
                <div class="detail-meta">
                    <div class="detail-meta-item">
                        <span class="detail-badge">${type || '公告'}</span>
                    </div>
                    <div class="detail-meta-item">
                        <span>📅</span>
                        <span>${formatDate(record.publish_date)}</span>
                    </div>
                    ${record.is_important === '1' ? `
                        <div class="detail-meta-item">
                            <span>⚠️</span>
                            <span style="color: var(--warning-color); font-weight: 600;">重要公告</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="detail-body">
                <div>${formatContent(record.content || '')}</div>
                
                ${record.attachments && record.attachments.length > 0 ? `
                    <div class="attachments-section" style="margin-top: 2rem;">
                        <h3>相关附件</h3>
                        <div style="margin-top: 1rem;">
                            ${(Array.isArray(record.attachments) ? record.attachments : []).map(att => {
                                const attUrl = getAttachmentUrl(Array.isArray(att) ? att : [att]);
                                const fileName = Array.isArray(att) && att[0] ? (att[0].original_file_name || att[0].fileName || '附件') : '附件';
                                return attUrl ? `
                                    <div style="margin-bottom: 0.5rem;">
                                        <a href="${attUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
                                            <span>📎</span>
                                            <span>${fileName}</span>
                                        </a>
                                    </div>
                                ` : '';
                            }).filter(Boolean).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${record.related_links ? `
                    <div class="related-links" style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: 10px;">
                        <h3>相关链接</h3>
                        <div style="margin-top: 1rem;">${formatLinks(record.related_links)}</div>
                    </div>
                ` : ''}
                
                ${(record.contact_person || record.contact_phone) ? `
                    <div class="contact-info" style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-light); border-radius: 10px;">
                        <h3>联系方式</h3>
                        ${record.contact_person ? `
                            <div style="margin-top: 0.5rem;">
                                <strong>联系人：</strong>${record.contact_person}
                            </div>
                        ` : ''}
                        ${record.contact_phone ? `
                            <div style="margin-top: 0.5rem;">
                                <strong>联系电话：</strong>${record.contact_phone}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
            <div class="detail-footer">
                <a href="announcements.html" class="btn-back">← 返回列表</a>
            </div>
        `;

        document.title = `${record.title} - 清华大学`;

    } catch (error) {
        console.error('加载公告详情失败:', error);
        content.innerHTML = '<div class="error-message"><p>加载失败，请稍后重试</p><a href="announcements.html" class="btn-back">返回列表</a></div>';
    }
}

// 格式化内容（处理换行等）
function formatContent(content) {
    if (!content) return '';
    // 将换行符转换为 <br>
    return content.replace(/\n/g, '<br>');
}

// 格式化链接（将文本链接转换为可点击的链接）
function formatLinks(links) {
    if (!links) return '';
    // 支持多行链接，每行一个
    const linkArray = links.split('\n').filter(link => link.trim());
    return linkArray.map(link => {
        const trimmedLink = link.trim();
        // 如果已经是完整URL，直接使用；否则添加http://前缀
        const url = trimmedLink.startsWith('http') ? trimmedLink : `http://${trimmedLink}`;
        return `<div style="margin-bottom: 0.5rem;"><a href="${url}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${trimmedLink} →</a></div>`;
    }).join('');
}

// 错误消息样式
const errorStyle = `
    <style>
        .error-message {
            text-align: center;
            padding: 3rem;
            color: var(--text-light);
        }
        .error-message p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
    </style>
`;
document.head.insertAdjacentHTML('beforeend', errorStyle);
