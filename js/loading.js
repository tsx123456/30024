(function () {
  if (window.__LOADING_INITED__) return;
  window.__LOADING_INITED__ = true;

  /* =========================
   * 等待 DOM（关键修复）
   ========================= */
  function init() {
    const spinner = document.getElementById('body_loading_spinner');

    if (!spinner) {
      requestAnimationFrame(init);
      return;
    }

    /* =========================
     * CSS 注入（修复闪白核心）
     ========================= */
    const css = `
    #body_loading_spinner {
      position: fixed;
      z-index: 9999999;
      width: 100vw;
      height: 100vh;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      top: 0px;
      left: 0px;
      padding-top: 0px !important;
      transition: opacity 1s;
      /* 防止子元素超出闪白 */
      overflow: hidden;
    }

    #top_progress_bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 0.5rem;
      background: linear-gradient(to right, rgb(174, 240, 52), rgb(221, 219, 85));
      width: 0%;
      transition: width 0.2s ease;
    }

    .progress-bar-image {
      position: fixed;
      transform: translateY(-60%) translateX(-50%);
      top: 50%;
      left: 50%;
      z-index: 9;
      /* ✅ 核心修复：默认隐藏，加载完再显示 */
      visibility: hidden;
      opacity: 0;
      /* 防止图片拉伸/变形闪白 */
      object-fit: contain;
      background-color: transparent !important;
    }

    .progress-bar-image.image-1 {
      z-index: 8;
    }

    /* ✅ 图片加载完成后显示的类 */
    .progress-bar-image.loaded {
      visibility: visible;
      opacity: 1;
      transition: opacity 0.3s ease;
    }

    @media all and (orientation : portrait) {
      .progress-bar-image {
        width: 100vw;
        height: 100vw;
      }
    }
  `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    /* =========================
     * DOM
     ========================= */
    spinner.innerHTML = `
      <div id="top_progress_bar"></div>
      <img id="mypic" class="progress-bar-image">
      <img id="loop" class="progress-bar-image image-1">
    `;

    const logo = document.getElementById('mypic');
    const loop = document.getElementById('loop');
    loop.style.display = 'none';

    /* =========================
     * 参数
     ========================= */
    const base = window.location.pathname.split('/')[1];
    const prefix = base ? `/${base}` : '';
    const params = new URLSearchParams(window.location.search);
    const brandName = params.get('brandName');

    let imgIn = `${prefix}/kf_in.webp`;
    let imgLoop = `${prefix}/kf_loop.webp`;

    if (brandName === 'hy') {
      imgIn = `${prefix}/hy_in.webp`;
      imgLoop = `${prefix}/hy_loop.webp`;
    }

    /* =========================
     * ✅ 图片加载完成再显示（彻底解决闪白）
     ========================= */
    function loadImage(imgElement, src) {
      return new Promise((resolve) => {
        imgElement.onload = function () {
          imgElement.classList.add('loaded');
          resolve();
        };
        imgElement.onerror = resolve;
        imgElement.src = src + '?t=' + Date.now();
      });
    }

    // 并行加载，加载完才显示
    Promise.all([
      loadImage(logo, imgIn),
      loadImage(loop, imgLoop)
    ]).then(() => {
      console.log('✅ 加载图片完成，无闪白显示');
    });

    /* =========================
     * 关闭逻辑
     ========================= */
    const close = (reason) => {
      console.log("🧹 close:", reason);
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.style.display = 'none';
        spinner.remove?.();
      }, 500);
      clearInterval(window.__LOADING_TIMER__);
    };

    /* =========================
     * fallback
     ========================= */
    setTimeout(() => {
      loop.style.display = 'block';
      logo.style.display = 'none';
      close("timeout");
    }, 20000);

    /* =========================
     * APP_READY
     ========================= */
    window.__LOADING_TIMER__ = setInterval(() => {
      if (window.__APP_READY__ === true) {
        close("app_ready");
      }
    }, 200);
  }

  init();
})();