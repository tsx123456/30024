(function () {

  if (window.__LOADING_INITED__) return;
  window.__LOADING_INITED__ = true;

  /* =========================
   * 等待 DOM（关键修复）
   ========================= */
  function init() {

    const spinner = document.getElementById('body_loading_spinner');

    if (!spinner) {
      requestAnimationFrame(init); // 比 setTimeout 更稳
      return;
    }

    /* =========================
     * CSS 注入
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
    transition: opacity 1s
}

#top_progress_bar {
  position: absolute;
		top: 0;
		left: 0;
		height: 0.5rem;
		background: linear-gradient(to right, rgb(174, 240, 52), rgb(219, 221, 85));
		width: 0%;
		transition: width 0.2s ease;
}

.progress-bar-image {
  position: fixed;
		transform: translateY(-60%) translateX(-50%);
		top: 50%;
		left: 50%;
		z-index: 9;
}

.image-1 {
  z-index: 8;
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
     * 图片初始化
     ========================= */
    setTimeout(() => {
      logo.src = imgIn + '?t=' + Date.now();
      loop.src = imgLoop + '?t=' + Date.now();
    }, 50);

    /* =========================
     * 关闭逻辑
     ========================= */
     const close = (reason) => {
 
      console.log("🧹 close:", reason);

      spinner.style.opacity = '0';

      setTimeout(() => {
        spinner.style.display = 'none';
        spinner.remove?.();
      }, 1000);

      clearInterval(window.__LOADING_TIMER__);
    }

    window.loadingClose = close;


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