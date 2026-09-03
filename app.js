const CONFIG = {
    IMAGES: {
        FAVICON: "image/favicon.png",
        HEADER_BG: "image/header.png",
        PROFILE_ICON: "image/icon.png"
    },
    PROFILE: {
        NAME: "神罪閣下親王",
        HANDLE: "@_",
        BADGE: "👑",
        BIO: "",
        LOCATION: "神罪帝国",
        WEBSITE_LABEL: "shinzai.xyz",
        WEBSITE_URL: "https://www.instagram.com/i.am_w/",
        JOINED: "2020年1月1日から利用しています",
        FOLLOWING: "0",
        FOLLOWERS: "1.6M",
        POST_COUNT: "8,810",
        COPYRIGHT: "© 神罪閣下製作委員会",
    },
    POSTS: [
        {
            TIME: "2時間前",
            TEXT: "今後ともよろしくお願いします。",
        },
    ],
    TRENDS: [
        { CATEGORY: "注目のトピック", NAME: "#神罪帝国", POSTS: "99.9K 投稿" },
        { CATEGORY: "エンタメ", NAME: "神罪閣下親王", POSTS: "9,999 投稿" },
        { CATEGORY: "テクノロジー", NAME: "神罪公式SNS 爆誕", POSTS: "9,999 投稿" }
    ]
};

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderPage() {
    const p = CONFIG.PROFILE;

    document.title = `${p.NAME} (${p.HANDLE})`;

    document.getElementById('header-name').textContent = p.NAME;
    document.getElementById('header-badge').textContent = p.BADGE;
    document.getElementById('header-posts').textContent = p.POST_COUNT;
    document.getElementById('profile-name').textContent = p.NAME;
    document.getElementById('profile-badge').textContent = p.BADGE;
    document.getElementById('profile-handle').textContent = p.HANDLE;
    document.getElementById('profile-bio').textContent = p.BIO;
    document.getElementById('profile-following').textContent = p.FOLLOWING;
    document.getElementById('profile-followers').textContent = p.FOLLOWERS;
    document.getElementById('footer-copyright').textContent = p.COPYRIGHT;

    const metaHtml = `
        <span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>${escapeHtml(p.LOCATION)}</span>
        <a href="${escapeHtml(p.WEBSITE_URL)}" target="_blank" class="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:underline"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>${escapeHtml(p.WEBSITE_LABEL)}</a>
        <span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>${escapeHtml(p.JOINED)}</span>
    `;
    document.getElementById('profile-meta').innerHTML = metaHtml;

    if(CONFIG.IMAGES.HEADER_BG) document.getElementById('profile-cover').style.backgroundImage = `url('${escapeHtml(CONFIG.IMAGES.HEADER_BG)}')`;
    if(CONFIG.IMAGES.PROFILE_ICON) document.getElementById('profile-icon').src = escapeHtml(CONFIG.IMAGES.PROFILE_ICON);

    const timeline = document.getElementById('timeline');
    timeline.innerHTML = CONFIG.POSTS.map(post => `
        <article class="p-5 hover:bg-gray-50 dark:hover:bg-[#111] transition cursor-pointer flex gap-4">
            <img src="${escapeHtml(CONFIG.IMAGES.PROFILE_ICON)}" class="w-12 h-12 rounded-xl object-cover bg-gray-200 dark:bg-gray-800 shrink-0" alt="Icon">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold truncate hover:underline text-gray-900 dark:text-gray-100">${escapeHtml(p.NAME)}</span>
                    <span class="text-gray-500 dark:text-gray-400 text-sm truncate">${escapeHtml(p.HANDLE)}</span>
                    <span class="text-gray-400 dark:text-gray-600 text-sm">·</span>
                    <span class="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">${escapeHtml(post.TIME)}</span>
                </div>
                <p class="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-100">${escapeHtml(post.TEXT)}</p>
            </div>
        </article>
    `).join('');

    const trendsContainer = document.getElementById('trends');
    trendsContainer.innerHTML = CONFIG.TRENDS.map(trend => `
        <div class="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition group">
            <p class="text-[13px] text-gray-500 dark:text-gray-400 font-medium">${escapeHtml(trend.CATEGORY)}</p>
            <p class="font-bold text-[15px] mt-0.5 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors text-gray-900 dark:text-gray-100">${escapeHtml(trend.NAME)}</p>
            <p class="text-[13px] text-gray-400 mt-1">${escapeHtml(trend.POSTS)}</p>
        </div>
    `).join('');
}

function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
        document.documentElement.classList.add('dark');
        updateThemeUI(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeUI(false);
    }
}

function updateThemeUI(isDark) {
    const themeText = document.getElementById('theme-text');
    if (themeText) {
        themeText.textContent = isDark ? 'ライトモード' : 'ダークモード';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderPage();

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

    const mobileToggleBtn = document.getElementById('mobile-theme-toggle');
    if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', toggleTheme);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
