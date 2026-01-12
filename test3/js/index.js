// 首页逻辑
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化导航栏
    initNavbar();
    
    // 加载轮播图
    await loadCarousel();
    
    // 加载公告
    await loadAnnouncements();
    
    // 加载新闻
    await loadNews();
    
    // 加载院系
    await loadDepartments();
    
    // 加载招生信息
    await loadAdmissions();
});

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

// 加载轮播图
async function loadCarousel() {
    const wrapper = document.getElementById('carouselWrapper');
    const dots = document.getElementById('carouselDots');
    
    if (!wrapper) return;
    
    try {
        wrapper.innerHTML = '<div class="loading">加载中</div>';
        
        const banners = await api.getBanners();
        
        if (banners.length === 0) {
            wrapper.innerHTML = '<div class="carousel-slide"><div class="carousel-content"><h2>欢迎来到清华大学</h2><p>自强不息，厚德载物</p></div></div>';
            return;
        }
        
        wrapper.innerHTML = '';
        dots.innerHTML = '';
        
        banners.forEach((banner, index) => {
            // 创建轮播项
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const imageUrl = getAttachmentUrl(banner.image);
            const bgStyle = imageUrl 
                ? `background-image: url('${imageUrl}');`
                : '';
            
            slide.innerHTML = `
                <div class="carousel-content" style="${bgStyle}">
                    <h2>${banner.title || '欢迎来到清华大学'}</h2>
                    <p>${banner.subtitle || '自强不息，厚德载物'}</p>
                </div>
            `;
            
            wrapper.appendChild(slide);
            
            // 创建指示点
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            dots.appendChild(dot);
        });
        
        // 初始化轮播控制
        initCarouselControls(banners.length);
        
    } catch (error) {
        console.error('加载轮播图失败:', error);
        wrapper.innerHTML = '<div class="carousel-slide"><div class="carousel-content"><h2>欢迎来到清华大学</h2><p>自强不息，厚德载物</p></div></div>';
    }
}

// 初始化轮播控制
let currentSlide = 0;
let slideInterval = null;

function initCarouselControls(totalSlides) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        });
    }
    
    // 自动播放
    startAutoPlay(totalSlides);
}

function goToSlide(index) {
    const wrapper = document.getElementById('carouselWrapper');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!wrapper) return;
    
    currentSlide = index;
    wrapper.style.transform = `translateX(-${index * 100}%)`;
    
    // 更新指示点
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function startAutoPlay(totalSlides) {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);
}

// 加载公告
async function loadAnnouncements() {
    const grid = document.getElementById('announcementsGrid');
    
    if (!grid) return;
    
    try {
        grid.innerHTML = '<div class="loading">加载中</div>';
        
        const announcements = await api.getAnnouncements(6);
        
        if (announcements.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">暂无公告</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        announcements.forEach(announcement => {
            const card = document.createElement('div');
            card.className = `announcement-card ${announcement.is_important === '1' ? 'important' : ''}`;
            
            const type = getOptionValue(announcement.announcement_type);
            
            card.innerHTML = `
                <h3>${announcement.title || ''}</h3>
                <p>${announcement.content || ''}</p>
                <div class="meta">
                    <span class="announcement-badge">${type || '公告'}</span>
                    <span>${formatDate(announcement.publish_date)}</span>
                </div>
            `;
            
            // 添加点击事件，跳转到详情页
            card.addEventListener('click', () => {
                window.location.href = `announcement-detail.html?id=${announcement.rowid}`;
            });
            
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('加载公告失败:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">加载失败，请稍后重试</p>';
    }
}

// 加载新闻
async function loadNews() {
    const grid = document.getElementById('newsGrid');
    
    if (!grid) return;
    
    try {
        grid.innerHTML = '<div class="loading">加载中</div>';
        
        const news = await api.getNews(6);
        
        if (news.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">暂无新闻</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        news.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';
            
            const imageUrl = getAttachmentUrl(item.cover_image);
            const category = getOptionValue(item.category);
            
            card.innerHTML = `
                <div class="news-card-image">
                    ${imageUrl 
                        ? `<img src="${imageUrl}" alt="${item.title}">`
                        : '<span>📰</span>'
                    }
                </div>
                <div class="news-card-content">
                    <h3>${item.title || ''}</h3>
                    <p>${item.summary || item.content || ''}</p>
                    <div class="meta">
                        <span class="news-badge">${category || '新闻'}</span>
                        <span>${formatDate(item.publish_date)}</span>
                    </div>
                </div>
            `;
            
            // 添加点击事件，跳转到详情页
            card.addEventListener('click', () => {
                window.location.href = `news-detail.html?id=${item.rowid}`;
            });
            
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('加载新闻失败:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">加载失败，请稍后重试</p>';
    }
}

// 加载院系
async function loadDepartments() {
    const grid = document.getElementById('departmentsGrid');
    
    if (!grid) return;
    
    try {
        grid.innerHTML = '<div class="loading">加载中</div>';
        
        const departments = await api.getDepartments(6);
        
        if (departments.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">暂无院系信息</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        departments.forEach(dept => {
            const card = document.createElement('div');
            card.className = 'department-card';
            
            const logoUrl = getAttachmentUrl(dept.logo);
            
            card.innerHTML = `
                <div class="department-logo">
                    ${logoUrl 
                        ? `<img src="${logoUrl}" alt="${dept.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
                        : '<span>🏛️</span>'
                    }
                </div>
                <h3>${dept.name || ''}</h3>
                <p>${dept.description || dept.detail_content || ''}</p>
            `;
            
            // 添加点击事件，跳转到详情页
            card.addEventListener('click', () => {
                window.location.href = `department-detail.html?id=${dept.rowid}`;
            });
            
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('加载院系失败:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">加载失败，请稍后重试</p>';
    }
}

// 加载招生信息
async function loadAdmissions() {
    const grid = document.getElementById('admissionsGrid');
    
    if (!grid) return;
    
    try {
        grid.innerHTML = '<div class="loading">加载中</div>';
        
        const admissions = await api.getAdmissions(6);
        
        if (admissions.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">暂无招生信息</p>';
            return;
        }
        
        grid.innerHTML = '';
        
        admissions.forEach(admission => {
            const card = document.createElement('div');
            card.className = 'admission-card';
            
            const type = getOptionValue(admission.admission_type);
            
            card.innerHTML = `
                <h3>${admission.title || ''}</h3>
                <p>${admission.content || ''}</p>
                <div class="date-info">
                    <span>发布时间：${formatDate(admission.publish_date)}</span>
                    ${admission.deadline ? `<span>截止：${formatDate(admission.deadline)}</span>` : ''}
                </div>
                <span class="admission-badge">${type || '招生'}</span>
            `;
            
            // 添加点击事件，跳转到详情页
            card.addEventListener('click', () => {
                window.location.href = `admission-detail.html?id=${admission.rowid}`;
            });
            
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('加载招生信息失败:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">加载失败，请稍后重试</p>';
    }
}
