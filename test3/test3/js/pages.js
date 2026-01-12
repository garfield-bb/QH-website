// 页面通用逻辑
function initNavbar() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// 加载新闻列表
async function loadNewsList() {
    const list = document.getElementById('newsList');
    
    if (!list) return;
    
    try {
        list.innerHTML = '<div class="loading">加载中</div>';
        
        const news = await api.getNews(100);
        
        if (news.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">暂无新闻</p>';
            return;
        }
        
        list.innerHTML = '';
        
        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            
            const imageUrl = getAttachmentUrl(item.cover_image);
            const category = getOptionValue(item.category);
            
            newsItem.innerHTML = `
                <div class="news-item-image">
                    ${imageUrl 
                        ? `<img src="${imageUrl}" alt="${item.title}">`
                        : '<span>📰</span>'
                    }
                </div>
                <div class="news-item-content">
                    <h2>${item.title || ''}</h2>
                    <p>${item.summary || item.content || ''}</p>
                    <div class="news-item-meta">
                        <span class="news-badge">${category || '新闻'}</span>
                        <span>${formatDate(item.publish_date)}</span>
                    </div>
                </div>
            `;
            
            // 添加点击事件，跳转到详情页
            newsItem.addEventListener('click', () => {
                window.location.href = `news-detail.html?id=${item.rowid}`;
            });
            
            list.appendChild(newsItem);
        });
        
    } catch (error) {
        console.error('加载新闻列表失败:', error);
        list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">加载失败，请稍后重试</p>';
    }
}

// 加载院系列表
async function loadDepartmentsList() {
    const list = document.getElementById('departmentsList');
    
    if (!list) return;
    
    try {
        list.innerHTML = '<div class="loading">加载中</div>';
        
        const departments = await api.getDepartments(100);
        
        if (departments.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">暂无院系信息</p>';
            return;
        }
        
        list.innerHTML = '';
        
        departments.forEach(dept => {
            const deptItem = document.createElement('div');
            deptItem.className = 'department-item';
            
            const logoUrl = getAttachmentUrl(dept.logo);
            
            deptItem.innerHTML = `
                <div class="department-logo-large">
                    ${logoUrl 
                        ? `<img src="${logoUrl}" alt="${dept.name}">`
                        : '<span>🏛️</span>'
                    }
                </div>
                <h2>${dept.name || ''}</h2>
                ${dept.english_name ? `<div class="english-name">${dept.english_name}</div>` : ''}
                <p>${dept.description || dept.detail_content || ''}</p>
                ${dept.website_url ? `<a href="${dept.website_url}" target="_blank" class="btn-more" style="display: inline-block; margin-top: 1rem;" onclick="event.stopPropagation();">访问官网</a>` : ''}
            `;
            
            // 添加点击事件，跳转到详情页
            deptItem.addEventListener('click', () => {
                window.location.href = `department-detail.html?id=${dept.rowid}`;
            });
            
            list.appendChild(deptItem);
        });
        
    } catch (error) {
        console.error('加载院系列表失败:', error);
        list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">加载失败，请稍后重试</p>';
    }
}

// 加载招生信息列表
async function loadAdmissionsList() {
    const list = document.getElementById('admissionsList');
    
    if (!list) return;
    
    try {
        list.innerHTML = '<div class="loading">加载中</div>';
        
        const admissions = await api.getAdmissions(100);
        
        if (admissions.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">暂无招生信息</p>';
            return;
        }
        
        list.innerHTML = '';
        
        admissions.forEach(admission => {
            const admissionItem = document.createElement('div');
            admissionItem.className = 'admission-item';
            
            const type = getOptionValue(admission.admission_type);
            
            admissionItem.innerHTML = `
                <h2>${admission.title || ''}</h2>
                <p>${admission.content || ''}</p>
                <span class="admission-badge">${type || '招生'}</span>
                <div class="admission-item-info">
                    <span>发布时间：${formatDate(admission.publish_date)}</span>
                    ${admission.deadline ? `<span>截止日期：${formatDate(admission.deadline)}</span>` : ''}
                </div>
            `;
            
            // 添加点击事件，跳转到详情页
            admissionItem.addEventListener('click', () => {
                window.location.href = `admission-detail.html?id=${admission.rowid}`;
            });
            
            list.appendChild(admissionItem);
        });
        
    } catch (error) {
        console.error('加载招生信息列表失败:', error);
        list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">加载失败，请稍后重试</p>';
    }
}

// 加载校园风采
async function loadCampusGallery() {
    const gallery = document.getElementById('campusGallery');
    
    if (!gallery) return;
    
    try {
        gallery.innerHTML = '<div class="loading">加载中</div>';
        
        const items = await api.getCampusGallery(100);
        
        if (items.length === 0) {
            gallery.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">暂无校园风采内容</p>';
            return;
        }
        
        gallery.innerHTML = '';
        
        items.forEach(item => {
            const campusItem = document.createElement('div');
            campusItem.className = 'campus-item';
            
            const imageUrl = getAttachmentUrl(item.images);
            const category = getOptionValue(item.category);
            
            campusItem.innerHTML = `
                <div class="campus-item-image">
                    ${imageUrl 
                        ? `<img src="${imageUrl}" alt="${item.title}">`
                        : '<span style="color: white; font-size: 4rem;">📸</span>'
                    }
                </div>
                <div class="campus-item-content">
                    <h3>${item.title || ''}</h3>
                    <p>${item.description || ''}</p>
                    ${category ? `<span class="campus-item-badge">${category}</span>` : ''}
                </div>
            `;
            
            // 添加点击事件，跳转到详情页
            campusItem.addEventListener('click', () => {
                window.location.href = `campus-detail.html?id=${item.rowid}`;
            });
            
            gallery.appendChild(campusItem);
        });
        
    } catch (error) {
        console.error('加载校园风采失败:', error);
        gallery.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">加载失败，请稍后重试</p>';
    }
}

// 加载公告列表
async function loadAnnouncementsList() {
    const list = document.getElementById('announcementsList');
    
    if (!list) return;
    
    try {
        list.innerHTML = '<div class="loading">加载中</div>';
        
        const announcements = await api.getAnnouncements(100);
        
        if (announcements.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">暂无公告</p>';
            return;
        }
        
        list.innerHTML = '';
        
        announcements.forEach(announcement => {
            const announcementItem = document.createElement('div');
            announcementItem.className = `announcement-item ${announcement.is_important === '1' ? 'important' : ''}`;
            
            const type = getOptionValue(announcement.announcement_type);
            
            announcementItem.innerHTML = `
                <h2>${announcement.title || ''}</h2>
                <p>${announcement.content || ''}</p>
                <div class="announcement-item-meta">
                    <span class="announcement-badge">${type || '公告'}</span>
                    <span>${formatDate(announcement.publish_date)}</span>
                </div>
            `;
            
            // 添加点击事件，跳转到详情页
            announcementItem.addEventListener('click', () => {
                window.location.href = `announcement-detail.html?id=${announcement.rowid}`;
            });
            
            list.appendChild(announcementItem);
        });
        
    } catch (error) {
        console.error('加载公告列表失败:', error);
        list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">加载失败，请稍后重试</p>';
    }
}
