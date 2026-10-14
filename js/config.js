/**
 * CẤU HÌNH THÔNG TIN THIỆP CƯỚI (WEDDING CONFIGURATION)
 * Bạn có thể dễ dàng thay đổi toàn bộ thông tin bên dưới:
 * - Tên cô dâu, chú rể
 * - Ngày giờ cưới
 * - Địa điểm tổ chức
 * - Tài khoản ngân hàng mừng cưới
 * - Đường dẫn ảnh (bỏ ảnh vào thư mục images/ rồi đổi tên tương ứng)
 */

const WEDDING_DATA = {
  // THÔNG TIN CẶP ĐÔI
  groom: {
    fullName: "Trịnh Đăng Chiến",
    shortName: "Đăng Chiến",
    role: "Chú Rể",
    parents: "Đại diện Nhà Trai",
    address: "Hà Nội",
    phone: "0912 345 678",
    avatar: "images/groom.jpg",
    bio: "Anh luôn tin rằng điều may mắn và tuyệt vời nhất trong cuộc đời chính là được gặp em, yêu em và cùng em viết nên chương mới tràn ngập hạnh phúc."
  },
  bride: {
    fullName: "Trần Thị Kim Oanh",
    shortName: "Kim Oanh",
    role: "Cô Dâu",
    parents: "Đại diện Nhà Gái",
    address: "Hà Nội",
    phone: "0987 654 321",
    avatar: "images/bride.jpg",
    bio: "Cảm ơn anh vì đã luôn yêu thương, lắng nghe và là bến đỗ bình yên nhất của cuộc đời em. Từ hôm nay, chúng ta chính thức là một gia đình."
  },

  // THỜI GIAN ĐÁM CƯỚI (Định dạng YYYY-MM-DDTHH:mm:ss để đếm ngược)
  weddingDate: "2026-11-20T11:00:00",
  displayDateText: "Thứ Sáu, 20 Tháng 11 Năm 2026",
  lunarDateText: "Ngày 12 Tháng 10 Năm Bính Ngọ (Âm Lịch)",

  // LỜI TỰA / LỜI MỜI
  invitationMessage: "Tình yêu không phải là tìm kiếm một người hoàn hảo, mà là học cách nhìn nhận một người không hoàn hảo theo cách hoàn hảo nhất. Hạnh phúc lớn nhất là có người cùng sẻ chia từng khoảnh khắc.",

  // CÁC SỰ KIỆN / TIỆC CƯỚI
  events: [
    {
      id: "le-vu-quy",
      title: "LỄ VU QUY (NHÀ GÁI)",
      time: "09:00",
      date: "20/11/2026",
      locationName: "Tư Gia Nhà Gái",
      address: "Số 68 Đường Kim Mã, Quận Ba Đình, TP. Hà Nội",
      mapUrl: "https://maps.google.com/?q=Ba+Dinh+Ha+Noi",
      note: "Hôn lễ diễn ra trang trọng theo nghi thức truyền thống"
    },
    {
      id: "le-thanh-hon",
      title: "LỄ THÀNH HÔN & TIỆC CƯỚI",
      time: "11:30",
      date: "20/11/2026",
      locationName: "Trung Tâm Hội Nghị Tiệc Cưới Trống Đồng Palace",
      address: "Số 72 Quán Sứ, Phường Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội",
      mapUrl: "https://maps.google.com/?q=Quan+Su+Hoan+Kiem+Ha+Noi",
      note: "Tiệc trưa thân mật cùng gia đình và bạn bè thân thương"
    }
  ],

  // CÂU CHUYỆN TÌNH YÊU
  loveStory: [
    {
      year: "2021",
      title: "Lần Đầu Gặp Gỡ",
      content: "Một buổi chiều thu Hà Nội tại quán cà phê góc phố quen, hai ánh mắt vô tình chạm nhau và câu chuyện bắt đầu."
    },
    {
      year: "2022",
      title: "Chính Thức Yêu Nhau",
      content: "Sau bao lần hẹn hò, những chuyến đi dạo hồ Tây ngắm hoàng hôn, lời tỏ tình chân thành đã nhận được cái gật đầu mỉm cười."
    },
    {
      year: "2025",
      title: "Lời Cầu Hôn Ngọt Ngào",
      content: "Dưới ánh hoàng hôn bên bờ biển lộng gió, chiếc nhẫn được trao với lời hứa sẽ cùng nhau đi hết chặng đường đời."
    },
    {
      year: "2026",
      title: "Ngày Chung Đôi",
      content: "Chính thức về chung một mái nhà, cùng nhau xây dựng tổ ấm ngập tràn yêu thương và tiếng cười hạnh phúc."
    }
  ],

  // BỘ SƯU TẬP ẢNH CƯỚI
  gallery: [
    { src: "images/gallery-1.jpg", caption: "Nụ cười rạng rỡ của chúng mình" },
    { src: "images/gallery-2.jpg", caption: "Bên nhau bình yên từng khoảnh khắc" },
    { src: "images/gallery-3.jpg", caption: "Ánh mắt trao nhau vẹn tròn yêu thương" },
    { src: "images/gallery-4.jpg", caption: "Nắm tay nhau đi qua giông bão" },
    { src: "images/gallery-5.jpg", caption: "Hạnh phúc giản đơn là có em" },
    { src: "images/gallery-6.jpg", caption: "Khoảnh khắc tuyệt vời nhất cuộc đời" }
  ],

  // THÔNG TIN MỪNG CƯỚI (QUÀ & TÀI KHOẢN NGÂN HÀNG)
  banking: {
    groom: {
      bankName: "MBBank (Quân Đội)",
      accountNumber: "0912345678",
      accountName: "TRINH DANG CHIEN",
      qrImage: "images/qr-groom.jpg",
      bin: "970422" // Mã ngân hàng MBBank
    },
    bride: {
      bankName: "Vietcombank",
      accountNumber: "9876543210",
      accountName: "TRAN THI KIM OANH",
      qrImage: "images/qr-bride.jpg",
      bin: "970436" // Mã ngân hàng Vietcombank
    }
  },

  // NHẠC NỀN
  music: {
    // Đặt bài hát của bạn vào thư mục audio/wedding.mp3 hoặc bấm nút "Tùy chỉnh thiệp" để chọn từ máy tính
    url: "audio/wedding.mp3",
    title: "Canon in D - Romantic Wedding Melodies"
  }
};
