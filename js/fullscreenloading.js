class FullScreenLoading {
  constructor() {
    this.progress = 0;
    this.visible = true;
    this.isRendered = false;

    this.params = new URLSearchParams(window.location.search);
    this.lang = this.params.get("lang") || "en";
    this.brandName = this.params.get("brandName") || "kf";

    this.createStyle();
    this.createLoadingElement();
    this.bindImageLoadCheck();
  }

  createStyle() {
    if (document.querySelector("#full-loading-style")) return;

    const style = document.createElement("style");
    style.id = "full-loading-style";
    style.textContent = `
      .fullscreen-loading {
        position: fixed; /* 保持 fixed，不黑屏关键 */
        left: 0;
        top: 0;
       
        height: 100%;
        
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        padding: 0 16px;
        transform-origin: center center;
      }
      .fullscreen-loading.hide {
        display: none;
      }
      .loading-background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
        user-select: none;
        pointer-events: none;
      }
      .loading-content {
        position: relative;
        z-index: 2;
        width: 100%;
        max-width: 400px;
        text-align: center;
        color: white;
      }
      .loading-center-image {
        width: 100%;
        max-width: 400px;
        height: auto;
        margin-bottom: 20px;
        user-select: none;
        pointer-events: none;
        transform: translate(10px, -50px);
      }
      .progress-bar-container {
        width: 100%;
        max-width: 300px;
        height: 40px;
        margin: 0 auto;
        border: 10px solid transparent;
        border-image: url('/gameimg/default_progressbar_bg.png') 8 fill stretch;
        border-radius: 10px;
        overflow: hidden;
        box-sizing: border-box;
        transform: translateY(-20px);
      }
      .progress-bar {
        height: 100%;
        border: 2.7px solid transparent;
        border-image: url('/gameimg/default_progressbar.png') 6 fill stretch;
        border-radius: 2.7px;
        box-sizing: border-box;
        transition: width 0.3s ease;
      }
      .progress-text {
        margin-top: 10px;
        font-size: 16px;
        text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;
        transform: translateY(-20px);
      }
      .loading-footer {
        position: fixed;
        bottom: 0px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        z-index: 3;
        pointer-events: none;
        transform: scale(1.3);
        transform-origin: bottom center;
      }
      .loading-footer img {
        max-width: 100vw;
        width: 100%;
        height: 20vh;
        opacity: 1;
        user-select: none;
        pointer-events: none;
      }
      .footer-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -30%);
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      }
      .footer-img {
        height: 50px !important;
        width: auto !important;
        object-fit: contain;
        user-select: none;
      }
      .footer-img_02 {
        height: 24px !important;
        width: 80vw !important;
        object-fit: contain;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }

  createLoadingElement() {
    this.el = document.createElement("div");
    this.el.className = "fullscreen-loading";
    this.el.id = "full-screen-loading";

    const bg = document.createElement("img");
    bg.className = "loading-background";
    bg.src = "/gameimg/bgloading.png";
    bg.alt = "loading background";
    this.el.appendChild(bg);

    const content = document.createElement("div");
    content.className = "loading-content";
    content.innerHTML = `
      <img src="/gameimg/bgicon.png" alt="loading center" class="loading-center-image" />
      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
      <div class="progress-text">Loading... 0%</div>
    `;
    this.el.appendChild(content);

    const footer = document.createElement("div");
    footer.className = "loading-footer";
    footer.innerHTML = `
      <img src="/gameimg/tm.png" alt="footer logo" />
      ${this.getFooterOverlayHtml()}
    `;
    this.el.appendChild(footer);

    // 固定挂载在 body，不嵌套！不黑屏！
    document.body.appendChild(this.el);

    this.progressBar = this.el.querySelector(".progress-bar");
    this.progressText = this.el.querySelector(".progress-text");
    this.setProgress(this.progress);
  }

  getFooterOverlayHtml() {
    const isKf = this.brandName === "kf";
    const isHy = this.brandName === "hy";
    const isEn = this.lang === "en";
    const isPt = this.lang === "pt";
    const isRu = this.lang === "ru";
    let html = "";

    if (isKf) {
      html += `<div class="footer-overlay brandNameKF">`;
      if (isEn) html += `<div class="footer-overlay en"><img src="/gameimg/approve_en.png" class="footer-img" /><img src="/gameimg/KF_EN.png" class="footer-img_02" /></div>`;
      if (isPt) html += `<div class="footer-overlay pt"><img src="/gameimg/approve_pt.png" class="footer-img" /><img src="/gameimg/KF_PT.png" class="footer-img_02" /></div>`;
      if (isRu) html += `<div class="footer-overlay pt"><img src="/gameimg/approve_ru.png" class="footer-img" /><img src="/gameimg/KF_RU.png" class="footer-img_02" /></div>`;
      html += `</div>`;
    }
    if (isHy) {
      html += `<div class="footer-overlay brandNameHY">`;
      if (isEn) html += `<div class="footer-overlay en"><img src="/gameimg/approve_en_hy.png" class="footer-img" /><img src="/gameimg/HY_EN.png" class="footer-img_02" /></div>`;
      if (isPt) html += `<div class="footer-overlay pt"><img src="/gameimg/approve_pt_hy.png" class="footer-img" /><img src="/gameimg/HY_PT.png" class="footer-img_02" /></div>`;
      if (isRu) html += `<div class="footer-overlay pt"><img src="/gameimg/approve_ru_hy.png" class="footer-img" /><img src="/gameimg/HY_RU.png" class="footer-img_02" /></div>`;
      html += `</div>`;
    }
    return html;
  }

  // 对外暴露：同步缩放
  syncScale(scale) {
    if (this.el) {
      this.el.style.transform = `scale(${scale})`;
    }
  }

  setProgress(num) {
    this.progress = Math.max(0, Math.min(100, num));
    if (this.progressBar) this.progressBar.style.width = this.progress + "%";
    if (this.progressText) this.progressText.textContent = `Loading... ${this.progress}%`;
  }

  show() {
    this.visible = true;
    this.el.classList.remove("hide");
  }

  hide() {
    this.visible = false;
    this.el.classList.add("hide");
  }

  bindImageLoadCheck() {
    const imgs = this.el.querySelectorAll("img");
    let count = 0;
    const total = imgs.length;
    const done = () => {
      this.isRendered = true;
      window.__FULL_SCREEN_LOADING_READY__ = true;
      window.__APP_READY__ = true;
    };
    if (total === 0) return done();
    imgs.forEach(img => {
      if (img.complete) count++;
      else img.onload = img.onerror = () => count++;
      if (count >= total) done();
    });
  }
}

//window.FullScreenLoading = FullScreenLoading;