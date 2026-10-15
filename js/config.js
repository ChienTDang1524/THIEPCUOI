/**
 * CẤU HÌNH THÔNG TIN THIỆP CƯỚI CHÍNH THỨC
 * Cặp đôi: Trần Thị Kim Oanh & Trịnh Đăng Chiến
 * Địa chỉ: Phường Hoa Lư, Tỉnh Ninh Bình
 * Ngày cưới: 17/11/2026 (Nhà Gái) & 18/11/2026 (Nhà Trai)
 */

const WEDDING_DATA = {
  // THÔNG TIN CẶP ĐÔI
  groom: {
    fullName: "Trịnh Đăng Chiến",
    shortName: "Đăng Chiến",
    role: "Chú Rể",
    parents: "Ông Trịnh Đăng Thiện & Bà Đỗ Thị Oanh",
    address: "15 Ngõ 12 Đinh Tiên Hoàng, Phường Hoa Lư, tỉnh Ninh Bình",
    phone: "0912 345 678",
    avatar: "images/groom.jpg",
    bio: "Anh luôn tin rằng điều may mắn và tuyệt vời nhất trong cuộc đời chính là được gặp em, yêu em và cùng em viết nên chương mới tràn ngập hạnh phúc."
  },
  bride: {
    fullName: "Trần Thị Kim Oanh",
    shortName: "Kim Oanh",
    role: "Cô Dâu",
    parents: "Ông Trần Văn Cương & Bà Nguyễn Thị Ngọc",
    address: "32 Ngõ 124 Lương Văn Thăng, Phường Hoa Lư, tỉnh Ninh Bình",
    phone: "0987 654 321",
    avatar: "images/bride.jpg",
    bio: "Cảm ơn anh vì đã luôn yêu thương, lắng nghe và là bến đỗ bình yên nhất của cuộc đời em. Từ hôm nay, chúng ta chính thức là một gia đình."
  },

  // THỜI GIAN ĐÁM CƯỚI ĐẾM NGƯỢC (Lễ chính 18/11/2026)
  weddingDate: "2026-11-18T07:00:00",
  displayDateText: "Thứ Tư, 18 Tháng 11 Năm 2026",
  lunarDateText: "Ngày 10 Tháng 10 Năm Bính Ngọ (Âm Lịch)",

  // LỜI TỰA / LỜI MỜI TRANG TRỌNG
  invitationMessage: "Sự hiện diện của quý khách là niềm vinh hạnh lớn đối với gia đình chúng tôi. Rất hân hạnh được đón tiếp quý khách!",

  // CÁC SỰ KIỆN / TIỆC CƯỚI CHÍNH XÁC THEO THIẾP IN
  events: [
    {
      id: "le-vu-quy",
      title: "TIỆC MỪNG & LỄ VU QUY (NHÀ GÁI)",
      time: "10:30",
      date: "17/11/2026",
      weekday: "THỨ BA, NGÀY 17 THÁNG 11 NĂM 2026",
      lunar: "Tức ngày 9 tháng 10 năm Bính Ngọ",
      locationName: "Tại Tư Gia Nhà Gái",
      address: "32 Ngõ 124 Lương Văn Thăng, Phường Hoa Lư, tỉnh Ninh Bình",
      mapUrl: "https://maps.google.com/?q=32+Ngo+124+Luong+Van+Thang+Hoa+Lu+Ninh+Binh",
      note: "Tới dự bữa cơm thân mật cùng gia đình nhà gái"
    },
    {
      id: "le-thanh-hon",
      title: "LỄ THÀNH HÔN & TIỆC CƯỚI (NHÀ TRAI)",
      time: "07:00",
      date: "18/11/2026",
      weekday: "THỨ TƯ, NGÀY 18 THÁNG 11 NĂM 2026",
      lunar: "Tức ngày 10 tháng 10 năm Bính Ngọ",
      locationName: "Tại Tư Gia Nhà Trai",
      address: "15 Ngõ 12 Đinh Tiên Hoàng, Phường Hoa Lư, tỉnh Ninh Bình",
      mapUrl: "https://maps.google.com/?q=15+Ngo+12+Dinh+Tien+Hoang+Hoa+Lu+Ninh+Binh",
      note: "Hôn lễ chính thức và tiệc mừng tại tư gia nhà trai"
    }
  ],

  // CÂU CHUYỆN TÌNH YÊU
  loveStory: [
    {
      year: "2021",
      title: "Lần Đầu Gặp Gỡ",
      content: "Khoảnh khắc hai ánh mắt chạm nhau tại Ninh Bình thân thương, câu chuyện tình yêu bình yên và ngọt ngào bắt đầu đơm hoa."
    },
    {
      year: "2023",
      title: "Chính Thức Yêu Nhau",
      content: "Cùng nhau trải qua những ngày tháng thanh xuân rực rỡ, sẻ chia từng niềm vui và nỗi buồn trong cuộc sống."
    },
    {
      year: "2025",
      title: "Lời Cầu Hôn Ngọt Ngào",
      content: "Lời hứa chân thành sẽ cùng nhau nắm tay đi qua mọi giông bão để xây dựng một mái ấm vẹn tròn."
    },
    {
      year: "2026",
      title: "Ngày Chung Đôi",
      content: "Chính thức về chung một mái nhà trong sự chúc phúc trọn vẹn của hai bên gia đình và bạn bè thân quý."
    }
  ],

  // BỘ SƯU TẬP ẢNH CƯỚI
  gallery: [
    { src: "images/gallery-1.jpg", caption: "Nụ cười rạng rỡ của chúng mình" },
    { src: "images/gallery-2.jpg", caption: "Bên nhau bình yên từng khoảnh khắc" },
    { src: "images/gallery-3.jpg", caption: "Ánh mắt trao nhau vẹn tròn yêu thương" },
    { src: "images/gallery-4.jpg", caption: "Nắm tay nhau đi qua giông bão" },
    { src: "images/gallery-5.jpg", caption: "Hạnh phúc giản đơn là có em" },
    { src: "images/gallery-6.jpg", caption: "Khoảnh khắc thiêng liêng nhất cuộc đời" }
  ],

  // THÔNG TIN MỪNG CƯỚI (QUÀ & TÀI KHOẢN NGÂN HÀNG)
  banking: {
    groom: {
      bankName: "MBBank (Quân Đội)",
      accountNumber: "0912345678",
      accountName: "TRINH DANG CHIEN",
      qrImage: "images/qr-groom.jpg",
      bin: "970422"
    },
    bride: {
      bankName: "Vietcombank",
      accountNumber: "9876543210",
      accountName: "TRAN THI KIM OANH",
      qrImage: "images/qr-bride.jpg",
      bin: "970436"
    }
  },

  // NHẠC NỀN
  music: {
    url: "audio/wedding.mp3",
    title: "Canon in D - Romantic Wedding Melodies"
  }
};
