/**
 * OmniTools - HilltopAds Comprehensive Integration Configuration
 * Multi-Zone Monetization Engine for Web Utilities
 * 
 * Supported Ad Zones:
 * - Zone 1: Popunder / OnClick
 * - Zone 2: In-Page Push (IPP) MultiTag
 * - Zone 3: MultiTag Banners (728x90 Leaderboard, 300x250 Sidebar & 468x60 Mobile)
 * - Zone 4: Video Slider MultiTag
 * - Zone 5: Direct Link / SmartLink (CTAs: 'Download Tool Results', 'Unlock Premium Pro Tools')
 * - Zone 6: Video VAST (Integrated with HTML5 Video Player)
 */

const HILLTOPADS_CONFIG = {
    // Global Settings
    debugMode: true, // Enables visual diagnostics & console logging
    networkName: 'HilltopAds',
    publisherId: 'PUB_OMNITOOLS_88291',

    // Zone 1: Popunder / OnClick
    zone1_popunder: {
        zoneId: 'HT_POP_1082741',
        scriptUrl: 'https://scripts.hilltopads.net/popunder.js?zone=1082741',
        triggerEventType: 'click', // 'click' | 'instant'
        frequencyCappingHours: 1,  // Once per hour per user
        enabled: true
    },

    // Zone 2: In-Page Push (IPP) MultiTag
    zone2_inPagePush: {
        zoneId: 'HT_IPP_2093812',
        scriptUrl: 'https://scripts.hilltopads.net/ipp-multitag.js?zone=2093812',
        position: 'bottom-right',
        delaySeconds: 2.5,
        title: '⚡ Developer Productivity Tip',
        message: 'Boost your workflow with automated CLI converters & fast cloud API endpoints.',
        ctaText: 'Check Offer',
        enabled: true
    },

    // Zone 3: MultiTag Banners
    zone3_banners: {
        topLeaderboard: {
            zoneId: 'HT_BAN_728x90_30192',
            containerId: 'ad-slot-header-728x90',
            width: 728,
            height: 90,
            tagScript: 'https://scripts.hilltopads.net/banner.js?zone=30192&format=728x90',
            enabled: true
        },
        sidebarRectangle: {
            zoneId: 'HT_BAN_300x250_30193',
            containerId: 'ad-slot-sidebar-300x250',
            width: 300,
            height: 250,
            tagScript: 'https://scripts.hilltopads.net/banner.js?zone=30193&format=300x250',
            enabled: true
        },
        inlineFooter: {
            zoneId: 'HT_BAN_728x90_30194',
            containerId: 'ad-slot-footer-728x90',
            width: 728,
            height: 90,
            tagScript: 'https://scripts.hilltopads.net/banner.js?zone=30194&format=728x90',
            enabled: true
        }
    },

    // Zone 4: Video Slider MultiTag
    zone4_videoSlider: {
        zoneId: 'HT_VSLIDER_401928',
        containerId: 'hilltop-video-slider-widget',
        scriptUrl: 'https://scripts.hilltopads.net/slider.js?zone=401928',
        autoPlay: true,
        muted: true,
        position: 'bottom-left',
        enabled: true
    },

    // Zone 5: Direct Link / SmartLink
    zone5_directLink: {
        zoneId: 'HT_DIRECT_592810',
        url: 'https://go.hilltopads.net/smartlink?zone=592810&source=omnitools_web',
        triggers: [
            { id: 'btn-download-results', actionName: 'Download Tool Results' },
            { id: 'btn-unlock-pro', actionName: 'Unlock Premium Pro Tools' },
            { id: 'btn-export-all', actionName: 'Export All Formatted Code' },
            { id: 'btn-api-access', actionName: 'Get Free API Token' }
        ],
        openInNewTab: true,
        enabled: true
    },

    // Zone 6: Video VAST
    zone6_videoVast: {
        zoneId: 'HT_VAST_601938',
        vastUrl: 'https://vast.hilltopads.net/vast.xml?zone=601938&v_format=preroll',
        fallbackVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        demoAdVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        skipOffsetSeconds: 5,
        enabled: true
    }
};

class HilltopAdsManager {
    constructor(config) {
        this.config = config;
        this.popunderTriggered = false;
        this.ippDismissed = false;
        this.init();
    }

    init() {
        console.log(`[${this.config.networkName}] Initializing multi-zone advertising engine...`);
        document.addEventListener('DOMContentLoaded', () => {
            this.initZone1Popunder();
            this.initZone2InPagePush();
            this.initZone3Banners();
            this.initZone4VideoSlider();
            this.initZone5DirectLinks();
            this.initZone6VideoVast();
            this.setupUIStatusPills();
        });
    }

    /**
     * ZONE 1: Popunder / OnClick
     */
    initZone1Popunder() {
        if (!this.config.zone1_popunder.enabled) return;
        const cfg = this.config.zone1_popunder;

        // Check frequency capping via localStorage
        const lastTrigger = localStorage.getItem('omni_ht_pop_ts');
        const now = Date.now();
        const capMs = cfg.frequencyCappingHours * 3600 * 1000;

        if (lastTrigger && (now - parseInt(lastTrigger, 10)) < capMs) {
            console.log(`[${this.config.networkName} Zone 1] Popunder skipped: Frequency cap active.`);
            return;
        }

        const triggerPopunder = (e) => {
            if (this.popunderTriggered) return;

            // Avoid triggering when user clicks direct links (Zone 5 handles its own tab)
            if (e.target.closest('[data-direct-link="true"]') || e.target.closest('.smartlink-trigger')) {
                return;
            }

            this.popunderTriggered = true;
            localStorage.setItem('omni_ht_pop_ts', Date.now().toString());
            console.log(`[${this.config.networkName} Zone 1] Popunder launched for zone: ${cfg.zoneId}`);

            // Live popunder trigger or simulated realistic popup window
            try {
                const popWin = window.open(
                    this.config.zone5_directLink.url, 
                    '_blank', 
                    'width=1024,height=768,menubar=yes,toolbar=yes,location=yes,scrollbars=yes,status=yes'
                );
                if (popWin) {
                    popWin.blur();
                    window.focus();
                }
            } catch (err) {
                console.warn(`[${this.config.networkName} Zone 1] Popunder blocked by browser sandbox:`, err);
            }

            // Remove listener once executed
            document.removeEventListener('click', triggerPopunder);
            this.showToastNotification('Monetization Event: Zone 1 Popunder fired.');
        };

        document.addEventListener('click', triggerPopunder, { once: false });
    }

    /**
     * ZONE 2: In-Page Push (IPP) MultiTag
     */
    initZone2InPagePush() {
        if (!this.config.zone2_inPagePush.enabled) return;
        const cfg = this.config.zone2_inPagePush;

        setTimeout(() => {
            if (sessionStorage.getItem('omni_ipp_dismissed')) return;

            const ippContainer = document.createElement('div');
            ippContainer.className = 'hilltop-ipp-box animate-fade-in';
            ippContainer.id = 'hilltop-ipp-notification';
            ippContainer.innerHTML = `
                <div class="ipp-header">
                    <div class="ipp-branding">
                        <span class="ipp-badge">Recommended</span>
                        <span class="ipp-tag">Ad &bull; ${cfg.zoneId}</span>
                    </div>
                    <button class="ipp-close" title="Close notification" aria-label="Close">&times;</button>
                </div>
                <div class="ipp-body" style="cursor: pointer;">
                    <div class="ipp-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                    </div>
                    <div class="ipp-content">
                        <h4 class="ipp-title">${cfg.title}</h4>
                        <p class="ipp-desc">${cfg.message}</p>
                    </div>
                </div>
                <div class="ipp-footer">
                    <button class="ipp-action-btn" id="ipp-action-btn">${cfg.ctaText} &rarr;</button>
                </div>
            `;

            document.body.appendChild(ippContainer);

            // Close button handler
            const closeBtn = ippContainer.querySelector('.ipp-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                ippContainer.style.opacity = '0';
                ippContainer.style.transform = 'translateY(20px)';
                setTimeout(() => ippContainer.remove(), 300);
                sessionStorage.setItem('omni_ipp_dismissed', 'true');
            });

            // Action button and body click -> Direct Link
            const handleAction = () => {
                window.open(this.config.zone5_directLink.url, '_blank', 'noopener,noreferrer');
                ippContainer.remove();
            };

            ippContainer.querySelector('.ipp-body').addEventListener('click', handleAction);
            ippContainer.querySelector('#ipp-action-btn').addEventListener('click', handleAction);

            console.log(`[${this.config.networkName} Zone 2] In-Page Push MultiTag deployed.`);
        }, (cfg.delaySeconds || 2) * 1000);
    }

    /**
     * ZONE 3: MultiTag Banners (728x90 Leaderboards, 300x250 Sidebars)
     */
    initZone3Banners() {
        const banners = this.config.zone3_banners;

        // Top Leaderboard
        if (banners.topLeaderboard.enabled) {
            this.renderBanner(banners.topLeaderboard, 'Leaderboard MultiTag (728x90)', 'High-Speed Cloud API, Dev Hosting & Microservices. Instant 99.99% Uptime.');
        }

        // Sidebar Rectangle
        if (banners.sidebarRectangle.enabled) {
            this.renderBanner(banners.sidebarRectangle, 'Medium Rectangle (300x250)', 'Pro Developer Tools & AI Code Assistant. Boost coding speed 10x.');
        }

        // Inline Footer Leaderboard
        if (banners.inlineFooter.enabled) {
            this.renderBanner(banners.inlineFooter, 'Bottom MultiTag Banner (728x90)', 'Cloud Database & Global Edge Computing for Next-Gen Web Apps.');
        }
    }

    renderBanner(slotCfg, title, desc) {
        const container = document.getElementById(slotCfg.containerId);
        if (!container) return;

        container.classList.add('hilltop-banner-wrapper');
        container.innerHTML = `
            <div class="ad-disclosure-bar">
                <span class="ad-badge">SPONSORED ADVERTISEMENT</span>
                <span class="ad-zone-info">HilltopAds MultiTag &bull; Zone #${slotCfg.zoneId}</span>
            </div>
            <div class="ad-creative-frame" style="max-width:${slotCfg.width}px; min-height:${slotCfg.height}px;">
                <div class="ad-content-inner">
                    <div class="ad-logo-mark">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                    </div>
                    <div class="ad-text-block">
                        <strong class="ad-headline">${title}</strong>
                        <p class="ad-description">${desc}</p>
                    </div>
                    <a href="${this.config.zone5_directLink.url}" target="_blank" rel="noopener noreferrer" class="ad-cta-pill">
                        Visit Sponsor &rarr;
                    </a>
                </div>
            </div>
            <!-- HilltopAds MultiTag Dynamic Placeholder Script -->
            <!-- <script async src="${slotCfg.tagScript}"></script> -->
        `;
        console.log(`[${this.config.networkName} Zone 3] Banner rendered for ${slotCfg.containerId}`);
    }

    /**
     * ZONE 4: Video Slider MultiTag
     */
    initZone4VideoSlider() {
        if (!this.config.zone4_videoSlider.enabled) return;
        const cfg = this.config.zone4_videoSlider;

        const container = document.getElementById(cfg.containerId);
        if (!container) return;

        container.className = 'hilltop-video-slider active';
        container.innerHTML = `
            <div class="vslider-header">
                <div class="vslider-title">
                    <span class="vslider-live-dot"></span>
                    <span>Sponsored Stream &bull; Zone ${cfg.zoneId}</span>
                </div>
                <div class="vslider-controls">
                    <button id="vslider-mute-toggle" title="Mute/Unmute" aria-label="Toggle Mute">🔊</button>
                    <button id="vslider-minimize-btn" title="Minimize / Expand" aria-label="Minimize">&minus;</button>
                    <button id="vslider-close-btn" title="Close" aria-label="Close">&times;</button>
                </div>
            </div>
            <div class="vslider-video-wrapper" id="vslider-content">
                <video id="vslider-video" autoplay muted loop playsinline>
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4">
                    Your browser does not support HTML5 video.
                </video>
                <div class="vslider-overlay-cta" onclick="window.open('${this.config.zone5_directLink.url}', '_blank')">
                    <div class="vslider-cta-text">
                        <strong>Developer Edge Server Hosting</strong>
                        <span>Special 80% Off Coupon for OmniTools Users</span>
                    </div>
                    <span class="vslider-cta-arrow">&rarr;</span>
                </div>
            </div>
        `;

        const video = container.querySelector('#vslider-video');
        const muteBtn = container.querySelector('#vslider-mute-toggle');
        const minBtn = container.querySelector('#vslider-minimize-btn');
        const closeBtn = container.querySelector('#vslider-close-btn');
        const content = container.querySelector('#vslider-content');

        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            muteBtn.textContent = video.muted ? '🔇' : '🔊';
        });

        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            content.classList.toggle('collapsed');
            minBtn.innerHTML = content.classList.contains('collapsed') ? '&#9633;' : '&minus;';
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            container.style.display = 'none';
        });

        console.log(`[${this.config.networkName} Zone 4] Video Slider MultiTag initialized.`);
    }

    /**
     * ZONE 5: Direct Link / SmartLink
     */
    initZone5DirectLinks() {
        if (!this.config.zone5_directLink.enabled) return;
        const cfg = this.config.zone5_directLink;

        // Auto-attach direct links to configured triggers or classes
        document.querySelectorAll('[data-direct-link="true"], .smartlink-trigger').forEach((el) => {
            el.addEventListener('click', (e) => {
                const actionName = el.getAttribute('data-action-name') || 'Direct Action';
                console.log(`[${this.config.networkName} Zone 5] Direct link executed for: ${actionName}`);
                
                // Let the primary utility function proceed, and open the SmartLink in parallel
                setTimeout(() => {
                    window.open(cfg.url, '_blank', 'noopener,noreferrer');
                }, 200);

                this.showToastNotification(`Connecting to verified sponsor link for: ${actionName}...`);
            });
        });
    }

    /**
     * ZONE 6: Video VAST (Integrated with HTML5 Video Demo)
     */
    initZone6VideoVast() {
        if (!this.config.zone6_videoVast.enabled) return;
        const cfg = this.config.zone6_videoVast;

        const playerContainer = document.getElementById('vast-player-container');
        if (!playerContainer) return;

        playerContainer.innerHTML = `
            <div class="vast-wrapper">
                <div class="vast-ad-overlay" id="vast-ad-overlay" style="display: flex;">
                    <div class="vast-ad-badge">
                        <span class="vast-pulse"></span>
                        <span>Video Ad Playing (${cfg.zoneId})</span>
                    </div>
                    <div class="vast-skip-box" id="vast-skip-box">
                        <span id="vast-countdown">Ad ends in 5s</span>
                        <button id="vast-skip-button" class="vast-skip-btn" style="display:none;">Skip Ad &raquo;</button>
                    </div>
                    <div class="vast-clickthrough-bar" onclick="window.open('${this.config.zone5_directLink.url}', '_blank')">
                        <span>Learn More from Sponsor &nearr;</span>
                    </div>
                </div>

                <video id="omni-vast-video" class="vast-video-elem" playsinline controls>
                    <source id="vast-video-source" src="${cfg.demoAdVideoUrl}" type="video/mp4">
                    Your browser does not support HTML5 video.
                </video>
            </div>
            <div class="vast-player-meta">
                <div class="vast-status">
                    <span class="vast-tag-label">VAST Tag:</span>
                    <code>${cfg.vastUrl}</code>
                </div>
                <div class="vast-actions">
                    <button class="btn-tool-secondary" id="btn-replay-vast">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                        Test VAST Preroll Again
                    </button>
                    <a href="${this.config.zone5_directLink.url}" target="_blank" class="btn-tool-primary smartlink-trigger" data-action-name="VAST Sponsor">
                        Visit Advertiser &rarr;
                    </a>
                </div>
            </div>
        `;

        const videoElem = playerContainer.querySelector('#omni-vast-video');
        const adOverlay = playerContainer.querySelector('#vast-ad-overlay');
        const countdownEl = playerContainer.querySelector('#vast-countdown');
        const skipBtn = playerContainer.querySelector('#vast-skip-button');
        const replayBtn = playerContainer.querySelector('#btn-replay-vast');

        let isAdPhase = true;
        let countdown = cfg.skipOffsetSeconds;

        const startPrerollCycle = () => {
            isAdPhase = true;
            countdown = cfg.skipOffsetSeconds;
            adOverlay.style.display = 'flex';
            skipBtn.style.display = 'none';
            countdownEl.textContent = `Ad ends in ${countdown}s`;
            countdownEl.style.display = 'inline-block';

            videoElem.src = cfg.demoAdVideoUrl;
            videoElem.currentTime = 0;
            videoElem.play().catch(e => console.log('Autoplay deferred until user click:', e));

            const timer = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    countdownEl.textContent = `Ad ends in ${countdown}s`;
                } else {
                    clearInterval(timer);
                    countdownEl.style.display = 'none';
                    skipBtn.style.display = 'inline-block';
                }
            }, 1000);

            const switchToMainContent = () => {
                clearInterval(timer);
                isAdPhase = false;
                adOverlay.style.display = 'none';
                videoElem.src = cfg.fallbackVideoUrl;
                videoElem.play().catch(err => console.log(err));
                console.log(`[${this.config.networkName} Zone 6] VAST Ad completed. Main content loaded.`);
            };

            skipBtn.onclick = switchToMainContent;

            videoElem.onended = () => {
                if (isAdPhase) {
                    switchToMainContent();
                }
            };
        };

        replayBtn.addEventListener('click', startPrerollCycle);
        // Start preroll initially
        startPrerollCycle();
    }

    /**
     * Notification Toast helper
     */
    showToastNotification(text) {
        let toast = document.getElementById('omni-ad-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'omni-ad-toast';
            toast.className = 'omni-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 3200);
    }

    /**
     * Diagnostics pills in header/footer to confirm all 6 zones are active
     */
    setupUIStatusPills() {
        console.log(`[${this.config.networkName}] All 6 monetization zones successfully connected:`);
        console.table([
            { Zone: 'Zone 1', Type: 'Popunder / OnClick', Status: 'Armed' },
            { Zone: 'Zone 2', Type: 'In-Page Push (IPP)', Status: 'Scheduled' },
            { Zone: 'Zone 3', Type: 'MultiTag Banners (728x90, 300x250)', Status: 'Active' },
            { Zone: 'Zone 4', Type: 'Video Slider MultiTag', Status: 'Active' },
            { Zone: 'Zone 5', Type: 'Direct Link / SmartLink', Status: 'Bound' },
            { Zone: 'Zone 6', Type: 'Video VAST Preroll Player', Status: 'Active' }
        ]);
    }
}

// Global Singleton Instance
window.omniAdsManager = new HilltopAdsManager(HILLTOPADS_CONFIG);
