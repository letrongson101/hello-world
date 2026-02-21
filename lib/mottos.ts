export const mottos = [
  "Lộc đến như ý, cả năm bứt phá!",
  "Giữ vibe tích cực, tài lộc tự tìm đến.",
  "Đầu năm đỏ vận, KPI lên hương.",
  "Lộc xuân gõ cửa, deal nào cũng chốt.",
  "Bình an trong tim, thành công trong tay.",
  "Tết này may mắn, cả năm rực sáng.",
  "Năng lượng cao, vận đỏ theo sau.",
  "Tiền vô như nước, việc trơn như mơ.",
  "An khang đủ đầy, team mình bay xa.",
  "Làm đâu thắng đó, cười tươi cả năm.",
  "Tụ lộc tụ duyên, mọi điều thuận lợi.",
  "Thần may mỉm cười, đường dài hanh thông.",
  "Mở lì xì ra, mở luôn vận hội.",
  "Năm mới cứng phong độ, tiền vào đúng độ.",
  "Lộc nhỏ đầu năm, niềm vui cả năm.",
  "Khí chất rực rỡ, tài lộc nở hoa.",
  "Đón xuân phơi phới, vạn sự như ý.",
  "Lộc về đúng lúc, niềm vui nhân đôi.",
  "Tài chính vững vàng, cuộc sống nhẹ nhàng.",
  "Tết vui trọn vẹn, lộc đầy túi xinh.",
  "Tâm an thì lộc đến.",
  "Đỏ cả năm, chất cả team.",
  "Đi làm hứng khởi, đi chơi hết mình.",
  "Lộc xuân trao tay, may mắn đầy vai.",
  "Giữ lửa đam mê, giữ luôn vận đỏ.",
  "Xuân này thật chill, tiền về thật real.",
  "Sáng tạo bùng nổ, lộc phát bất ngờ.",
  "Một phong bao đỏ, ngàn nụ cười tươi.",
  "Tết ấm tình thân, năm mới thăng hoa.",
  "Đón lộc đầu năm, mở lòng đón phúc.",
  "May mắn gõ cửa, niềm vui ở lại.",
  "Tiền tài hanh thông, tinh thần vững vàng.",
  "Lộc xuân nho nhỏ, hạnh phúc to to.",
  "Mỗi ngày một bước, tài lộc thêm chút.",
  "Nụ cười hôm nay là lộc ngày mai.",
  "Đầu năm mở lộc, cuối năm mở champagne.",
  "Vía cực mạnh, chuyện gì cũng lành.",
  "Thành công gõ nhịp, tài lộc gõ cửa.",
  "Xuân này rực cháy, công việc suôn mây.",
  "Niềm vui lan tỏa, lộc đến chan hòa.",
  "Sống trọn tích cực, hút lộc tự nhiên.",
  "Đầu tư năng lượng, thu về may mắn.",
  "Tết đến phúc đến, bạn đến lộc đến.",
  "Lộc đỏ cầm tay, an yên trong lòng.",
  "Vững nghiệp vững tâm, vạn điều tốt đẹp.",
  "Năm mới tỏa sáng theo cách của bạn.",
  "Lộc xuân ươm mầm, thành quả nở hoa.",
  "Mở lì xì phát, mở ngay niềm vui.",
  "Hân hoan đón Tết, hạnh phúc đủ đầy.",
  "Chúc bạn một năm vừa giàu vừa vui."
];

export const titleByAmount = (amount: number, max: number, min: number) => {
  const ratio = (amount - min) / Math.max(1, max - min);
  if (ratio > 0.9) return "Thần Tài";
  if (ratio > 0.75) return "Vía cực mạnh";
  if (ratio > 0.5) return "Lộc bất ngờ";
  if (ratio > 0.3) return "Lộc nở hoa";
  return "Lộc khởi sắc";
};
