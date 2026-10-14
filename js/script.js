/**
 * LOGIC TƯƠNG TÁC THIỆP CƯỚI (WEDDING SCRIPTS)
 * Hỗ trợ: Mở thiệp, Phát nhạc, Cánh hoa rơi, Đếm ngược, Lightbox, Lưu bút, RSVP, QR Mừng cưới, Live Customizer
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. TẢI DỮ LIỆU CẤU HÌNH (TỪ LOCALSTORAGE NẾU CÓ HOẶC TỪ CONFIG.JS)
  let appData = loadCustomData() || WEDDING_DATA;
  applyWeddingData(appData);

  // 2. KHỞI TẠO CÁC TÍNH NĂNG CHÍNH
  initEnvelopeOpener();
  initMusicPlayer(appData.music);
  initPetalsCanvas();
  initCountdownTimer(appData.weddingDate);
  initGalleryLightbox();
  initGuestbook();
  initRSVPForm();
  initGiftBanking(appData.banking);
  initLiveCustomizer(appData);
});

/* =========================================================
   A. ÁP DỤNG DỮ LIỆU CẤU HÌNH LÊN GIAO DIỆN
   ========================================================= */
function applyWeddingData(data) {
  // Phong bì
  setText(".js-groom-short", data.groom.shortName);
  setText(".js-bride-short", data.bride.shortName);
  setText(".js-envelope-date", data.displayDateText);

  // Hero Section
  setText(".js-groom-name", data.groom.fullName);
  setText(".js-bride-name", data.bride.fullName);
  setText(".js-display-date", data.displayDateText);
  setText(".js-lunar-date", data.lunarDateText);

  // Ảnh Hero
  setImage(".js-hero-img", data.heroImage || "images/hero.jpg", "Ảnh Cưới");

  // Chú Rể & Cô Dâu
  setText(".js-groom-full", data.groom.fullName);
  setText(".js-groom-parents", data.groom.parents);
  setText(".js-groom-address", data.groom.address);
  setText(".js-groom-bio", data.groom.bio);
  setLink(".js-groom-phone", `tel:${data.groom.phone.replace(/\s+/g, '')}`);
  setImage(".js-groom-avatar", data.groom.avatar || "images/groom.jpg", data.groom.fullName);

  setText(".js-bride-full", data.bride.fullName);
  setText(".js-bride-parents", data.bride.parents);
  setText(".js-bride-address", data.bride.address);
  setText(".js-bride-bio", data.bride.bio);
  setLink(".js-bride-phone", `tel:${data.bride.phone.replace(/\s+/g, '')}`);
  setImage(".js-bride-avatar", data.bride.avatar || "images/bride.jpg", data.bride.fullName);

  // Footer
  setText(".js-footer-groom", data.groom.shortName);
  setText(".js-footer-bride", data.bride.shortName);
}

function setText(selector, text) {
  document.querySelectorAll(selector).forEach(el => {
    if (el) el.textContent = text || "";
  });
}

function setImage(selector, src, alt) {
  document.querySelectorAll(selector).forEach(img => {
    if (img) {
      img.src = src;
      img.alt = alt || "Ảnh cưới";
      img.onerror = () => {
        if (src.includes("hero")) {
          img.src = "images/hero.svg";
        } else if (src.includes("groom")) {
          img.src = "images/groom.svg";
        } else if (src.includes("bride")) {
          img.src = "images/bride.svg";
        } else {
          img.src = "images/gallery.svg";
        }
        img.onerror = null;
      };
    }
  });
}

function setLink(selector, href) {
  document.querySelectorAll(selector).forEach(el => {
    if (el) el.href = href || "#";
  });
}

/* =========================================================
   B. MỞ THIỆP & PHÁT NHẠC (ENVELOPE OPENER)
   ========================================================= */
/* =========================================================
   B & C. HỆ THỐNG ÂM THANH & PHÁT NHẠC THÔNG MINH
   - Ưu tiên 1: File nhạc MP3 do người dùng chọn hoặc đặt trong audio/
   - Ưu tiên 2: Bộ hòa âm Piano Lãng mạn Web Audio API (Canon in D) chạy 100% không sợ chặn mạng
   ========================================================= */

class WeddingPianoSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPianoNote(freq, startTime, duration = 1.6, volume = 0.16) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn("Piano note err:", e);
    }
  }

  start() {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.step = 0;

    // Tần số các nốt trong bản giao hưởng Canon in D của Pachelbel
    const N = {
      D3: 146.83, A3: 220.00, B3: 246.94, Fs3: 185.00, G3: 196.00,
      D4: 293.66, E4: 329.63, Fs4: 369.99, G4: 392.00, A4: 440.00, B4: 493.88, Cs5: 554.37,
      D5: 587.33, E5: 659.25, Fs5: 739.99, A5: 880.00
    };

    const sequence = [
      { bass: [N.D3, N.D4], melody: [N.Fs5, N.A4, N.D5, N.Fs4] },
      { bass: [N.A3],       melody: [N.E5, N.A4, N.Cs5, N.E4] },
      { bass: [N.B3],       melody: [N.D5, N.Fs4, N.B4, N.D4] },
      { bass: [N.Fs3],      melody: [N.Cs5, N.Fs4, N.A4, N.Cs5] },
      { bass: [N.G3],       melody: [N.B4, N.D4, N.G4, N.B4] },
      { bass: [N.D3],       melody: [N.A4, N.D4, N.Fs4, N.A4] },
      { bass: [N.G3],       melody: [N.B4, N.D4, N.G4, N.B4] },
      { bass: [N.A3],       melody: [N.Cs5, N.E4, N.A4, N.Cs5] }
    ];

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const item = sequence[this.step % sequence.length];

      item.bass.forEach(f => this.playPianoNote(f, now, 2.2, 0.12));
      item.melody.forEach((f, idx) => {
        this.playPianoNote(f, now + idx * 0.42, 1.4, 0.2);
      });

      this.step++;
      this.timer = setTimeout(tick, 1750);
    };

    tick();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }
}

// Khởi tạo đối tượng Synth toàn cục
window.weddingSynth = new WeddingPianoSynth();
let isAudioPlaying = false;

function playWeddingMusic() {
  const musicBtn = document.getElementById("floating-music-btn");
  const audio = document.getElementById("wedding-audio");

  isAudioPlaying = true;
  if (musicBtn) musicBtn.classList.add("playing");

  // Nếu có file MP3 hợp lệ và có nguồn phát
  if (audio && audio.src && !audio.src.endsWith(".html") && audio.src !== window.location.href) {
    audio.play().then(() => {
      window.weddingSynth.stop();
      showToast("🎵 Đang phát bài hát cưới");
    }).catch(err => {
      // Nếu file MP3 bị chặn hoặc lỗi 403, chuyển ngay sang Web Audio Synth
      console.log("Fallback to Web Audio Synth:", err);
      window.weddingSynth.start();
      showToast("🎵 Đang phát giai điệu Piano Canon in D lãng mạn");
    });
  } else {
    // Không có file MP3 -> Chạy giai điệu piano ngọt ngào
    window.weddingSynth.start();
    showToast("🎵 Đang phát giai điệu Piano Canon in D lãng mạn");
  }
}

function pauseWeddingMusic() {
  const musicBtn = document.getElementById("floating-music-btn");
  const audio = document.getElementById("wedding-audio");

  isAudioPlaying = false;
  if (musicBtn) musicBtn.classList.remove("playing");
  if (audio) audio.pause();
  window.weddingSynth.stop();
  showToast("🔇 Đã tạm dừng nhạc");
}

function initEnvelopeOpener() {
  const overlay = document.getElementById("envelope-overlay");
  const openBtn = document.getElementById("open-invitation-btn");

  if (!overlay || !openBtn) return;

  openBtn.addEventListener("click", () => {
    overlay.classList.add("opened");
    
    // Tự động phát nhạc sau khi người dùng bấm Mở Thiệp
    playWeddingMusic();

    const hero = document.getElementById("hero");
    if (hero) {
      setTimeout(() => hero.scrollIntoView({ behavior: "smooth" }), 400);
    }
  });
}

function initMusicPlayer(musicConfig) {
  const musicBtn = document.getElementById("floating-music-btn");
  const audio = document.getElementById("wedding-audio");

  if (!musicBtn || !audio) return;

  // Thử nạp file cục bộ hoặc link cấu hình
  audio.src = (musicConfig && musicConfig.url) ? musicConfig.url : "audio/wedding.mp3";

  musicBtn.addEventListener("click", () => {
    if (isAudioPlaying) {
      pauseWeddingMusic();
    } else {
      playWeddingMusic();
    }
  });
}

/* =========================================================
   D. CANVAS HIỆU ỨNG CÁNH HOA HỒNG RƠI (ROSE PETALS)
   ========================================================= */
function initPetalsCanvas() {
  const canvas = document.getElementById("petals-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 28;

  // Màu cánh hoa hồng phấn và vàng nhạt
  const colors = [
    "rgba(255, 182, 193, 0.75)",
    "rgba(255, 192, 203, 0.65)",
    "rgba(247, 215, 215, 0.7)",
    "rgba(255, 228, 225, 0.6)",
    "rgba(235, 195, 130, 0.5)"
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 1.5 + 0.8;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 2 - 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.oscillationSpeed = Math.random() * 0.03 + 0.01;
      this.oscillationDistance = Math.random() * 2 + 1;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.angle += this.oscillationSpeed;
      this.x += Math.sin(this.angle) * this.oscillationDistance + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size * 1.4);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================================
   E. ĐẾM NGƯỢC THỜI GIAN (COUNTDOWN TIMER)
   ========================================================= */
function initCountdownTimer(targetDateStr) {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const targetDate = new Date(targetDateStr).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* =========================================================
   F. ALBUM ẢNH CƯỚI & PHÓNG TO (LIGHTBOX)
   ========================================================= */
function initGalleryLightbox() {
  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const galleryItems = document.querySelectorAll(".gallery-item img");

  if (!modal || !modalImg || galleryItems.length === 0) return;

  let currentIndex = 0;
  const imageSources = Array.from(galleryItems).map(img => img.src);

  function openLightbox(index) {
    currentIndex = index;
    modalImg.src = imageSources[currentIndex];
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imageSources.length;
    modalImg.src = imageSources[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
    modalImg.src = imageSources[currentIndex];
  }

  galleryItems.forEach((img, idx) => {
    img.onerror = () => {
      img.src = "images/gallery.svg";
      img.onerror = null;
    };
    img.parentElement.addEventListener("click", () => openLightbox(idx));
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (nextBtn) nextBtn.addEventListener("click", showNext);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

/* =========================================================
   G. SỔ LƯU BÚT & LỜI CHÚC (GUESTBOOK)
   ========================================================= */
const DEFAULT_WISHES = [
  {
    sender: "Hoàng Tuấn & Mai Lan",
    relation: "Bạn thân chú rể",
    time: "Hôm nay",
    message: "Chúc hai bạn trăm năm hạnh phúc, sớm đón thiên thần nhỏ đáng yêu nha! Ngày cưới quẩy hết mình nhé!"
  },
  {
    sender: "Thu Trang",
    relation: "Đồng nghiệp cô dâu",
    time: "Hôm qua",
    message: "Chúc mừng Khánh Linh xinh đẹp đã tìm được bến đỗ bình yên. Chúc hai vợ chồng luôn ngọt ngào như ngày đầu!"
  },
  {
    sender: "Gia đình Bác Thành",
    relation: "Họ hàng nhà trai",
    time: "2 ngày trước",
    message: "Chúc hai cháu vạn sự như ý, răng long đầu bạc, thuận vợ thuận chồng tát biển đông cũng cạn."
  }
];

function initGuestbook() {
  const form = document.getElementById("wish-form");
  const listEl = document.getElementById("wishes-list");

  if (!listEl) return;

  let wishes = JSON.parse(localStorage.getItem("wedding_wishes")) || DEFAULT_WISHES;

  function renderWishes() {
    listEl.innerHTML = "";
    wishes.forEach(w => {
      const card = document.createElement("div");
      card.className = "wish-card";
      card.innerHTML = `
        <div class="wish-header">
          <div>
            <span class="wish-sender">${escapeHtml(w.sender)}</span>
            <span class="wish-role-tag">${escapeHtml(w.relation || "Khách mời")}</span>
          </div>
          <span class="wish-time">${w.time || "Vừa xong"}</span>
        </div>
        <p class="wish-message">${escapeHtml(w.message)}</p>
      `;
      listEl.appendChild(card);
    });
  }

  renderWishes();

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const sender = document.getElementById("wish-sender").value.trim();
      const relation = document.getElementById("wish-relation").value;
      const message = document.getElementById("wish-message").value.trim();

      if (!sender || !message) {
        showToast("⚠️ Vui lòng nhập tên và lời chúc của bạn");
        return;
      }

      const newWish = {
        sender,
        relation,
        message,
        time: "Vừa xong"
      };

      wishes.unshift(newWish);
      localStorage.setItem("wedding_wishes", JSON.stringify(wishes));
      renderWishes();
      form.reset();

      showToast("❤️ Cảm ơn bạn đã gửi lời chúc ngọt ngào!");
      triggerConfetti();
    });
  }
}

/* =========================================================
   H. FORM XÁC NHẬN THAM DỰ (RSVP)
   ========================================================= */
function initRSVPForm() {
  const form = document.getElementById("rsvp-form");
  const optionCards = document.querySelectorAll(".rsvp-radio-card");

  optionCards.forEach(card => {
    card.addEventListener("click", () => {
      optionCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const radio = card.querySelector("input[type='radio']");
      if (radio) radio.checked = true;
    });
  });

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("rsvp-name").value.trim();
    const guestCount = document.getElementById("rsvp-guests").value;
    const side = document.getElementById("rsvp-side").value;
    const attending = form.querySelector("input[name='attending']:checked")?.value || "yes";

    if (!name) {
      showToast("⚠️ Vui lòng nhập họ và tên của bạn");
      return;
    }

    const rsvpData = { name, guestCount, side, attending, time: new Date().toISOString() };
    const allRsvp = JSON.parse(localStorage.getItem("wedding_rsvp_list")) || [];
    allRsvp.push(rsvpData);
    localStorage.setItem("wedding_rsvp_list", JSON.stringify(allRsvp));

    if (attending === "yes") {
      showToast(`🎉 Cảm ơn ${name}! Cặp đôi rất háo hức được đón tiếp bạn!`);
      triggerConfetti();
    } else {
      showToast(`💌 Cảm ơn ${name} đã phản hồi. Cặp đôi rất trân quý tấm lòng của bạn!`);
    }

    form.reset();
  });
}

/* =========================================================
   I. MỪNG CƯỚI / TÀI KHOẢN NGÂN HÀNG & MÃ QR (BANKING)
   ========================================================= */
function initGiftBanking(bankingData) {
  const tabGroom = document.getElementById("tab-groom");
  const tabBride = document.getElementById("tab-bride");
  const bankNameEl = document.getElementById("bank-name");
  const bankAccountEl = document.getElementById("bank-account");
  const bankOwnerEl = document.getElementById("bank-owner");
  const bankQrImg = document.getElementById("bank-qr-img");
  const copyBtn = document.getElementById("btn-copy-account");

  if (!tabGroom || !tabBride || !bankingData) return;

  let currentSide = "groom";

  function updateBankView(side) {
    currentSide = side;
    const data = bankingData[side];

    if (side === "groom") {
      tabGroom.classList.add("active");
      tabBride.classList.remove("active");
    } else {
      tabBride.classList.add("active");
      tabGroom.classList.remove("active");
    }

    if (bankNameEl) bankNameEl.textContent = data.bankName;
    if (bankAccountEl) bankAccountEl.textContent = data.accountNumber;
    if (bankOwnerEl) bankOwnerEl.textContent = data.accountName;

    // Tự sinh VietQR chuẩn hoặc ảnh QR cục bộ
    if (bankQrImg) {
      const qrUrl = data.bin && data.accountNumber
        ? `https://img.vietqr.io/image/${data.bin}-${data.accountNumber}-compact2.png?amount=0&addInfo=Mung%20Cuoi%20${encodeURIComponent(data.accountName)}&accountName=${encodeURIComponent(data.accountName)}`
        : (data.qrImage || "images/qr.jpg");

      bankQrImg.src = qrUrl;
    }
  }

  tabGroom.addEventListener("click", () => updateBankView("groom"));
  tabBride.addEventListener("click", () => updateBankView("bride"));

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const data = bankingData[currentSide];
      copyToClipboard(data.accountNumber);
      showToast(`📋 Đã sao chép số tài khoản: ${data.accountNumber}`);
    });
  }

  // Khởi tạo tab Chú rể
  updateBankView("groom");
}

/* =========================================================
   J. BẢNG TÙY BIẾN NHANH (LIVE CUSTOMIZER DRAWER)
   ========================================================= */
function initLiveCustomizer(currentData) {
  const settingsBtn = document.getElementById("floating-settings-btn");
  const drawer = document.getElementById("customizer-drawer");
  const closeBtn = document.getElementById("customizer-close");
  const saveBtn = document.getElementById("customizer-save-btn");
  const resetBtn = document.getElementById("customizer-reset-btn");

  if (!settingsBtn || !drawer) return;

  settingsBtn.addEventListener("click", () => {
    drawer.classList.add("active");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => drawer.classList.remove("active"));
  }

  // Gán giá trị form cài đặt
  const inputGroomName = document.getElementById("edit-groom-name");
  const inputBrideName = document.getElementById("edit-bride-name");
  const inputDate = document.getElementById("edit-wedding-date");
  const inputGroomBank = document.getElementById("edit-groom-bank-num");
  const inputBrideBank = document.getElementById("edit-bride-bank-num");

  if (inputGroomName) inputGroomName.value = currentData.groom.fullName;
  if (inputBrideName) inputBrideName.value = currentData.bride.fullName;
  if (inputDate) inputDate.value = currentData.weddingDate.substring(0, 16);
  if (inputGroomBank) inputGroomBank.value = currentData.banking.groom.accountNumber;
  if (inputBrideBank) inputBrideBank.value = currentData.banking.bride.accountNumber;

  // Lắng nghe chọn ảnh từ máy tính (Image File Upload Preview)
  setupLocalImagePicker("picker-hero-img", ".js-hero-img");
  setupLocalImagePicker("picker-groom-img", ".js-groom-avatar");
  setupLocalImagePicker("picker-bride-img", ".js-bride-avatar");
  setupLocalMusicPicker("picker-music-file");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (inputGroomName) currentData.groom.fullName = inputGroomName.value;
      if (inputBrideName) currentData.bride.fullName = inputBrideName.value;
      if (inputDate && inputDate.value) currentData.weddingDate = inputDate.value + ":00";
      if (inputGroomBank) currentData.banking.groom.accountNumber = inputGroomBank.value;
      if (inputBrideBank) currentData.banking.bride.accountNumber = inputBrideBank.value;

      localStorage.setItem("wedding_custom_data", JSON.stringify(currentData));
      applyWeddingData(currentData);
      initCountdownTimer(currentData.weddingDate);
      initGiftBanking(currentData.banking);

      drawer.classList.remove("active");
      showToast("💾 Đã lưu thay đổi thông tin thiệp cưới!");
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Khôi phục lại dữ liệu mặc định ban đầu?")) {
        localStorage.removeItem("wedding_custom_data");
        location.reload();
      }
    });
  }
}

function setupLocalImagePicker(pickerId, targetSelector) {
  const picker = document.getElementById(pickerId);
  if (!picker) return;

  picker.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setImage(targetSelector, dataUrl, "Ảnh xem trước");
        showToast("🖼️ Đã cập nhật ảnh xem trước thành công!");
      };
      reader.readAsDataURL(file);
    }
  });
}

function setupLocalMusicPicker(pickerId) {
  const picker = document.getElementById(pickerId);
  const audio = document.getElementById("wedding-audio");
  if (!picker || !audio) return;

  picker.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      audio.src = objectUrl;
      window.weddingSynth.stop();
      playWeddingMusic();
      showToast("🎵 Đang phát bài hát: " + file.name);
    }
  });
}

function loadCustomData() {
  try {
    const saved = localStorage.getItem("wedding_custom_data");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

/* =========================================================
   K. TIỆN ÍCH HỖ TRỢ (HELPERS: TOAST, COPY, CONFETTI)
   ========================================================= */
function showToast(message) {
  const toast = document.getElementById("toast-notice");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* HIỆU ỨNG PHÁO GIẤY CHÚC MỪNG (CONFETTI) */
function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ["#e7c975", "#c59b27", "#e57373", "#ff6b6b", "#4ecdc4", "#ffe66d"];

  for (let i = 0; i < 90; i++) {
    confettiPieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      r: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      velX: (Math.random() - 0.5) * 16,
      velY: Math.random() * -14 - 4,
      gravity: 0.35,
      alpha: 1
    });
  }

  let frames = 0;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(p => {
      p.velY += p.gravity;
      p.x += p.velX;
      p.y += p.velY;
      p.alpha -= 0.012;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    frames++;
    if (frames < 90) {
      requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  updateConfetti();
}

// Hàm thêm sự kiện vào Google Calendar
window.addToCalendar = function (title, dateStart, location, details) {
  const start = "20261120T043000Z";
  const end = "20261120T070000Z";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  window.open(url, "_blank");
};

// Hàm sao chép địa chỉ
window.copyAddress = function (address) {
  copyToClipboard(address);
  showToast("📍 Đã sao chép địa chỉ tổ chức tiệc!");
};
