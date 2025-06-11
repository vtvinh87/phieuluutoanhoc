
import { GradeLevel, IslandConfig } from './types';

export const GEMINI_API_MODEL = 'gemini-2.5-flash-preview-04-17';

export const QUESTIONS_PER_ISLAND = 5; // Number of questions per island
export const MAX_PLAYER_LIVES = 3; 
export const ISLANDS_PER_GRADE = 10; // New constant

export const API_KEY_ERROR_MESSAGE = "Lỗi: API Key cho Gemini chưa được cấu hình. Vui lòng kiểm tra biến môi trường process.env.API_KEY.";
export const QUESTION_GENERATION_ERROR_MESSAGE = "Rất tiếc, không thể tạo câu hỏi mới. Hãy thử lại!";
export const HINT_GENERATION_ERROR_MESSAGE = "Rất tiếc, Thần Toán Học tạm thời không thể đưa ra gợi ý. Hãy thử tự suy nghĩ thêm nhé!";
export const HINT_API_KEY_ERROR_MESSAGE = "Lỗi: API Key không hợp lệ. Vui lòng kiểm tra lại.";
export const HINT_LOADING_MESSAGE = "Thần Toán Học đang suy nghĩ...";
export const HINT_UNAVAILABLE_MESSAGE = "Thần Toán Học đang suy nghĩ... Hãy thử lại sau giây lát nhé!";

export const GRADE_LEVEL_TEXT_MAP: Record<GradeLevel, string> = {
  [GradeLevel.GRADE_1]: "Lớp 1",
  [GradeLevel.GRADE_2]: "Lớp 2",
  [GradeLevel.GRADE_3]: "Lớp 3",
  [GradeLevel.GRADE_4]: "Lớp 4",
  [GradeLevel.GRADE_5]: "Lớp 5",
};

// Sound Effect URLs - Updated with user-provided Pixabay links
export const HOVER_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/02/17/audio_988aaf064c.mp3?filename=click-21156.mp3";
export const GRADE_SELECT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/05/06/audio_f823c08739.mp3?filename=select-003-337609.mp3";
export const ISLAND_SELECT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/05/06/audio_f823c08739.mp3?filename=select-003-337609.mp3";
export const ANSWER_SELECT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/02/25/audio_07b0c21a3b.mp3?filename=button-305770.mp3";
export const CHECK_ANSWER_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/05/31/audio_be1e4daf3e.mp3?filename=impact-cinematic-boom-5-352465.mp3";
export const CORRECT_ANSWER_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/04/11/audio_3933ad0008.mp3?filename=level-up-5-326133.mp3";
export const INCORRECT_ANSWER_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/05/31/audio_e9d22d9131.mp3?filename=error-11-352286.mp3";
export const VICTORY_FANFARE_SOUND_URL = "https://cdn.pixabay.com/download/audio/2023/04/13/audio_c18d89e292.mp3?filename=brass-fanfare-with-timpani-and-winchimes-reverberated-146260.mp3";
export const BUTTON_CLICK_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/09/29/audio_a4b3f2fe44.mp3?filename=select-sound-121244.mp3";


// Island Configuration - Updated based on curriculum summary
export const ISLAND_CONFIGS: IslandConfig[] = [
  // --- GRADE 1 --- (10 Islands)
  {
    islandId: "g1_island_01_counting_1_10",
    islandNumber: 1,
    name: "Đảo Số Đếm Ban Sơ (1-10)",
    description: "Bé học đọc, viết, đếm và so sánh các số trong phạm vi 10.",
    topics: ["đếm số lượng đồ vật trong phạm vi 10", "nhận biết mặt số từ 1 đến 10", "so sánh các số trong phạm vi 10 (lớn hơn, bé hơn, bằng nhau)", "sắp xếp các số theo thứ tự trong phạm vi 10"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "1️⃣"
  },
  {
    islandId: "g1_island_02_addition_subtraction_10",
    islandNumber: 2,
    name: "Vịnh Cộng Trừ Nhỏ (Phạm vi 10)",
    description: "Làm quen với phép cộng, trừ qua các hoạt động thực tế trong phạm vi 10.",
    topics: ["phép cộng trong phạm vi 10 (không nhớ)", "phép trừ trong phạm vi 10 (không nhớ)", "bài toán có lời văn về phép cộng, trừ đơn giản phạm vi 10", "tìm số còn thiếu trong phép tính cộng trừ phạm vi 10"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "➕➖"
  },
  {
    islandId: "g1_island_03_basic_shapes",
    islandNumber: 3,
    name: "Đảo Hình Học Ngộ Nghĩnh",
    description: "Nhận biết các hình cơ bản: vuông, tròn, tam giác, chữ nhật và thực hành xếp ghép.",
    topics: ["nhận biết hình vuông", "nhận biết hình tròn", "nhận biết hình tam giác", "nhận biết hình chữ nhật", "xếp, ghép các hình cơ bản tạo thành hình mới"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "🟧🔺🔵"
  },
  {
    islandId: "g1_island_04_length_comparison_cm",
    islandNumber: 4,
    name: "Sông Dài Ngắn (Đo độ dài)",
    description: "So sánh độ dài, làm quen đơn vị đo không chuẩn và xăng-ti-mét.",
    topics: ["so sánh độ dài (dài hơn, ngắn hơn, cao hơn, thấp hơn)", "đo độ dài bằng đơn vị không chuẩn (bước chân, gang tay)", "làm quen đơn vị xăng-ti-mét (cm)", "đo độ dài bằng thước kẻ đơn vị cm"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "📏"
  },
  {
    islandId: "g1_island_05_time_days_clock",
    islandNumber: 5,
    name: "Đảo Thời Gian Kỳ Diệu",
    description: "Nhận biết giờ đúng trên đồng hồ, các ngày trong tuần và tháng.",
    topics: ["xem giờ đúng trên đồng hồ (ví dụ: 3 giờ, 7 giờ)", "khái niệm ngày, tuần, tháng", "các ngày trong tuần", "các buổi trong ngày (sáng, trưa, chiều, tối)"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "⏰🗓️"
  },
  {
    islandId: "g1_island_06_numbers_up_to_100",
    islandNumber: 6,
    name: "Thung Lũng Số Trăm (Đến 100)",
    description: "Học đọc, viết, đếm, so sánh và sắp xếp các số trong phạm vi 100.",
    topics: ["đọc, viết số trong phạm vi 100", "đếm số trong phạm vi 100", "so sánh các số trong phạm vi 100", "sắp xếp các số theo thứ tự trong phạm vi 100", "cấu tạo số có hai chữ số (chục, đơn vị)"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "💯"
  },
  {
    islandId: "g1_island_07_addition_subtraction_100",
    islandNumber: 7,
    name: "Biển Cộng Trừ Lớn (Phạm vi 100)",
    description: "Thực hiện phép cộng, trừ trong phạm vi 100 (không nhớ).",
    topics: ["phép cộng trong phạm vi 100 (không nhớ)", "phép trừ trong phạm vi 100 (không nhớ)", "đặt tính rồi tính (không nhớ) với số có hai chữ số", "bài toán có lời văn về cộng trừ phạm vi 100 (một bước)"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "➕➖🌊"
  },
  {
    islandId: "g1_island_08_geometry_points_lines",
    islandNumber: 8,
    name: "Xứ Sở Điểm và Đường Thẳng",
    description: "Làm quen với điểm, đoạn thẳng, đường thẳng qua các hoạt động thực tế.",
    topics: ["khái niệm điểm", "khái niệm đoạn thẳng", "vẽ đoạn thẳng", "khái niệm đường thẳng (giới thiệu sơ lược)"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "📍➖"
  },
  {
    islandId: "g1_island_09_weight_money_intro",
    islandNumber: 9,
    name: "Chợ Nặng Nhẹ & Tiền Tệ",
    description: "So sánh nặng/nhẹ, làm quen với ki-lô-gam và các mệnh giá tiền Việt Nam cơ bản.",
    topics: ["so sánh cân nặng (nặng hơn, nhẹ hơn)", "làm quen đơn vị ki-lô-gam (kg)", "nhận biết các mệnh giá tiền Việt Nam cơ bản (ví dụ: 1000đ, 2000đ, 5000đ)", "thực hành đổi tiền đơn giản (trong phạm vi nhỏ)"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "⚖️💰"
  },
  {
    islandId: "g1_island_10_word_problems_review_grade1",
    islandNumber: 10,
    name: "Đỉnh Vinh Quang Lớp 1",
    description: "Giải toán có lời văn đơn giản và ôn tập kiến thức Lớp 1.",
    topics: ["giải bài toán có lời văn (phép cộng, phép trừ - một bước tính)", "phân tích đề bài, tìm dữ kiện", "chọn phép tính phù hợp", "ôn tập số học phạm vi 100", "ôn tập hình học cơ bản", "ôn tập đo lường cơ bản"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "🌟🧩"
  },

  // --- GRADE 2 --- (10 Islands)
  {
    islandId: "g2_island_01_numbers_to_1000",
    islandNumber: 1,
    name: "Đảo Số Nghìn (Đến 1000)",
    description: "Đọc, viết, so sánh, sắp xếp các số trong phạm vi 100 và 1000.",
    topics: ["đọc, viết số trong phạm vi 1000", "so sánh số trong phạm vi 1000", "sắp xếp thứ tự các số trong phạm vi 1000", "cấu tạo số có ba chữ số (trăm, chục, đơn vị)"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: " K" // Using K for 1000
  },
  {
    islandId: "g2_island_02_addition_subtraction_with_carry_100",
    islandNumber: 2,
    name: "Vịnh Cộng Trừ Có Nhớ (100)",
    description: "Thực hiện phép cộng, trừ có nhớ trong phạm vi 100.",
    topics: ["phép cộng có nhớ trong phạm vi 100", "phép trừ có nhớ trong phạm vi 100", "đặt tính rồi tính (có nhớ) trong phạm vi 100", "tìm số hạng, số bị trừ, số trừ trong phép tính"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "➕✨➖"
  },
  {
    islandId: "g2_island_03_multiplication_division_2_3",
    islandNumber: 3,
    name: "Biển Nhân Chia (Bảng 2, 3)",
    description: "Làm quen bảng nhân, chia 2 và 3. Hiểu mối liên hệ giữa nhân và cộng, chia và trừ.",
    topics: ["bảng nhân 2", "bảng nhân 3", "phép chia cho 2 (trong bảng nhân 2)", "phép chia cho 3 (trong bảng nhân 3)", "mối liên hệ giữa phép nhân và phép cộng (nhân là cộng các số hạng bằng nhau)", "thừa số - tích"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "✖️➗2️⃣3️⃣"
  },
  {
    islandId: "g2_island_04_geometry_lines_shapes_2",
    islandNumber: 4,
    name: "Rừng Hình Học (Đường & Hình)",
    description: "Nhận biết điểm, đoạn thẳng, đường thẳng, đường cong, đường gấp khúc, hình tứ giác.",
    topics: ["nhận biết điểm, đoạn thẳng, đường thẳng", "phân biệt đường cong, đường gấp khúc", "nhận biết hình tứ giác (hình chữ nhật, hình vuông là trường hợp đặc biệt)", "thực hành gấp, cắt, xếp hình"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "📐🌲"
  },
  {
    islandId: "g2_island_05_length_dm_m_km_mm",
    islandNumber: 5,
    name: "Thung Lũng Đo Dài (dm, m, km, mm)",
    description: "Làm quen với đề-xi-mét, mét, ki-lô-mét, mi-li-mét. Thực hành đo lường.",
    topics: ["đơn vị đo độ dài: đề-xi-mét (dm), mét (m)", "đơn vị đo độ dài: ki-lô-mét (km), mi-li-mét (mm)", "quan hệ giữa các đơn vị đo độ dài (m và cm, m và dm, km và m)", "thực hành đo độ dài đồ vật"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "📏🏞️"
  },
  {
    islandId: "g2_island_06_time_calendar_weight_volume_kg_l",
    islandNumber: 6,
    name: "Đảo Thời Gian & Cân Đo (Lịch, kg, lít)",
    description: "Xem đồng hồ, đọc lịch, xác định ngày trong tuần. Hiểu về ki-lô-gam và lít.",
    topics: ["xem đồng hồ (giờ đúng, giờ rưỡi, giờ hơn)", "đọc lịch (ngày, tháng, năm)", "xác định ngày trong tuần", "đơn vị đo khối lượng: kilôgam (kg)", "đơn vị đo dung tích: lít (l)", "áp dụng kg, lít vào tình huống thực tế"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "🕰️📅⚖️💧"
  },
  {
    islandId: "g2_island_07_addition_subtraction_1000",
    islandNumber: 7,
    name: "Đại Dương Cộng Trừ (Đến 1000)",
    description: "Mở rộng phép cộng, trừ (có nhớ) trong phạm vi 1000.",
    topics: ["phép cộng có nhớ trong phạm vi 1000", "phép trừ có nhớ trong phạm vi 1000", "tính nhẩm cộng trừ số tròn trăm, tròn chục trong phạm vi 1000"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "➕➖🌊 K"
  },
  {
    islandId: "g2_island_08_multiplication_division_4_5",
    islandNumber: 8,
    name: "Hang Động Nhân Chia (Bảng 4, 5)",
    description: "Chinh phục bảng nhân, chia 4 và 5.",
    topics: ["bảng nhân 4", "bảng nhân 5", "phép chia cho 4 (trong bảng nhân 4)", "phép chia cho 5 (trong bảng nhân 5)", "mối liên hệ giữa phép chia và phép trừ"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "✖️➗4️⃣5️⃣"
  },
  {
    islandId: "g2_island_09_word_problems_more_less",
    islandNumber: 9,
    name: "Vực Toán Đố (Nhiều Hơn, Ít Hơn)",
    description: "Giải các bài toán về 'nhiều hơn', 'ít hơn' và các bài toán đố đơn giản.",
    topics: ["bài toán về 'nhiều hơn' (dùng phép cộng)", "bài toán về 'ít hơn' (dùng phép trừ)", "giải bài toán có lời văn liên quan đến cộng, trừ, nhân, chia (một bước tính)"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "🧩⛰️"
  },
  {
    islandId: "g2_island_10_review_grade2",
    islandNumber: 10,
    name: "Đỉnh Cao Lớp 2",
    description: "Ôn tập kiến thức trọng tâm Lớp 2: số học, hình học, đo lường, giải toán.",
    topics: ["số và phép tính trong phạm vi 1000 (cộng, trừ có nhớ)", "bảng nhân, chia 2, 3, 4, 5", "hình học cơ bản (đoạn thẳng, đường gấp khúc, tứ giác)", "đo lường (độ dài, khối lượng, dung tích, thời gian)", "giải toán có lời văn (nhiều hơn, ít hơn, một bước tính)"],
    targetGradeLevel: GradeLevel.GRADE_2,
    mapIcon: "🌟🏆"
  },

  // --- GRADE 3 --- (10 Islands)
  {
    islandId: "g3_island_01_numbers_to_10000_roman",
    islandNumber: 1,
    name: "Biển Số Vạn Dặm (Đến 10,000 & La Mã)",
    description: "Đọc, viết, so sánh số đến 10,000. Làm quen số La Mã cơ bản (I, V, X).",
    topics: ["đọc, viết số trong phạm vi 10000", "so sánh, sắp xếp số trong phạm vi 10000", "cấu tạo số (nghìn, trăm, chục, đơn vị)", "làm quen số La Mã cơ bản (I, V, X)"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "📜🌊"
  },
  {
    islandId: "g3_island_02_add_subtract_10000_carry",
    islandNumber: 2,
    name: "Đại Dương Cộng Trừ Lớn (10,000 có nhớ)",
    description: "Cộng, trừ các số có đến 4 chữ số (có nhớ).",
    topics: ["phép cộng các số trong phạm vi 10000 (có nhớ)", "phép trừ các số trong phạm vi 10000 (có nhớ)", "tính giá trị biểu thức số có phép cộng, trừ"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "➕➖🚢"
  },
  {
    islandId: "g3_island_03_multiplication_division_all_tables",
    islandNumber: 3,
    name: "Rừng Nhân Chia Toàn Tập (Bảng 2-9)",
    description: "Hoàn thiện bảng nhân, chia từ 2 đến 9. Nhân, chia số 2-3 chữ số cho số 1 chữ số.",
    topics: ["bảng nhân từ 2 đến 9", "bảng chia từ 2 đến 9", "nhân số có 2, 3 chữ số với số có 1 chữ số (có nhớ và không nhớ)", "chia số có 2, 3 chữ số cho số có 1 chữ số (chia hết và chia có dư)"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "✖️➗🌳"
  },
  {
    islandId: "g3_island_04_fractions_basic_comparison",
    islandNumber: 4,
    name: "Đảo Phân Số Kỳ Diệu",
    description: "Hiểu khái niệm phân số cơ bản và so sánh phân số đơn giản.",
    topics: ["khái niệm phân số (một phần mấy của một đơn vị)", "đọc, viết các phân số đơn giản (ví dụ: 1/2, 1/3, 1/4)", "so sánh hai phân số cùng mẫu số (đơn giản)", "so sánh phân số với 1"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "🍕🏝️"
  },
  {
    islandId: "g3_island_05_geometry_shapes_perimeter_angles",
    islandNumber: 5,
    name: "Vịnh Hình Học (Chu vi, Góc)",
    description: "Tính chu vi hình vuông, chữ nhật, tam giác. Làm quen góc vuông, góc không vuông, đường song song, vuông góc.",
    topics: ["tính chu vi hình vuông", "tính chu vi hình chữ nhật", "tính chu vi hình tam giác", "nhận biết góc vuông, góc không vuông", "nhận biết hai đường thẳng song song, vuông góc (bằng trực quan và ê ke)"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "📐🏞️"
  },
  {
    islandId: "g3_island_06_length_mass_volume_conversion",
    islandNumber: 6,
    name: "Thung Lũng Đo Lường (Đổi Đơn Vị)",
    description: "Sử dụng các đơn vị đo độ dài (cm, m, km), khối lượng (g, kg), dung tích (l, ml) và chuyển đổi đơn vị.",
    topics: ["đơn vị đo độ dài: cm, m, km; chuyển đổi 1m = 100cm, 1km = 1000m", "đơn vị đo khối lượng: gam (g), ki-lô-gam (kg); chuyển đổi 1kg = 1000g", "đơn vị đo dung tích: lít (l), mi-li-lít (ml); chuyển đổi 1l = 1000ml", "thực hành cân, đo"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "📏⚖️💧"
  },
  {
    islandId: "g3_island_07_time_duration_area_rectangle_square",
    islandNumber: 7,
    name: "Đảo Thời Gian & Diện Tích",
    description: "Đọc giờ (phút, giây), tính khoảng thời gian. Khái niệm diện tích, tính diện tích hình vuông, chữ nhật.",
    topics: ["đọc giờ chính xác đến phút, giây", "tính khoảng thời gian đơn giản", "đổi đơn vị thời gian (1 giờ = 60 phút, 1 phút = 60 giây)", "khái niệm diện tích", "tính diện tích hình vuông (đơn vị cm2, m2)", "tính diện tích hình chữ nhật (đơn vị cm2, m2)"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "⏱️🖼️"
  },
  {
    islandId: "g3_island_08_money_calculations_expressions",
    islandNumber: 8,
    name: "Chợ Tiền Tệ & Biểu Thức",
    description: "Tính toán với các mệnh giá tiền. Tính giá trị biểu thức số có dấu ngoặc.",
    topics: ["tính toán với các mệnh giá tiền Việt Nam (cộng, trừ, nhân, chia liên quan đến tiền)", "đổi tiền", "tính giá trị biểu thức số có phép cộng, trừ, nhân, chia (có dấu ngoặc và không có dấu ngoặc, ưu tiên phép tính)"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "💰💹"
  },
  {
    islandId: "g3_island_09_word_problems_multistep_ratio_average",
    islandNumber: 9,
    name: "Rừng Toán Đố Nâng Cao (Nhiều Bước)",
    description: "Giải bài toán có 2-3 bước tính, liên quan tỷ số, trung bình cộng.",
    topics: ["giải bài toán có lời văn (2-3 bước tính) liên quan cộng, trừ, nhân, chia", "bài toán liên quan đến tìm một trong các phần bằng nhau của một số", "bài toán liên quan đến gấp một số lên nhiều lần, giảm đi một số lần", "làm quen bài toán tìm số trung bình cộng (đơn giản)"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "🧩🧠🌲"
  },
  {
    islandId: "g3_island_10_review_grade3",
    islandNumber: 10,
    name: "Đỉnh Cao Lớp 3",
    description: "Tổng hợp kiến thức Lớp 3: Số học, hình học, đo lường, giải toán đa dạng.",
    topics: ["số và phép tính trong phạm vi 10000", "phân số cơ bản", "hình học (chu vi, diện tích hình chữ nhật, vuông, góc)", "đo lường (độ dài, khối lượng, dung tích, thời gian, diện tích)", "tính giá trị biểu thức", "giải toán có lời văn (nhiều bước)"],
    targetGradeLevel: GradeLevel.GRADE_3,
    mapIcon: "🌟🏆"
  },

  // --- GRADE 4 --- (10 Islands)
  {
    islandId: "g4_island_01_numbers_to_millions_value",
    islandNumber: 1,
    name: "Đại Dương Số Triệu (Đến 1.000.000)",
    description: "Đọc, viết, so sánh, làm tròn số tự nhiên đến hàng triệu. Hiểu giá trị chữ số.",
    topics: ["đọc, viết số tự nhiên đến lớp triệu", "so sánh, sắp xếp các số tự nhiên đến lớp triệu", "giá trị của chữ số theo vị trí (hàng, lớp)", "làm tròn số đến hàng chục nghìn, trăm nghìn"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "🌊💯 K"
  },
  {
    islandId: "g4_island_02_operations_large_numbers_expressions_brackets",
    islandNumber: 2,
    name: "Vịnh Tính Toán Số Lớn & Biểu Thức",
    description: "Cộng, trừ, nhân, chia số tự nhiên lớn. Tính giá trị biểu thức có dấu ngoặc, ưu tiên phép tính.",
    topics: ["phép cộng, trừ các số có nhiều chữ số", "phép nhân với số có đến 3 chữ số", "phép chia cho số có đến 2 chữ số (chia hết, chia có dư)", "tính giá trị biểu thức có dấu ngoặc, thứ tự thực hiện phép tính"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "🧮🚢()"
  },
  {
    islandId: "g4_island_03_fractions_simplify_compare_mixed_numbers",
    islandNumber: 3,
    name: "Quần Đảo Phân Số (Nâng Cao)",
    description: "So sánh, rút gọn phân số. Cộng, trừ phân số cùng mẫu. Làm quen hỗn số.",
    topics: ["rút gọn phân số (đưa về phân số tối giản)", "quy đồng mẫu số các phân số (trường hợp đơn giản)", "so sánh hai phân số (cùng mẫu, khác mẫu sau quy đồng)", "phép cộng, trừ hai phân số cùng mẫu số", "làm quen với hỗn số (đọc, viết)"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "📜✂️🏝️ 1½"
  },
  {
    islandId: "g4_island_04_ratio_proportion_roman_numerals_extended",
    islandNumber: 4,
    name: "Biển Tỷ Lệ & Số La Mã",
    description: "Hiểu tỷ số, tỷ lệ. Mở rộng số La Mã.",
    topics: ["khái niệm tỷ số của hai số", "bài toán liên quan đến tỷ lệ (đơn giản)", "đọc, viết số La Mã mở rộng (L, C, D, M)", "tìm một trong các phần bằng nhau của một số"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "📊📜🌊"
  },
  {
    islandId: "g4_island_05_geometry_parallelogram_rhombus_angles_symmetry",
    islandNumber: 5,
    name: "Rừng Hình Học (Bình Hành, Thoi, Góc, Đối Xứng)",
    description: "Nhận biết, tính chu vi, diện tích hình bình hành, thoi. Góc nhọn, tù, vuông. Trục đối xứng.",
    topics: ["nhận biết hình bình hành, hình thoi", "tính chu vi, diện tích hình bình hành", "tính chu vi, diện tích hình thoi", "khái niệm góc nhọn, góc tù, góc vuông", "đo và vẽ góc bằng thước đo độ", "nhận biết trục đối xứng của một số hình đơn giản"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "💠📐🌳"
  },
  {
    islandId: "g4_island_06_length_mass_volume_area_conversions_advanced",
    islandNumber: 6,
    name: "Thung Lũng Đo Lường (Chuyên Sâu)",
    description: "Chuyển đổi các đơn vị đo độ dài (mm, cm, m, km), khối lượng (g, kg, tạ, tấn), diện tích (cm², m², km², ha).",
    topics: ["chuyển đổi các đơn vị đo độ dài", "chuyển đổi các đơn vị đo khối lượng", "chuyển đổi các đơn vị đo diện tích (cm2, m2, dm2, ha, km2)", "áp dụng vào bài toán thực tế"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "📏⚖️🏞️"
  },
  {
    islandId: "g4_island_07_time_velocity_distance",
    islandNumber: 7,
    name: "Đảo Thời Gian & Vận Tốc",
    description: "Tính khoảng thời gian, đổi đơn vị. Làm quen vận tốc (km/h).",
    topics: ["tính khoảng thời gian (phút, giờ, ngày)", "chuyển đổi đơn vị thời gian (giờ sang phút, ngày sang giờ)", "làm quen với khái niệm vận tốc (km/h, m/s)", "tính quãng đường khi biết vận tốc và thời gian (đơn giản)"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "⏱️💨"
  },
  {
    islandId: "g4_island_08_money_profit_loss_bar_charts",
    islandNumber: 8,
    name: "Chợ Tiền Tệ & Biểu Đồ",
    description: "Tính toán mua bán, lãi/lỗ đơn giản. Đọc, phân tích biểu đồ cột.",
    topics: ["bài toán mua bán, tính lãi/lỗ đơn giản", "đọc và phân tích số liệu trên biểu đồ cột", "tìm số trung bình cộng"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "💹📊"
  },
  {
    islandId: "g4_island_09_word_problems_sum_diff_ratio_motion",
    islandNumber: 9,
    name: "Vực Toán Đố (Tổng/Hiệu-Tỷ, Chuyển Động)",
    description: "Giải toán tìm hai số khi biết tổng/hiệu và tỷ số. Bài toán chuyển động đơn giản.",
    topics: ["bài toán tìm hai số khi biết tổng và tỉ số của hai số đó", "bài toán tìm hai số khi biết hiệu và tỉ số của hai số đó", "bài toán chuyển động đơn giản (tính quãng đường, thời gian, vận tốc)"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "⚖️🧩🚗"
  },
  {
    islandId: "g4_island_10_review_grade4",
    islandNumber: 10,
    name: "Đỉnh Cao Lớp 4",
    description: "Tổng kết kiến thức Lớp 4: Số tự nhiên, phân số, hình học, đo lường, giải toán.",
    topics: ["số tự nhiên và phép tính đến lớp triệu", "phân số và phép tính cơ bản", "hình học (hình bình hành, thoi, góc)", "đo lường và chuyển đổi đơn vị", "biểu đồ cột, trung bình cộng", "giải toán có lời văn (tổng/hiệu-tỷ, chuyển động)"],
    targetGradeLevel: GradeLevel.GRADE_4,
    mapIcon: "🌟🏆"
  },

  // --- GRADE 5 --- (10 Islands)
  {
    islandId: "g5_island_01_natural_numbers_decimals_up_to_thousandths",
    islandNumber: 1,
    name: "Quần Đảo Số Tự Nhiên & Thập Phân (Đến Phần Nghìn)",
    description: "Đọc, viết, so sánh, làm tròn số tự nhiên (hàng tỷ) và số thập phân (đến phần nghìn).",
    topics: ["đọc, viết, so sánh số tự nhiên đến hàng tỷ", "đọc, viết, so sánh số thập phân (đến phần nghìn)", "làm tròn số tự nhiên và số thập phân", "cấu tạo số thập phân"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "💯.001🏝️"
  },
  {
    islandId: "g5_island_02_decimal_operations_conversion_to_fractions",
    islandNumber: 2,
    name: "Biển Phép Tính Số Thập Phân",
    description: "Thực hiện cộng, trừ, nhân, chia số thập phân. Chuyển đổi số thập phân thành phân số và ngược lại.",
    topics: ["phép cộng, trừ số thập phân", "phép nhân số thập phân với số tự nhiên, với số thập phân", "phép chia số thập phân cho số tự nhiên, cho số thập phân (thương là số tự nhiên hoặc thập phân)", "chuyển đổi số thập phân thành phân số thập phân và ngược lại"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "➕➖✖️➗.🌊"
  },
  {
    islandId: "g5_island_03_fraction_operations_all",
    islandNumber: 3,
    name: "Rừng Phân Số Toàn Năng",
    description: "Thành thạo rút gọn, quy đồng, cộng, trừ, nhân, chia phân số.",
    topics: ["rút gọn phân số", "quy đồng mẫu số nhiều phân số", "phép cộng, trừ phân số (khác mẫu số)", "phép nhân phân số", "phép chia phân số", "hỗn số và phép tính với hỗn số"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "🌳📜"
  },
  {
    islandId: "g5_island_04_ratio_percentage_average",
    islandNumber: 4,
    name: "Vịnh Tỷ Lệ, Phần Trăm, Trung Bình",
    description: "Hiểu tỷ số, tỷ lệ, phần trăm. Tính phần trăm của một số, tìm số khi biết phần trăm. Tính số đo trung bình.",
    topics: ["tỷ số, tỷ lệ", "tỷ số phần trăm (khái niệm, đọc, viết)", "tìm tỉ số phần trăm của hai số", "tìm giá trị phần trăm của một số cho trước", "tìm một số khi biết giá trị một số phần trăm của nó", "tính số trung bình cộng"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "%📊🌊"
  },
  {
    islandId: "g5_island_05_geometry_triangle_trapezoid_circle_area_perimeter",
    islandNumber: 5,
    name: "Đảo Hình Học Tổng Hợp (Tam Giác, Thang, Tròn)",
    description: "Tính chu vi, diện tích hình tam giác, hình thang, hình tròn.",
    topics: ["đặc điểm hình tam giác, hình thang", "tính diện tích hình tam giác", "tính diện tích hình thang", "hình tròn, đường tròn, tâm, bán kính, đường kính", "tính chu vi hình tròn", "tính diện tích hình tròn"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "🔺🔶⭕📏"
  },
  {
    islandId: "g5_island_06_geometry_3d_cuboid_cube_volume_surface_area_angles",
    islandNumber: 6,
    name: "Thung Lũng Hình Khối & Góc",
    description: "Tính thể tích, diện tích xung quanh, toàn phần hình hộp chữ nhật, lập phương. Đo, vẽ, tính tổng góc trong tam giác, tứ giác.",
    topics: ["tính diện tích xung quanh, toàn phần hình hộp chữ nhật, hình lập phương", "tính thể tích hình hộp chữ nhật, hình lập phương (cm3, m3)", "đo, vẽ góc", "tính tổng số đo các góc trong một tam giác, trong một tứ giác"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "🧊📦📐🏞️"
  },
  {
    islandId: "g5_island_07_measurement_all_units_conversion_speed_time_distance",
    islandNumber: 7,
    name: "Đại Dương Đo Lường & Chuyển Động",
    description: "Chuyển đổi tất cả đơn vị đo. Tính vận tốc, quãng đường, thời gian (v=s/t). Chuyển động cùng chiều, ngược chiều.",
    topics: ["chuyển đổi các đơn vị đo độ dài, khối lượng, diện tích, thể tích", "khái niệm vận tốc, quãng đường, thời gian", "công thức tính vận tốc, quãng đường, thời gian (v=s/t, s=v*t, t=s/v)", "bài toán chuyển động đều cùng chiều, ngược chiều (xuất phát cùng lúc hoặc khác lúc đơn giản)"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "📏⚖️⏱️🚗💨"
  },
  {
    islandId: "g5_island_08_money_interest_cost_profit_pie_charts",
    islandNumber: 8,
    name: "Chợ Tiền Tệ & Biểu Đồ Quạt",
    description: "Tính lãi suất đơn giản, chi phí, lợi nhuận. Đọc, phân tích biểu đồ hình quạt.",
    topics: ["tính lãi suất đơn giản trong giao dịch mua bán, gửi tiết kiệm", "tính chi phí, lợi nhuận", "đọc và phân tích số liệu trên biểu đồ hình quạt (biểu diễn tỉ lệ phần trăm)"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "💹💰🥧"
  },
  {
    islandId: "g5_island_09_word_problems_complex_fractions_decimals_motion_volume",
    islandNumber: 9,
    name: "Mê Cung Toán Đố Phức Hợp (3-4 Bước)",
    description: "Giải bài toán phức hợp (3-4 bước) liên quan phân số, số thập phân, chuyển động, thể tích.",
    topics: ["giải bài toán có lời văn (3-4 bước) kết hợp kiến thức về phân số, số thập phân", "bài toán về tỉ số phần trăm ứng dụng thực tế", "bài toán chuyển động phức tạp hơn", "bài toán liên quan đến thể tích, diện tích xung quanh, toàn phần"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "🧠💡🧩" // labyrinth icon placeholder
  },
  {
    islandId: "g5_island_10_review_grade5_primary_final",
    islandNumber: 10,
    name: "Đỉnh Vinh Quang Tiểu Học",
    description: "Tổng ôn tập toàn bộ kiến thức Toán tiểu học, sẵn sàng cho thử thách mới!",
    topics: ["ôn tập số học (số tự nhiên, phân số, số thập phân, các phép tính, tỉ số phần trăm)", "ôn tập đại lượng và đo đại lượng (độ dài, khối lượng, thời gian, diện tích, thể tích, tiền tệ)", "ôn tập yếu tố hình học (chu vi, diện tích, thể tích các hình đã học)", "ôn tập toán chuyển động", "giải các bài toán có lời văn tổng hợp nhiều dạng"],
    targetGradeLevel: GradeLevel.GRADE_5,
    mapIcon: "🏆🎓🏁"
  }
];

// UI Text Constants
export const CHOOSE_GRADE_TEXT = "Chọn Lớp Của Bạn";
export const CHOOSE_ISLAND_TEXT = "Chọn Hòn Đảo Phiêu Lưu!";
export const ISLAND_TEXT = "Đảo";
export const QUESTION_TEXT = "Câu hỏi";
export const SCORE_TEXT = "Điểm";
export const NEXT_ISLAND_TEXT = "Đảo Tiếp Theo"; 
export const PLAY_AGAIN_TEXT = "Chơi Lại";
export const PLAY_THIS_GRADE_AGAIN_TEXT = "Chơi Lại Lớp Này";
export const CHOOSE_ANOTHER_GRADE_TEXT = "Chọn Lớp Khác";
export const BACK_TO_MAP_TEXT = "Trở Về Bản Đồ";
export const ISLAND_COMPLETE_TEXT = "Hoàn Thành Đảo!";
export const GRADE_COMPLETE_TEXT = "Xuất Sắc! Bạn Đã Vượt Qua Tất Cả Thử Thách Của Lớp Này!";
export const LOCKED_ISLAND_TEXT = "Đảo này vẫn còn bí ẩn, hãy hoàn thành các đảo trước!";
export const NEXT_ISLAND_BUTTON_TEXT = "Đảo Tiếp Theo"; // Added


// Transition and Loading Messages
export const TRAVELLING_TO_ISLAND_TEXT = (islandName: string) => `Đang dong buồm đến ${islandName}...`;
export const UPDATING_MAP_TEXT = "Đang cập nhật bản đồ phiêu lưu...";
export const ISLAND_LOADING_MESSAGE_DETAIL = (islandName: string, qNum: number, totalQ: number) => `Đang khởi tạo câu hỏi ${qNum}/${totalQ} cho ${islandName}...`;
export const ISLAND_PREPARING_MESSAGE = (islandName: string) => `Chuẩn bị khám phá ${islandName}...`;

export const NO_ISLANDS_FOR_GRADE_TEXT = "Hiện tại chưa có hòn đảo nào được thiết kế cho lớp này. Vui lòng chọn lớp khác hoặc kiểm tra lại cấu hình.";
export const START_ADVENTURE_TEXT = "Bắt Đầu Phiêu Lưu!";
export const ALL_GRADES_COMPLETED_TEXT = "Chúc mừng Nhà Thám Hiểm Vĩ Đại! Bạn đã chinh phục tất cả các hòn đảo toán học!";
export const RETURN_TO_GRADE_SELECTION_TEXT = "Quay Lại Chọn Lớp";

// localStorage Keys
export const LOCAL_STORAGE_PREFIX = "mathAdventure_";
export const LAST_SELECTED_GRADE_KEY = `${LOCAL_STORAGE_PREFIX}lastSelectedGrade`;
export const ISLAND_PROGRESS_KEY_PREFIX = `${LOCAL_STORAGE_PREFIX}islandProgress_grade_`;
export const OVERALL_SCORE_KEY_PREFIX = `${LOCAL_STORAGE_PREFIX}overallScore_grade_`;
export const ISLAND_STAR_RATINGS_KEY_PREFIX = `${LOCAL_STORAGE_PREFIX}islandStarRatings_grade_`;
    