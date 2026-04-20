// fullLoading.js
// 独立原生全屏加载组件，自动渲染、自动判断语言、自动加载图片
(function () {
  // ================================
  // 1. 自动创建 DOM
  // ================================
  const loadingHTML = `
<div id="fullScreenLoading" class="fullscreen-loading">
  <img src="/gameimg/bgloading.png" class="loading-background" />
  <div class="loading-content">
    <img src="/gameimg/bgicon.png" class="loading-center-image" />
    <div class="progress-bar-container">
      <div id="progressBar" class="progress-bar"></div>
    </div>
    <div id="progressText">Loading... 0%</div>
  </div>
  <div class="loading-footer">
    <img src="/gameimg/tm.png" />
    <div class="footer-overlay brandNameKF" id="footerKF" style="display:none;">
      <div class="en" id="footerEn" style="display:none;">
        <img src="/gameimg/approve_en.png" class="footer-img" />
        <img src="/gameimg/KF_EN.png" class="footer-img_02" />
      </div>
      <div class="pt" id="footerPt" style="display:none;">
        <img src="/gameimg/approve_pt.png" class="footer-img" />
        <img src="/gameimg/KF_PT.png" class="footer-img_02" />
      </div>
      <div class="pt" id="footerRu" style="display:none;">
        <img src="/gameimg/approve_ru.png" class="footer-img" />
        <img src="/gameimg/KF_RU.png" class="footer-img_02" />
      </div>
    </div>
    <div class="footer-overlay brandNameHY" id="footerHY" style="display:none;">
      <div class="en" id="footerEnHy" style="display:none;">
        <img src="/gameimg/approve_en_hy.png" class="footer-img" />
        <img src="/gameimg/HY_EN.png" class="footer-img_02" />
      </div>
      <div class="pt" id="footerPtHy" style="display:none;">
        <img src="/gameimg/approve_pt_hy.png" class="footer-img" />
        <img src="/gameimg/HY_PT.png" class="footer-img_02" />
      </div>
      <div class="pt" id="footerRuHy" style="display:none;">
        <img src="/gameimg/approve_ru_hy.png" class="footer-img" />
        <img src="/gameimg/HY_RU.png" class="footer-img_02" />
      </div>
    </div>
  </div>
</div>
`;

  // ================================
  // 2. 自动创建样式
  // ================================
  const loadingCSS = `
.fullscreen-loading {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9998;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0 16px;
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
  transform: translateY(-20px);
}
.progress-bar {
  height: 100%;
  width: 0%;
  border: 2.7px solid transparent;
  border-image: url('/gameimg/default_progressbar.png') 6 fill stretch;
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
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 3;
  transform: scale(1.3);
  transform-origin: bottom center;
}
.loading-footer img {
  max-width: 100vw;
  width: 100%;
  height: 20vh;
}
.footer-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -30%);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.footer-img { height:50px !important; width:auto!important; object-fit:contain; }
.footer-img_02 { height:24px !important; width:80vw!important; object-fit:contain; }
`;

  // ================================
  // 3. 插入到页面
  // ================================
  document.body.insertAdjacentHTML("beforeend", loadingHTML);

  const style = document.createElement("style");
  style.textContent = loadingCSS;
  document.head.appendChild(style);

  // ================================
  // 4. 获取参数
  // ================================
  const params = new URLSearchParams(location.search);
  const lang = params.get("lang") || "en";
  const brand = params.get("brandName") || "kf";

  const dom = {
    wrap: document.getElementById('fullScreenLoading'),
    bar: document.getElementById('progressBar'),
    text: document.getElementById('progressText'),
    footerKF: document.getElementById('footerKF'),
    footerHY: document.getElementById('footerHY'),
    footerEn: document.getElementById('footerEn'),
    footerPt: document.getElementById('footerPt'),
    footerRu: document.getElementById('footerRu'),
    footerEnHy: document.getElementById('footerEnHy'),
    footerPtHy: document.getElementById('footerPtHy'),
    footerRuHy: document.getElementById('footerRuHy'),
  };

  // 显示品牌
  if (brand === "kf") dom.footerKF.style.display = "flex";
  if (brand === "hy") dom.footerHY.style.display = "flex";

  // 显示语言
  const showLang = (l) => {
    if (l === "en") {
      dom.footerEn.style.display = dom.footerEnHy.style.display = "flex";
    } else if (l === "pt") {
      dom.footerPt.style.display = dom.footerPtHy.style.display = "flex";
    } else if (l === "ru") {
      dom.footerRu.style.display = dom.footerRuHy.style.display = "flex";
    }
  };
  showLang(lang);

  // ================================
  // 5. 对外暴露方法
  // ================================
  window.updateFullLoading = function (progress) {
    dom.bar.style.width = progress + "%";
    dom.text.textContent = `Loading... ${progress}%`;
  };

  window.hideFullLoading = function () {
    dom.wrap.style.opacity = 0;
    dom.wrap.style.transition = "opacity 0.5s";
    setTimeout(() => {
      dom.wrap.style.display = "none";
    }, 500);
  };

  // ================================
  // 6. 监听图片加载完成
  // ================================
  const imgs = dom.wrap.querySelectorAll("img");
  let count = 0;
  const total = imgs.length;

  function done() {
    window.__FULL_SCREEN_LOADING_READY__ = true;
    console.log("✅ 全屏加载界面渲染完成");
  }

  if (total === 0) done();

  imgs.forEach((img) => {
    if (img.complete) {
      count++;
      if (count >= total) done();
    } else {
      img.onload = () => {
        count++;
        if (count >= total) done();
      };
      img.onerror = () => {
        count++;
        if (count >= total) done();
      };
    }
  });
})();