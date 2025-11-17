export type DirectionKey =
  | 'bac'
  | 'dong-bac'
  | 'dong'
  | 'dong-nam'
  | 'nam'
  | 'tay-nam'
  | 'tay'
  | 'tay-bac'

export type FlyingStarResult = {
  period: number
  annualStar: number
  directionAdvice: string
  starMeaning: string
}

// Basic approximations. Replace with authoritative data from "Huyền không phi tinh" PDF when available.
const directionAdviceMap: Record<DirectionKey, string> = {
  bac: 'Hướng Bắc thiên về giao tế, thủy khí – hợp lưu thông, ngoại giao, giữ thông thoáng.',
  'dong-bac': 'Hướng Đông Bắc (cấn) ổn định, dưỡng khí – hợp tích lũy, học tập, nuôi dưỡng.',
  dong: 'Hướng Đông sinh trưởng – chú trọng sức khỏe, ánh sáng, khởi động dự án mới.',
  'dong-nam': 'Hướng Đông Nam mộc vượng – hợp thương mại, tăng trưởng, cần cân bằng ẩm.',
  nam: 'Hướng Nam hỏa vượng – hợp danh tiếng, công nghệ, tránh nóng nảy.',
  'tay-nam': 'Hướng Tây Nam thổ dưỡng – hợp hậu cần, chăm sóc gia đình, tránh ẩm thấp.',
  tay: 'Hướng Tây kim – hợp sáng tạo, trẻ nhỏ, kiểm soát chi tiêu.',
  'tay-bac': 'Hướng Tây Bắc quyền quý – hợp lãnh đạo, quý nhân, giữ môi trường thoáng sạch.',
}

const starMeanings: Record<number, string> = {
  1: 'Nhất Bạch Tham Lang: thông minh, lưu thông, hợp học tập/ngoại giao.',
  2: 'Nhị Hắc Cự Môn: chú ý sức khỏe, kiện tụng; nên an tĩnh, hóa giải.',
  3: 'Tam Bích Lộc Tồn: dễ tranh chấp, nên kiềm lời, hợp kế hoạch dài hạn.',
  4: 'Tứ Lục Văn Khúc: văn chương, thi cử, sáng tạo, hợp nghiên cứu.',
  5: 'Ngũ Hoàng Liêm Trinh: đại sát; tránh động thổ, cần hóa giải.',
  6: 'Lục Bạch Vũ Khúc: quyền uy, kỷ luật; hợp công vụ/quân sự, tránh cứng nhắc.',
  7: 'Thất Xích Phá Quân: hao tán, tổn tài; nên tiết chế.',
  8: 'Bát Bạch Tả Phù: tài lộc, ổn định; hợp tích lũy, xây dựng, BĐS.',
  9: 'Cửu Tử Hữu Bật: hỷ khí, danh tiếng; hợp khai trương, công nghệ/sáng tạo.',
}

/** Tính vận (period) 20 năm, mốc 1864-2043. */
function computePeriod(year: number): number {
  // Vận 1: 1864-1883, Vận 2: 1884-1903, ..., Vận 9: 2024-2043
  const periodIndex = Math.floor((year - 1864) / 20)
  const wrapped = ((periodIndex % 9) + 9) % 9
  return wrapped + 1
}

/** Sao lưu niên theo chu kỳ 9 sao, quy giản (thay bằng công thức chuẩn từ tài liệu khi cập nhật). */
function computeAnnualStar(year: number): number {
  return (((year - 4) % 9) + 9) % 9 + 1
}

export function calculateFlyingStar(year: number, direction: DirectionKey): FlyingStarResult {
  const annualStar = computeAnnualStar(year)
  const period = computePeriod(year)
  return {
    period,
    annualStar,
    directionAdvice: directionAdviceMap[direction] ?? '',
    starMeaning: starMeanings[annualStar] ?? '',
  }
}
