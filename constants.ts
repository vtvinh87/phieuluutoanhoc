import { GradeLevel, IslandConfig, IslandDifficulty, Theme, FunQuiz, MessageInBottleContent, FriendlyNPC, NPCInteraction, CollectibleItem, DailyChallengeDefinition, DailyChallengeType, WeeklyChallengeDefinition, WeeklyChallengeType, ThemeAccessory, AccessoryType, UIAccentConfig, SoundPackVariationConfig, BackgroundEffectConfig, CursorTrailConfig } from './types';

export const GEMINI_API_MODEL = 'gemini-2.5-flash';

export const QUESTIONS_PER_ISLAND = 5;
export const QUESTIONS_PER_FINAL_ISLAND = 5; // Số lượng câu hỏi/thử thách đặc biệt cho đảo cuối
export const MAX_PLAYER_LIVES = 3;
export const ISLANDS_PER_GRADE = 10;

// Game Title
export const GAME_TITLE_TEXT = "Cuộc Phiêu Lưu Toán Học Trên Đảo Kho Báu";
export const STUDENT_NAME = "Bình Minh";


// Error Messages
export const API_KEY_ERROR_MESSAGE = "Lỗi: API Key cho Gemini chưa được cấu hình. Vui lòng kiểm tra biến môi trường process.env.API_KEY.";
export const QUESTION_GENERATION_ERROR_MESSAGE = "Rất tiếc, không thể tạo đủ câu hỏi cho hòn đảo này vào lúc này. Nguyên nhân có thể do kết nối hoặc giới hạn truy cập. Vui lòng thử lại sau hoặc chọn một hòn đảo/độ khó khác.";
export const HINT_GENERATION_ERROR_MESSAGE = "Rất tiếc, Thần Toán Học tạm thời không thể đưa ra gợi ý. Hãy tự suy nghĩ thêm nhé!";
export const HINT_API_KEY_ERROR_MESSAGE = "Lỗi: API Key không hợp lệ. Vui lòng kiểm tra lại.";
export const HINT_LOADING_MESSAGE = "Thần Toán Học đang suy nghĩ...";
export const HINT_UNAVAILABLE_MESSAGE = "Thần Toán Học đang suy nghĩ... Hãy thử lại sau giây lát nhé!";

// Grade Level & Difficulty Maps
export const GRADE_LEVEL_TEXT_MAP: Record<GradeLevel, string> = {
  [GradeLevel.GRADE_1]: "Lớp 1",
  [GradeLevel.GRADE_2]: "Lớp 2",
  [GradeLevel.GRADE_3]: "Lớp 3",
  [GradeLevel.GRADE_4]: "Lớp 4",
  [GradeLevel.GRADE_5]: "Lớp 5",
  [GradeLevel.FINAL]: "Thử Thách Tối Thượng",
};

export const ISLAND_DIFFICULTY_TEXT_MAP: Record<IslandDifficulty, string> = {
  [IslandDifficulty.EASY]: "Dễ",
  [IslandDifficulty.MEDIUM]: "Trung Bình",
  [IslandDifficulty.HARD]: "Khó",
};

// UI Text Constants - Static
export const CHOOSE_GRADE_TEXT = "Chọn Lớp Học";
export const CHOOSE_ISLAND_TEXT = "Chọn Hòn Đảo";
export const ISLAND_TEXT = "Đảo";
export const QUESTION_TEXT = "Câu Hỏi";
export const SCORE_TEXT = "Điểm";
export const BACK_TO_MAP_TEXT = "Về Bản Đồ";
export const ISLAND_COMPLETE_TEXT = "Hoàn Thành Đảo!";
export const GRADE_COMPLETE_TEXT = "Hoàn Thành Lớp Học!";
export const LOCKED_ISLAND_TEXT = "Hòn đảo này đã bị khoá. Hoàn thành các đảo trước để mở khoá!";
export const PLAY_AGAIN_TEXT = "Chơi Lại Đảo";
export const CHOOSE_ANOTHER_GRADE_TEXT = "Chọn Lớp Khác";
export const PLAY_THIS_GRADE_AGAIN_TEXT = "Chơi Lại Lớp Này";
export const NO_ISLANDS_FOR_GRADE_TEXT = "Không có hòn đảo nào được cấu hình cho lớp này.";
export const START_ADVENTURE_TEXT = "Bắt Đầu Phiêu Lưu!";
export const UPDATING_MAP_TEXT = "Đang cập nhật bản đồ...";
export const RETURN_TO_GRADE_SELECTION_TEXT = "Về Trang Chọn Lớp";
export const NEXT_ISLAND_BUTTON_TEXT = "Đảo Tiếp Theo";
export const ACHIEVEMENT_UNLOCKED_TOAST_TITLE = "Mở khóa thành tích:";
export const VIEW_ACHIEVEMENTS_BUTTON_TEXT = "Xem Huy Hiệu";
export const ACHIEVEMENTS_SCREEN_TITLE = "Bộ Sưu Tập Huy Hiệu";
export const NO_ACHIEVEMENTS_YET_TEXT = "Bạn chưa đạt được huy hiệu nào. Tiếp tục khám phá nhé!";
export const FILTER_ALL_ACHIEVEMENTS_TEXT = "Tất cả Huy hiệu";
export const FILTER_GRADE_ACHIEVEMENTS_TEXT = (grade: GradeLevel): string => `Huy hiệu Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`;
export const FILTER_GLOBAL_ACHIEVEMENTS_TEXT = "Huy hiệu Toàn Cầu";
export const CLOSE_BUTTON_TEXT = "Đóng";
export const ACHIEVED_ON_TEXT = "Đạt được lúc:";
export const TREASURE_MODAL_TITLE = "Rương Báu!";
export const MESSAGE_IN_BOTTLE_MODAL_TITLE = "Thông Điệp Trong Chai";
export const COLLECTIBLES_TAB_TEXT = "Vật Phẩm Sưu Tầm";
export const ACHIEVEMENTS_TAB_TEXT = "Huy Hiệu";
export const NO_COLLECTIBLES_YET_TEXT = "Bạn chưa sưu tầm được vật phẩm nào.";
export const COLLECTIBLE_UNCOLLECTED_NAME = "Chưa tìm thấy";
export const COLLECTIBLE_UNCOLLECTED_ICON = "❓";
export const FRIENDLY_NPC_MODAL_TITLE_PREFIX = "Gặp gỡ";
export const FRIENDLY_NPC_RIDDLE_PROMPT = "Thử tài giải đố:";
export const FRIENDLY_NPC_ANSWER_BUTTON_TEXT = "Trả Lời Đố";
export const SHOP_TITLE_TEXT = "Cửa Hàng Phụ Kiện";
export const SHOP_BACK_BUTTON_TEXT = "Quay Lại Chọn Lớp";
export const MANAGE_ACCESSORIES_BUTTON_TEXT = "Tùy Chỉnh Giao Diện";
export const ACCESSORY_CUSTOMIZATION_MODAL_TITLE = "Tùy Chỉnh Phụ Kiện Giao Diện";
export const CHOOSE_THEME_TO_CUSTOMIZE_TEXT = "Chọn Giao Diện để Tùy Chỉnh";
export const ACCESSORIES_FOR_THEME_TEXT = (themeName: string) => `Phụ kiện cho Giao Diện: ${themeName}`;
export const NO_OWNED_COMPATIBLE_ACCESSORIES_TEXT = "Bạn chưa sở hữu phụ kiện nào tương thích với giao diện này.";
export const DEACTIVATE_TEXT = "Hủy Kích Hoạt";
export const ACTIVATE_TEXT = "Kích Hoạt";

// --- Role Selection Screen ---
export const ROLE_SELECTION_SUBTITLE_TEXT = "Hoặc, truy cập với vai trò:";
export const PARENT_ROLE_BUTTON_TEXT = "Dành cho Phụ huynh";
export const TEACHER_ROLE_BUTTON_TEXT = "Dành cho Giáo viên";


// --- Parent Dashboard Text ---
export const PARENT_DASHBOARD_TITLE = "Bảng Điều Khiển Của Phụ Huynh";
export const QUICK_OVERVIEW_WIDGET_TITLE = "Tổng Quan Nhanh";
export const TOTAL_STARS_TEXT = "Tổng số Sao";
export const ISLANDS_COMPLETED_TEXT = "Đảo đã hoàn thành";
export const TIME_PLAYED_TEXT = "Thời gian chơi";
export const SKILL_MAP_WIDGET_TITLE = "Bản Đồ Kỹ Năng";
export const SKILL_MAP_NO_DATA_TEXT = "Chưa có đủ dữ liệu để hiển thị. Hãy để bé chơi thêm nhé!";
export const PARENT_TIPS_WIDGET_TITLE = "Gợi Ý Cho Phụ Huynh";
export const GET_NEW_TIP_BUTTON_TEXT = "Nhận Gợi Ý Mới";
export const GENERATING_TIP_TEXT = "Đang tạo gợi ý...";
export const GOALS_WIDGET_TITLE = "Mục Tiêu & Phần Thưởng";
export const SET_NEW_GOAL_SECTION_TITLE = "Đặt Mục Tiêu Mới";
export const GOAL_TYPE_PROMPT = "Bé cần...";
export const GOAL_TYPE_ISLANDS = "Hoàn thành số đảo";
export const GOAL_TYPE_STARS = "Đạt được số sao";
export const GOAL_TARGET_PROMPT = "Số lượng";
export const GOAL_REWARD_PROMPT = "Phần thưởng (Đá Quý)";
export const SET_GOAL_BUTTON_TEXT = "Đặt Mục Tiêu";
export const ACTIVE_GOALS_SECTION_TITLE = "Mục Tiêu Hiện Tại";
export const NO_ACTIVE_GOALS_TEXT = "Chưa có mục tiêu nào được đặt.";
export const GOAL_PROGRESS_TEXT = (current: number, target: number) => `Tiến độ: ${current}/${target}`;
export const GOAL_CLAIMED_TEXT = "Đã nhận thưởng";
export const GOAL_COMPLETED_TOAST_TEXT = (reward: number) => `Hoàn thành mục tiêu! Bạn nhận được ${reward} Đá Quý!`;

// --- Teacher Dashboard Text ---
export const TEACHER_DASHBOARD_TITLE = "Bảng Điều Khiển Của Giáo Viên";
export const CLASS_OVERVIEW_WIDGET_TITLE = "Tổng Quan Lớp Học";
export const CLASS_ROSTER_WIDGET_TITLE = "Danh Sách Lớp";
export const STUDENT_DETAILS_WIDGET_TITLE = "Chi Tiết Học Sinh";
export const ASSIGNMENTS_WIDGET_TITLE = "Bài Tập Đã Giao";
export const NO_STUDENT_SELECTED_TEXT = "Chọn một học sinh từ danh sách để xem chi tiết.";
export const CLASS_SIZE_TEXT = "Sĩ số";
export const AVERAGE_STARS_TEXT = "Sao trung bình";
export const AVERAGE_COMPLETION_TEXT = "Tỉ lệ hoàn thành trung bình";
export const ASSIGN_HOMEWORK_BUTTON_TEXT = "Giao Bài";
export const NO_ASSIGNMENTS_TEXT = "Chưa có bài tập nào được giao.";
export const ASSIGNMENT_DUE_DATE_TEXT = (date: string) => `Hạn nộp: ${date}`;
export const ASSIGN_HOMEWORK_MODAL_TITLE = (studentName: string) => `Giao Bài cho ${studentName}`;
export const SELECT_GRADE_PROMPT = "Chọn Lớp";
export const SELECT_ISLAND_PROMPT = "Chọn Đảo";
export const SELECT_DUE_DATE_PROMPT = "Chọn Hạn Nộp";
export const ASSIGN_BUTTON_TEXT = "Giao Bài";
export const HOMEWORK_ASSIGNED_SUCCESS_TOAST = (islandName: string, studentName: string) => `Đã giao bài "${islandName}" cho ${studentName}.`;
export const HOMEWORK_WIDGET_TITLE = "Bài Tập Về Nhà";
export const GO_TO_ISLAND_BUTTON_TEXT = "Đến Đảo";


// UI Text Constants - Dynamic (Functions)
export const ISLAND_PREPARING_MESSAGE = (islandName: string): string => `Đang chuẩn bị Đảo ${islandName}...`;
export const STARTING_ISLAND_TEXT = (islandName: string, difficulty: string): string => `Bắt đầu Đảo ${islandName} (Cấp độ ${difficulty})!`;
export const TRAVELLING_TO_ISLAND_TEXT = (islandName: string): string => `Đang di chuyển đến Đảo ${islandName}...`;
export const REWARD_TEXT_EASY_PERFECT = "Xuất sắc! Hoàn thành đảo Dễ với điểm tuyệt đối!";
export const REWARD_TEXT_MEDIUM_PERFECT = "Không thể tin được! Chinh phục đảo Trung Bình hoàn hảo!";
export const REWARD_TEXT_HARD_PERFECT = "Đỉnh của chóp! Đảo Khó cũng không làm khó được bạn!";
export const SHOOTING_STAR_CLICK_SUCCESS_MESSAGE = (points: number): string => `Bạn bắt được ngôi sao may mắn và nhận ${points} điểm!`;
export const COLLECTIBLE_COLLECTION_TOAST_MESSAGE = (itemName: string): string => `Bạn đã tìm thấy "${itemName}"!`;

export const TREASURE_CHEST_THANKS_MESSAGE = "Cảm ơn bạn đã mở rương! Chúc may mắn lần sau.";
export const TREASURE_CHEST_POINTS_MESSAGE = (points: number): string => `Bạn tìm thấy ${points} điểm trong rương!`;
export const TREASURE_CHEST_QUIZ_CORRECT_MESSAGE = (points: number): string => `Chính xác! Bạn nhận được ${points} điểm từ câu đố!`;
export const TREASURE_CHEST_QUIZ_INCORRECT_MESSAGE = "Rất tiếc, câu trả lời chưa đúng.";
export const CHOOSE_ISLAND_DIFFICULTY_TEXT = (islandName: string) => `Chọn độ khó cho đảo ${islandName}`;


// Endless Mode
export const ENDLESS_MODE_LIVES = 5;
export const ENDLESS_QUESTIONS_BATCH_SIZE = 5; // Number of questions per batch
export const ENDLESS_MODE_STARTING_DIFFICULTY = 4;
export const ENDLESS_MODE_MIN_DIFFICULTY = 1;
export const ENDLESS_MODE_MAX_DIFFICULTY = 10;
export const ENDLESS_MODE_STREAK_TO_CHANGE_DIFFICULTY = 3;
export const ENDLESS_MODE_GRADE_COMPLETE_MESSAGE = (grade: string) => `Chúc mừng! Bạn đã mở khóa Chế độ Vô tận cho ${grade}!`;
export const ENDLESS_MODE_SUMMARY_TITLE = "Kết Quả Chế Độ Vô Tận";
export const ENDLESS_MODE_SCORE_TEXT = "Điểm Vô Tận";
export const ENDLESS_MODE_QUESTIONS_ANSWERED_TEXT = "Số Câu Đã Trả Lời";
export const PLAY_AGAIN_ENDLESS_TEXT = "Chơi Lại Vô Tận";
export const ENDLESS_MODE_BUTTON_TEXT = "Thử Thách Vô Tận";
export const ENDLESS_MODE_UNLOCKED_MESSAGE = (gradeText: string): string => `Chế độ Vô Tận cho ${gradeText} đã mở! Hãy thử sức!`;
export const START_ENDLESS_MODE_TEXT = "Bắt Đầu Chế Độ Vô Tận";
export const ENDLESS_MODE_LOADING_TEXT = "Đang tải câu hỏi Vô Tận...";
export const ENDLESS_MODE_ERROR_TEXT = "Không thể tải câu hỏi cho Chế Độ Vô Tận.";
export const ENDLESS_MODE_TITLE_TEXT = (gradeText: string): string => `Chế Độ Vô Tận - ${gradeText}`;
export const ENDLESS_DIFFICULTY_LEVEL_TEXT_MAP: Record<number, string> = {
    1: "Tân Binh",
    2: "Dễ",
    3: "Bình Thường",
    4: "Thử Thách",
    5: "Nâng Cao",
    6: "Khó",
    7: "Chuyên Gia",
    8: "Bậc Thầy",
    9: "Siêu Việt",
    10: "Huyền Thoại",
};



// Final Island
export const FINAL_ISLAND_UNLOCK_MESSAGE = "Chúc mừng! Bạn đã mở khóa Đảo Thử Thách Tối Thượng!";
export const FINAL_ISLAND_ACCESS_BUTTON_TEXT = "Đến Thử Thách Tối Thượng";
export const FINAL_ISLAND_GRADE_TITLE = "Mê Cung Trí Tuệ Cổ Đại";
export const FINAL_ISLAND_INTRO_MESSAGE = "Chào mừng Nhà Vô Địch! Cánh cổng Mê Cung Trí Tuệ đã mở. Hãy giải mã các bí ẩn cổ xưa để khẳng định vị thế huyền thoại!";
export const FINAL_ISLAND_CONGRATS_MESSAGE = "Không Thể Tin Nổi! Bạn đã chinh phục Mê Cung Trí Tuệ và trở thành Huyền Thoại Đảo Kho Báu!";
export const FINAL_ISLAND_EPIC_DIFFICULTY_TEXT = "Thử Thách Sử Thi";
export const FINAL_ISLAND_INTRO_DURATION_MS = 3500; 
export const FINAL_ISLAND_PLAYING_STYLE_CLASS = "final-island-playing-card";
export const FINAL_ISLAND_LOADING_FIRST_CHALLENGE_TEXT = "Triệu hồi Thử Thách Đầu Tiên...";
export const FINAL_ISLAND_LOADING_NEXT_CHALLENGE_TEXT = "Thử Thách Tiếp Theo đang Hiện Hình...";


// --- Daily Challenge System ---
export const DAILY_CHALLENGE_MODAL_TITLE = "Thử Thách Hàng Ngày";
export const DAILY_CHALLENGE_BUTTON_TEXT = "Thử Thách";
export const DAILY_CHALLENGE_REWARD_TEXT = (gems: number) => `Phần thưởng: ${gems} Đá Quý`;
export const DAILY_CHALLENGE_COMPLETED_TEXT = "Đã hoàn thành!";
export const DAILY_CHALLENGE_CLAIM_REWARD_BUTTON_TEXT = "Nhận Thưởng";
export const DAILY_CHALLENGE_REWARD_CLAIMED_TEXT = "Đã nhận thưởng!";
export const DAILY_CHALLENGE_PROGRESS_TEXT = (current: number, target: number) => `${current}/${target}`;
export const DAILY_CHALLENGE_NEW_AVAILABLE_TEXT = "Thử thách mới đã có!";
export const DAILY_CHALLENGE_REFRESH_NOTICE_TEXT = (time: string) => `Làm mới sau: ${time}`;
export const DAILY_CHALLENGE_SUCCESS_TOAST_TEXT = (reward: number) => `Bạn hoàn thành Thử Thách Hàng Ngày và nhận ${reward} Đá Quý!`;
export const PLAYER_GEMS_TEXT = "Đá Quý";
export const DAILY_CHALLENGE_TAB_TEXT = "Hàng Ngày";


// --- Weekly Challenge System ---
export const WEEKLY_CHALLENGE_MODAL_TITLE = "Thử Thách Tuần"; 
export const WEEKLY_CHALLENGE_TAB_TEXT = "Hàng Tuần";
export const WEEKLY_CHALLENGE_REWARD_TEXT = (gems: number) => `Phần thưởng lớn: ${gems} Đá Quý!`;
export const WEEKLY_CHALLENGE_COMPLETED_TEXT = "Thử thách tuần hoàn thành!";
export const WEEKLY_CHALLENGE_CLAIM_REWARD_BUTTON_TEXT = "Nhận Thưởng Tuần";
export const WEEKLY_CHALLENGE_REWARD_CLAIMED_TEXT = "Đã nhận thưởng tuần!";
export const WEEKLY_CHALLENGE_NEW_AVAILABLE_TEXT = "Thử thách tuần mới đã có!";
export const WEEKLY_CHALLENGE_REFRESH_NOTICE_TEXT = (time: string) => `Làm mới sau: ${time}`;
export const WEEKLY_CHALLENGE_SUCCESS_TOAST_TEXT = (reward: number) => `Xuất sắc! Bạn hoàn thành Thử Thách Tuần và nhận ${reward} Đá Quý!`;


// Local Storage Keys
export const LOCAL_STORAGE_PREFIX = "treasureIslandMath_";
export const LAST_SELECTED_GRADE_KEY = `${LOCAL_STORAGE_PREFIX}lastSelectedGrade`;
export const ISLAND_PROGRESS_KEY_PREFIX = `${LOCAL_STORAGE_PREFIX}islandProgress_`;
export const OVERALL_SCORE_KEY_PREFIX = `${LOCAL_STORAGE_PREFIX}overallScore_`;
export const ISLAND_STAR_RATINGS_KEY_PREFIX = `${LOCAL_STORAGE_PREFIX}islandStarRatings_`;
export const SELECTED_THEME_KEY = `${LOCAL_STORAGE_PREFIX}selectedTheme`;
export const ACHIEVED_ACHIEVEMENTS_KEY = `${LOCAL_STORAGE_PREFIX}achievedAchievements`;
export const ALL_GRADES_STAR_RATINGS_KEY = `${LOCAL_STORAGE_PREFIX}allGradesStarRatings`;
export const ACTIVE_TREASURE_CHESTS_KEY = `${LOCAL_STORAGE_PREFIX}activeTreasureChests`;
export const ACTIVE_MESSAGE_BOTTLE_KEY = `${LOCAL_STORAGE_PREFIX}activeMessageBottle`;
export const ACTIVE_FRIENDLY_NPC_KEY = `${LOCAL_STORAGE_PREFIX}activeFriendlyNPC`;
export const ACTIVE_COLLECTIBLE_KEY = `${LOCAL_STORAGE_PREFIX}activeCollectible`;
export const COLLECTED_ITEMS_KEY = `${LOCAL_STORAGE_PREFIX}collectedItems`;
export const ENDLESS_UNLOCKED_KEY_PREFIX = `${LOCAL_STORAGE_PREFIX}endlessUnlocked_`;
export const FINAL_ISLAND_UNLOCKED_KEY = `${LOCAL_STORAGE_PREFIX}finalIslandUnlocked`;
export const ACTIVITY_LOG_KEY = `${LOCAL_STORAGE_PREFIX}studentActivityLog`;
export const PARENT_GOALS_KEY = `${LOCAL_STORAGE_PREFIX}parentGoals`;
export const STUDENT_ASSIGNMENTS_KEY = `${LOCAL_STORAGE_PREFIX}studentAssignments`;


// Daily Challenge Storage Keys
export const ACTIVE_DAILY_CHALLENGE_KEY = `${LOCAL_STORAGE_PREFIX}activeDailyChallenge`;
export const PLAYER_GEMS_KEY = `${LOCAL_STORAGE_PREFIX}playerGems`;
export const COMPLETED_DAILY_CHALLENGES_LOG_KEY = `${LOCAL_STORAGE_PREFIX}completedDailyChallengesLog`;

// Weekly Challenge Storage Keys
export const ACTIVE_WEEKLY_CHALLENGE_KEY = `${LOCAL_STORAGE_PREFIX}activeWeeklyChallenge`;
export const COMPLETED_WEEKLY_CHALLENGES_LOG_KEY = `${LOCAL_STORAGE_PREFIX}completedWeeklyChallengesLog`;

// Shop & Accessories Storage Keys
export const PLAYER_OWNED_ACCESSORIES_KEY = `${LOCAL_STORAGE_PREFIX}playerOwnedAccessories`;
export const PLAYER_ACTIVE_ACCESSORIES_KEY = `${LOCAL_STORAGE_PREFIX}playerActiveAccessories`;


// Default Theme
export const DEFAULT_THEME: Theme = Theme.FRUTIGER_AERO;

// Sound Effect URLs
export const HOVER_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/02/17/audio_988aaf064c.mp3?filename=click-21156.mp3";
export const GRADE_SELECT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/05/06/audio_f823c08739.mp3?filename=select-003-337609.mp3";
export const ISLAND_SELECT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/05/06/audio_f823c08739.mp3?filename=select-003-337609.mp3";
export const ANSWER_SELECT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/02/25/audio_07b0c21a3b.mp3?filename=button-305770.mp3";
export const CHECK_ANSWER_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/05/31/audio_be1e4daf3e.mp3?filename=impact-cinematic-boom-5-352465.mp3";
export const CORRECT_ANSWER_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/04/11/audio_3933ad0008.mp3?filename=level-up-5-326133.mp3";
export const INCORRECT_ANSWER_SOUND_URL = "https://cdn.pixabay.com/download/audio/2025/05/31/audio_e9d22d9131.mp3?filename=error-11-352286.mp3";
export const VICTORY_FANFARE_SOUND_URL = "https://cdn.pixabay.com/download/audio/2023/04/13/audio_c18d89e292.mp3?filename=brass-fanfare-with-timpani-and-winchimes-reverberated-146260.mp3";
export const BUTTON_CLICK_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/09/29/audio_a4b3f2fe44.mp3?filename=select-sound-121244.mp3";
export const FIREWORK_EXPLOSION_SOUND_1_URL = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_174242f3f4.mp3?filename=medium-explosion-40472.mp3";
export const FIREWORK_EXPLOSION_SOUND_2_URL = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c64e01b884.mp3?filename=firework_single-83058.mp3";
export const ACHIEVEMENT_UNLOCKED_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/09/11/audio_10037a8927.mp3?filename=collect-points-190037.mp3";
export const TREASURE_OPEN_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7dd45f4b50.mp3?filename=briefcase-open-2-83060.mp3";
export const TREASURE_SPARKLE_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/01/24/audio_383cd89e76.mp3?filename=magic-wand-2-100806.mp3";
export const BOTTLE_SPAWN_SOUND_URL = "https://cdn.pixabay.com/download/audio/2021/08/04/audio_ea98a96495.mp3?filename=water-splash-45791.mp3";
export const BOTTLE_OPEN_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7dd45f4b50.mp3?filename=briefcase-open-2-83060.mp3";
export const SHOOTING_STAR_APPEAR_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/11/20/audio_2c0451737e.mp3?filename=fast-woosh-124928.mp3";
export const SHOOTING_STAR_CLICK_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/07/audio_c35a82894a.mp3?filename=bell-notification-1-93212.mp3";
export const NPC_SPAWN_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_f53597373f.mp3?filename=message-ringtone-magic-2-83059.mp3";
export const NPC_INTERACTION_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c0e869766e.mp3?filename=notification-positive-bleep-82880.mp3";
export const NPC_RIDDLE_SUCCESS_SOUND_URL = CORRECT_ANSWER_SOUND_URL;
export const NPC_RIDDLE_FAIL_SOUND_URL = INCORRECT_ANSWER_SOUND_URL;
export const COLLECTIBLE_SPAWN_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c0e869766e.mp3?filename=notification-positive-bleep-82880.mp3";
export const COLLECTIBLE_COLLECT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/09/11/audio_10037a8927.mp3?filename=collect-points-190037.mp3";
export const ENDLESS_MODE_START_SOUND_URL = "https://cdn.pixabay.com/download/audio/2024/04/10/audio_606a246872.mp3?filename=energy-1-396956.mp3";
export const FINAL_ISLAND_UNLOCK_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/10/20/audio_1650b86a34.mp3?filename=secret-reveal-96570.mp3";
export const FINAL_ISLAND_AMBIENT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/02/01/audio_eb31908696.mp3?filename=mystery-logo-104652.mp3";

// Challenge Sounds
export const DAILY_CHALLENGE_NEW_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c0e869766e.mp3?filename=notification-positive-bleep-82880.mp3";
export const DAILY_CHALLENGE_PROGRESS_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/09/29/audio_a4b3f2fe44.mp3?filename=select-sound-121244.mp3";
export const DAILY_CHALLENGE_COMPLETE_SOUND_URL = ACHIEVEMENT_UNLOCKED_SOUND_URL;
export const GEM_COLLECT_SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/07/audio_c35a82894a.mp3?filename=bell-notification-1-93212.mp3";
export const WEEKLY_CHALLENGE_NEW_SOUND_URL = DAILY_CHALLENGE_NEW_SOUND_URL; 
export const WEEKLY_CHALLENGE_PROGRESS_SOUND_URL = DAILY_CHALLENGE_PROGRESS_SOUND_URL; 
export const WEEKLY_CHALLENGE_COMPLETE_SOUND_URL = VICTORY_FANFARE_SOUND_URL; 

// Placeholder sound URLs for custom sound packs
export const CUSTOM_SOUND_NEON_CLICK = '/sounds/neon_ui_click.mp3'; 
export const CUSTOM_SOUND_NEON_CORRECT = '/sounds/neon_ui_correct.mp3'; 
export const CUSTOM_SOUND_GIRLY_CLICK = '/sounds/girly_ui_click.mp3'; 
export const CUSTOM_SOUND_GIRLY_CORRECT = '/sounds/girly_ui_correct.mp3'; 


// Icon URLs & Emojis
export const ACHIEVEMENT_BUTTON_ICON_URL = "https://i.ibb.co/84xpddHn/icon-huy-hieu.png";
export const MESSAGE_IN_BOTTLE_ICON_EMOJI = "🍾";
export const SHOOTING_STAR_EMOJI = "🌠";
export const TREASURE_CHEST_ICON_EMOJI = "🎁";


// Game Mechanics Config
export const TREASURE_CHEST_SPAWN_CHANCE = 0.2;
export const MESSAGE_IN_BOTTLE_SPAWN_CHANCE = 0.1;
export const SHOOTING_STAR_SPAWN_INTERVAL_MIN_MS = 15000;
export const SHOOTING_STAR_SPAWN_INTERVAL_MAX_MS = 45000;
export const SHOOTING_STAR_ANIMATION_DURATION_MS = 5000;
export const SHOOTING_STAR_REWARD_POINTS_MIN = 5;
export const SHOOTING_STAR_REWARD_POINTS_MAX = 15;
export const SHOOTING_STAR_BASE_SIZE_PX = 32;
export const SHOOTING_STAR_MAX_ACTIVE_MS = 8000;
export const FRIENDLY_NPC_SPAWN_CHANCE = 0.15;
export const COLLECTIBLE_SPAWN_CHANCE = 0.08;

// Treasure Chest Rewards
export const TREASURE_REWARD_POINTS_MIN = 10;
export const TREASURE_REWARD_POINTS_MAX = 30;
export const TREASURE_QUIZ_REWARD_POINTS_MIN = 15;
export const TREASURE_QUIZ_REWARD_POINTS_MAX = 25;


// Final Treasure Island ID
export const FINAL_TREASURE_ISLAND_ID = "gFinal_ultimate_wisdom";

// Daily Challenge Definitions
import { CHALLENGE_ACTION_ISLAND_COMPLETED, CHALLENGE_ACTION_STAR_EARNED, CHALLENGE_ACTION_CORRECT_ANSWER, CHALLENGE_ACTION_TREASURE_CHEST_OPENED, CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED, CHALLENGE_ACTION_NPC_INTERACTED, CHALLENGE_ACTION_DAILY_CHALLENGE_REWARD_CLAIMED, CHALLENGE_ACTION_ACHIEVEMENT_UNLOCKED_INGAME } from './types';

export const DAILY_CHALLENGE_DEFINITIONS: DailyChallengeDefinition[] = [
  {
    id: "complete_islands",
    type: DailyChallengeType.COMPLETE_ISLANDS,
    descriptionTemplate: (target) => `Hoàn thành ${target} hòn đảo bất kỳ.`,
    generateTargetValue: () => Math.random() < 0.6 ? 1 : 2, 
    rewardGems: 30,
    actionTypeToTrack: CHALLENGE_ACTION_ISLAND_COMPLETED,
  },
  {
    id: "earn_stars",
    type: DailyChallengeType.EARN_STARS,
    descriptionTemplate: (target) => `Kiếm được tổng cộng ${target} ngôi sao từ việc hoàn thành đảo.`,
    generateTargetValue: () => Math.floor(Math.random() * 6) + 5, 
    rewardGems: 40,
    actionTypeToTrack: CHALLENGE_ACTION_STAR_EARNED,
  },
  {
    id: "correct_answers_streak",
    type: DailyChallengeType.CORRECT_ANSWERS_IN_A_ROW,
    descriptionTemplate: (target) => `Trả lời đúng ${target} câu hỏi liên tiếp trong một lượt chơi đảo.`,
    generateTargetValue: () => Math.floor(Math.random() * 3) + 3, 
    rewardGems: 50,
    actionTypeToTrack: CHALLENGE_ACTION_CORRECT_ANSWER,
    streakChallenge: true,
  },
  {
    id: "open_treasure_chests",
    type: DailyChallengeType.OPEN_TREASURE_CHESTS,
    descriptionTemplate: (target) => `Mở ${target} rương báu.`,
    generateTargetValue: () => 1,
    rewardGems: 25,
    actionTypeToTrack: CHALLENGE_ACTION_TREASURE_CHEST_OPENED,
  },
  {
    id: "collect_shooting_stars",
    type: DailyChallengeType.COLLECT_SHOOTING_STARS,
    descriptionTemplate: (target) => `Thu thập ${target} ngôi sao may mắn.`,
    generateTargetValue: () => Math.floor(Math.random() * 2) + 1, 
    rewardGems: 20,
    actionTypeToTrack: CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED,
  },
  {
    id: "interact_with_npcs",
    type: DailyChallengeType.INTERACT_WITH_NPCS,
    descriptionTemplate: (target) => `Tương tác với ${target} nhân vật thân thiện trên đảo.`,
    generateTargetValue: () => 1,
    rewardGems: 15,
    actionTypeToTrack: CHALLENGE_ACTION_NPC_INTERACTED,
  }
];

// Weekly Challenge Definitions
export const WEEKLY_CHALLENGE_DEFINITIONS: WeeklyChallengeDefinition[] = [
  {
    id: "wc_complete_islands_any_difficulty",
    type: WeeklyChallengeType.WC_COMPLETE_ISLANDS_ANY_DIFFICULTY,
    descriptionTemplate: (target) => `Hoàn thành ${target} hòn đảo bất kỳ trong tuần.`,
    generateTargetValue: () => Math.floor(Math.random() * 4) + 7, // 7 to 10 islands
    rewardGems: 150,
    actionTypeToTrack: CHALLENGE_ACTION_ISLAND_COMPLETED,
  },
  {
    id: "wc_earn_total_stars",
    type: WeeklyChallengeType.WC_EARN_TOTAL_STARS,
    descriptionTemplate: (target) => `Kiếm được tổng cộng ${target} ngôi sao trong tuần.`,
    generateTargetValue: () => Math.floor(Math.random() * 21) + 30, // 30 to 50 stars
    rewardGems: 200,
    actionTypeToTrack: CHALLENGE_ACTION_STAR_EARNED,
  },
  {
    id: "wc_complete_daily_challenges",
    type: WeeklyChallengeType.WC_COMPLETE_DAILY_CHALLENGES,
    descriptionTemplate: (target) => `Hoàn thành và nhận thưởng ${target} thử thách hàng ngày trong tuần.`,
    generateTargetValue: () => Math.floor(Math.random() * 2) + 4, // 4 to 5 daily challenges
    rewardGems: 250,
    actionTypeToTrack: CHALLENGE_ACTION_DAILY_CHALLENGE_REWARD_CLAIMED,
  },
  {
    id: "wc_unlock_achievements",
    type: WeeklyChallengeType.WC_UNLOCK_ACHIEVEMENTS,
    descriptionTemplate: (target) => `Mở khóa ${target} huy hiệu mới trong tuần.`,
    generateTargetValue: () => Math.floor(Math.random() * 2) + 2, // 2 to 3 new achievements
    rewardGems: 180,
    actionTypeToTrack: CHALLENGE_ACTION_ACHIEVEMENT_UNLOCKED_INGAME,
  },
  {
    id: "wc_total_correct_answers",
    type: WeeklyChallengeType.WC_TOTAL_CORRECT_ANSWERS,
    descriptionTemplate: (target) => `Trả lời đúng tổng cộng ${target} câu hỏi trong tuần.`,
    generateTargetValue: () => Math.floor(Math.random() * 26) + 50, // 50 to 75 correct answers
    rewardGems: 120,
    actionTypeToTrack: CHALLENGE_ACTION_CORRECT_ANSWER, 
  }
];


// Island Configurations
export const ISLAND_CONFIGS: IslandConfig[] = [
  // --- GRADE 1 (Updated Curriculum) ---
  { islandId: "g1_island_01_counting_1_100", islandNumber: 1, name: "Đảo Số Đếm (1-100)", description: "Làm quen, đọc, viết và so sánh các số trong phạm vi 100.", topics: ["đọc, viết, so sánh số trong phạm vi 100", "cấu tạo số (chục, đơn vị)", "tia số"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "1️⃣" },
  { islandId: "g1_island_02_addition_subtraction_20_no_carry", islandNumber: 2, name: "Vịnh Cộng Trừ Không Nhớ (P.vi 20)", description: "Thực hiện phép cộng, trừ không nhớ trong phạm vi 20.", topics: ["cộng trừ không nhớ phạm vi 20", "tìm số hạng, số bị trừ, số trừ"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "➕" },
  { islandId: "g1_island_03_geometry_points_lines", islandNumber: 3, name: "Làng Hình Học Cơ Bản", description: "Nhận biết điểm, đoạn thẳng và các hình học, hình khối quen thuộc.", topics: ["điểm, đoạn thẳng", "hình vuông, tròn, tam giác, chữ nhật", "hình khối lập phương, hộp chữ nhật"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "📐" },
  { islandId: "g1_island_04_addition_subtraction_100_carry", islandNumber: 4, name: "Rặng San Hô Cộng Trừ Có Nhớ", description: "Thử thách với các phép cộng và trừ có nhớ trong phạm vi 100.", topics: ["phép cộng có nhớ trong phạm vi 100", "phép trừ có nhớ trong phạm vi 100"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "🐠" },
  { islandId: "g1_island_05_time_clock", islandNumber: 5, name: "Đồng Hồ Thời Gian", description: "Học cách xem giờ đúng và tìm hiểu về lịch tuần.", topics: ["xem giờ đúng trên đồng hồ", "các ngày trong tuần, lịch tuần"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "🗓️" },
  { islandId: "g1_island_06_measurement_cm", islandNumber: 6, name: "Thung Lũng Đo Độ Dài (cm)", description: "Sử dụng thước kẻ để đo và ước lượng độ dài bằng xăng-ti-mét.", topics: ["đo và ước lượng độ dài bằng xăng-ti-mét (cm)"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "📏" },
  { islandId: "g1_island_07_problem_solving_1step", islandNumber: 7, name: "Hang Toán Đố (1 bước)", description: "Giải các bài toán có lời văn sử dụng một phép tính cộng hoặc trừ.", topics: ["giải bài toán có lời văn một bước tính (thêm/bớt)"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "💡" },
  { islandId: "g1_island_08_patterns_simple", islandNumber: 8, name: "Suối Quy Luật Kỳ Diệu", description: "Tìm và hoàn thành các dãy hình, dãy số có quy luật đơn giản.", topics: ["nhận dạng quy luật của dãy hình, dãy số đơn giản"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "🎨" },
  { islandId: "g1_island_09_vietnamese_dong", islandNumber: 9, name: "Chợ Tiền Tệ Việt Nam", description: "Nhận biết và sử dụng các mệnh giá tiền Việt Nam (loại tiền giấy nhỏ).", topics: ["nhận biết các mệnh giá tiền Việt Nam (tiền giấy)"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "💰" },
  { islandId: "g1_island_10_review_grade1", islandNumber: 10, name: "Đỉnh Tri Thức Lớp 1", description: "Ôn tập toàn bộ kiến thức quan trọng của chương trình lớp 1.", topics: ["ôn tập số đến 100", "cộng trừ trong phạm vi 100", "hình học và đo lường cơ bản"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "🌟" },

  // --- GRADE 2 (Updated Curriculum) ---
  { islandId: "g2_island_01_counting_1_1000", islandNumber: 1, name: "Thảo Nguyên Ngàn Số", description: "Khám phá các số có ba chữ số, so sánh và sắp xếp chúng.", topics: ["số có ba chữ số", "so sánh, sắp xếp số phạm vi 1000"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "💯" },
  { islandId: "g2_island_02_addition_subtraction_1000", islandNumber: 2, name: "Biển Cộng Trừ (P.vi 1000)", description: "Thực hiện các phép cộng, trừ có nhớ và không nhớ trong phạm vi 1000.", topics: ["cộng trừ (có nhớ và không nhớ) trong phạm vi 1000"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🌊" },
  { islandId: "g2_island_03_multiplication_tables_2_5", islandNumber: 3, name: "Núi Bảng Nhân (2-5)", description: "Làm chủ các bảng nhân 2, 3, 4, 5 và khái niệm thừa số, tích.", topics: ["bảng nhân 2, 3, 4, 5", "thừa số, tích"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🏔️" },
  { islandId: "g2_island_04_division_tables_2_5", islandNumber: 4, name: "Rừng Bảng Chia (2-5)", description: "Chinh phục các bảng chia 2, 3, 4, 5 và các thành phần của phép chia.", topics: ["bảng chia 2, 3, 4, 5", "số bị chia, số chia, thương"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🌳" },
  { islandId: "g2_island_05_time_minutes_calendar", islandNumber: 5, name: "Tháp Đồng Hồ và Lịch", description: "Xem giờ chính xác đến từng phút và đọc lịch theo ngày, tháng.", topics: ["xem giờ đến từng phút", "xem lịch (ngày, tháng)"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "⏰" },
  { islandId: "g2_island_06_measurement_length_dm_m_km", islandNumber: 6, name: "Sông Đo Độ Dài (dm, m, km)", description: "Học về đề-xi-mét, mét, ki-lô-mét và cách đổi đơn vị.", topics: ["đề-xi-mét, mét, ki-lô-mét", "đổi đơn vị đo độ dài"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🏞️" },
  { islandId: "g2_island_07_geometry_perimeter", islandNumber: 7, name: "Xưởng Hình Học Chu Vi", description: "Tính toán chu vi của các hình tam giác và hình tứ giác.", topics: ["chu vi hình tam giác", "chu vi hình tứ giác"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🧊" },
  { islandId: "g2_island_08_problem_solving_multi_div", islandNumber: 8, name: "Vực Thẳm Toán Đố Nhân Chia", description: "Giải các bài toán văn liên quan đến nhiều hơn, ít hơn, gấp, giảm.", topics: ["giải bài toán có lời văn (nhiều hơn, ít hơn, gấp lên, giảm đi)"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🧩" },
  { islandId: "g2_island_09_measurement_kg_l", islandNumber: 9, name: "Đầm Lầy Cân Nặng và Dung Tích", description: "Làm quen với các đơn vị đo khối lượng và dung tích: ki-lô-gam, lít.", topics: ["ki-lô-gam", "lít"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🌿" },
  { islandId: "g2_island_10_review_grade2", islandNumber: 10, name: "Ngọn Hải Đăng Lớp 2", description: "Tổng ôn tập kiến thức lớp 2 về số học, đo lường và hình học.", topics: ["ôn tập số đến 1000", "bốn phép tính cơ bản", "đo lường", "hình học"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🌟" },

  // --- GRADE 3 (Updated Curriculum) ---
  { islandId: "g3_island_01_counting_100000", islandNumber: 1, name: "Sa Mạc Trăm Nghìn", description: "Khám phá các số trong phạm vi 100,000, so sánh và làm tròn số.", topics: ["số đến 100,000", "so sánh, làm tròn số"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🏜️" },
  { islandId: "g3_island_02_add_sub_100000", islandNumber: 2, name: "Hẻm Núi Cộng Trừ (P.vi 100,000)", description: "Thực hiện phép cộng và trừ các số trong phạm vi 100,000.", topics: ["cộng trừ các số trong phạm vi 100,000"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "⛰️" },
  { islandId: "g3_island_03_multiplication_division_advanced", islandNumber: 3, name: "Thác Nước Nhân Chia Nâng Cao", description: "Nhân và chia số có nhiều chữ số với/cho số có một chữ số.", topics: ["nhân số có nhiều chữ số với số có một chữ số", "chia số có nhiều chữ số cho số có một chữ số"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🌊" },
  { islandId: "g3_island_04_fractions_compare", islandNumber: 4, name: "Vườn Phân Số Diệu Kỳ", description: "Bắt đầu làm quen với phân số và so sánh các phân số cùng mẫu số.", topics: ["làm quen phân số", "so sánh phân số cùng mẫu số"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🍓" },
  { islandId: "g3_island_05_time_seconds_months", islandNumber: 5, name: "Đồng Hồ Tinh Xảo (giây, tháng)", description: "Tìm hiểu về giây, các tháng trong năm và giải các bài toán thời gian.", topics: ["giây, các tháng trong năm", "bài toán về thời gian"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🕰️" },
  { islandId: "g3_island_06_measurement_units", islandNumber: 6, name: "Cân Đo Đơn Vị", description: "Học cách chuyển đổi các đơn vị đo khối lượng (tấn, tạ, yến) và độ dài.", topics: ["đổi các đơn vị đo khối lượng (tấn, tạ, yến)", "đổi đơn vị đo độ dài"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "⚖️" },
  { islandId: "g3_island_07_geometry_area_perimeter_complex", islandNumber: 7, name: "Cánh Đồng Diện Tích & Chu Vi", description: "Tính diện tích hình chữ nhật, hình vuông và giải các bài toán phức tạp hơn.", topics: ["diện tích hình chữ nhật, hình vuông", "bài toán liên quan chu vi, diện tích"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🌾" },
  { islandId: "g3_island_08_problem_solving_money", islandNumber: 8, name: "Mê Cung Toán Đố Tiền Tệ", description: "Giải các bài toán thực tế liên quan đến tiền Việt Nam.", topics: ["bài toán liên quan đến tiền Việt Nam (mua bán, trả lại tiền)"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🌀" },
  { islandId: "g3_island_09_geometry_angles", islandNumber: 9, name: "Thung Lũng Góc Vuông", description: "Nhận biết góc vuông, góc không vuông và sử dụng ê-ke.", topics: ["góc vuông, góc không vuông", "sử dụng ê-ke"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "📐" },
  { islandId: "g3_island_10_review_grade3", islandNumber: 10, name: "Cung Điện Tri Thức Lớp 3", description: "Tổng hợp kiến thức lớp 3, tập trung vào số học và diện tích.", topics: ["ôn tập số đến 100,000", "bốn phép tính nâng cao", "diện tích", "phân số"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🌟" },

  // --- GRADE 4 (Updated Curriculum) ---
  { islandId: "g4_island_01_natural_numbers_millions", islandNumber: 1, name: "Thiên Hà Số Tự Nhiên (Lớp Triệu)", description: "Tìm hiểu về số tự nhiên, các lớp số lớn và tính chất của phép tính.", topics: ["số tự nhiên, dãy số tự nhiên", "số đến lớp triệu, lớp tỉ", "tính chất của phép cộng và phép nhân"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🌌" },
  { islandId: "g4_island_02_multiplication_division_multi_digit", islandNumber: 2, name: "Đại Dương Nhân Chia Số Lớn", description: "Thực hiện phép nhân và chia với các số có nhiều chữ số.", topics: ["nhân với số có nhiều chữ số", "chia cho số có hai, ba chữ số"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🐳" },
  { islandId: "g4_island_03_fractions_all_operations", islandNumber: 3, name: "Quần Đảo Phép Tính Phân Số", description: "Làm chủ 4 phép tính với phân số và làm quen hỗn số.", topics: ["quy đồng mẫu số", "cộng, trừ, nhân, chia phân số", "hỗn số"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🏝️" },
  { islandId: "g4_island_04_ratios", islandNumber: 4, name: "Hồ Tỷ Số Huyền Bí", description: "Tìm hiểu về tỷ số và giải các bài toán dạng tổng-tỷ, hiệu-tỷ.", topics: ["khái niệm tỷ số", "bài toán tìm hai số khi biết tổng và tỷ số", "bài toán tìm hai số khi biết hiệu và tỷ số"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "💧" },
  { islandId: "g4_island_05_geometry_parallel_perpendicular", islandNumber: 5, name: "Thung Lũng Song Song Vuông Góc", description: "Nhận biết và vẽ hai đường thẳng song song, vuông góc.", topics: ["hai đường thẳng song song, vuông góc", "vẽ hình"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🏛️" },
  { islandId: "g4_island_06_measurement_area_advanced", islandNumber: 6, name: "Suối Nguồn Đo Lường (diện tích)", description: "Mở rộng bảng đơn vị đo khối lượng và diện tích.", topics: ["yến, tạ, tấn", "giây, thế kỷ", "đề-ca-mét vuông, héc-tô-mét vuông, mi-li-mét vuông"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🧪" },
  { islandId: "g4_island_07_problem_solving_average_charts", islandNumber: 7, name: "Đồi Trung Bình Cộng và Biểu Đồ", description: "Tính số trung bình cộng và đọc các loại biểu đồ.", topics: ["tìm số trung bình cộng", "biểu đồ cột, biểu đồ đường"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🧠" },
  { islandId: "g4_island_08_geometry_area_parallelogram", islandNumber: 8, name: "Vách Đá Hình Bình Hành", description: "Học cách tính diện tích của hình bình hành và hình thoi.", topics: ["diện tích hình bình hành", "diện tích hình thoi"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "📐" },
  { islandId: "g4_island_09_expressions_with_variables", islandNumber: 9, name: "Thung lũng Biểu thức chứa chữ", description: "Làm quen với biểu thức chứa chữ và tính giá trị của chúng.", topics: ["biểu thức chứa một, hai, ba chữ", "tính giá trị của biểu thức"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "📝" },
  { islandId: "g4_island_10_review_grade4", islandNumber: 10, name: "Kim Tự Tháp Lớp 4", description: "Tổng ôn tập kiến thức lớp 4, đặc biệt là phân số và các bài toán tỷ số.", topics: ["ôn tập số tự nhiên", "bốn phép tính với phân số", "bài toán tỷ số", "hình học và diện tích"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🌟" },

  // --- GRADE 5 (Updated Curriculum) ---
  { islandId: "g5_island_01_decimals_concepts_operations", islandNumber: 1, name: "Vương Quốc Số Thập Phân", description: "Làm chủ khái niệm và 4 phép tính cơ bản với số thập phân.", topics: ["khái niệm số thập phân", "so sánh, cộng, trừ, nhân, chia số thập phân"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "👑" },
  { islandId: "g5_island_02_percentages_applications", islandNumber: 2, name: "Thị Trấn Tỷ Số Phần Trăm", description: "Hiểu và giải quyết các bài toán về tỷ số phần trăm trong thực tế.", topics: ["tỷ số phần trăm", "giải toán về tỷ số phần trăm (tìm giá trị, tìm tỷ số, tìm một số)"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "📈" },
  { islandId: "g5_island_03_geometry_area_triangle_trapezoid", islandNumber: 3, name: "Công Viên Hình Học Phẳng", description: "Tính diện tích hình tam giác, hình thang và chu vi, diện tích hình tròn.", topics: ["diện tích hình tam giác", "diện tích hình thang", "chu vi và diện tích hình tròn"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "⭕" },
  { islandId: "g5_island_04_motion_problems_uniform", islandNumber: 4, name: "Đường Đua Chuyển Động Đều", description: "Giải các bài toán về chuyển động đều, cùng chiều và ngược chiều.", topics: ["vận tốc, quãng đường, thời gian", "bài toán chuyển động cùng chiều, ngược chiều"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🏎️" },
  { islandId: "g5_island_05_geometry_volume", islandNumber: 5, name: "Kho Tàng Hình Khối Không Gian", description: "Tính thể tích hình hộp chữ nhật, hình lập phương và các đơn vị đo thể tích.", topics: ["thể tích hình hộp chữ nhật", "thể tích hình lập phương", "xăng-ti-mét khối, đề-xi-mét khối, mét khối"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "📦" },
  { islandId: "g5_island_06_measurement_time_conversion", islandNumber: 6, name: "Đài thiên văn Thời gian", description: "Thực hành các phép tính với số đo thời gian và chuyển đổi đơn vị.", topics: ["bảng đơn vị đo thời gian", "cộng, trừ, nhân, chia số đo thời gian"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🕰️" },
  { islandId: "g5_island_07_measurement_area_volume_conversion", islandNumber: 7, name: "Xưởng Chuyển đổi Đơn vị", description: "Luyện tập chuyển đổi các đơn vị đo diện tích và thể tích.", topics: ["bảng đơn vị đo diện tích", "héc-ta", "chuyển đổi các đơn vị đo lường"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🏗️" },
  { islandId: "g5_island_08_number_sequences", islandNumber: 8, name: "Hang động Dãy số", description: "Tìm quy luật của các dãy số và tính tổng các dãy số cách đều.", topics: ["tìm quy luật của dãy số", "tính tổng dãy số cách đều"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🔍" },
  { islandId: "g5_island_09_logic_puzzles", islandNumber: 9, name: "Mê cung Toán suy luận", description: "Thử thách tư duy với các bài toán logic như trồng cây, bài toán tuổi.", topics: ["bài toán suy luận logic", "bài toán trồng cây", "bài toán tuổi"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🧠" },
  { islandId: "g5_island_10_review_grade5", islandNumber: 10, name: "Đài Thiên Văn Lớp 5", description: "Tổng ôn tập toàn bộ kiến thức lớp 5, chuẩn bị cho cấp học tiếp theo.", topics: ["ôn tập số thập phân, tỷ số phần trăm", "hình học và thể tích", "toán chuyển động đều", "số đo thời gian"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🌟" },
  
  // --- FINAL GRADE CHALLENGES ---
  {
    islandId: "gFinal_1_numbers",
    islandNumber: 1,
    name: "Hầm Mộ Số Học Sơ Khai",
    description: "Những thử thách khó nhất về số đếm, so sánh và các phép tính cơ bản của Lớp 1.",
    topics: ["toán đố logic phạm vi 20", "quy luật số phức tạp", "so sánh và sắp xếp sáng tạo", "khái niệm về nhóm và phần tử"],
    targetGradeLevel: GradeLevel.FINAL,
    mapIcon: "💀"
  },
  {
    islandId: "gFinal_2_operations",
    islandNumber: 2,
    name: "Đài Thiên Văn Phép Tính",
    description: "Thử thách đỉnh cao về cộng trừ có nhớ, nhân chia và cấu tạo số của Lớp 2.",
    topics: ["bài toán nhiều bước kết hợp cộng trừ nhân chia", "cấu tạo số nâng cao (trăm, chục, đơn vị)", "chu vi và hình khối logic", "ước lượng và làm tròn thông minh"],
    targetGradeLevel: GradeLevel.FINAL,
    mapIcon: "🔭"
  },
  {
    islandId: "gFinal_3_fractions",
    islandNumber: 3,
    name: "Vực Thẳm Phân Số Vĩnh Cửu",
    description: "Những câu đố hóc búa nhất về phân số, số lớn và đo lường của Lớp 3.",
    topics: ["bài toán phân số phức tạp", "diện tích và các hình ghép", "logic về thời gian và trọng lượng", "nhân chia số lớn có dư"],
    targetGradeLevel: GradeLevel.FINAL,
    mapIcon: "♾️"
  },
  {
    islandId: "gFinal_4_geometry",
    islandNumber: 4,
    name: "Mê Cung Góc Cạnh Vô Tận",
    description: "Thử thách không gian và logic về hình học, số thập phân của Lớp 4.",
    topics: ["logic góc và đường thẳng song song/vuông góc", "bài toán trung bình cộng nâng cao", "suy luận từ biểu đồ", "số thập phân trong các tình huống lạ"],
    targetGradeLevel: GradeLevel.FINAL,
    mapIcon: "🌀"
  },
  {
    islandId: "gFinal_5_logic",
    islandNumber: 5,
    name: "Tháp Cao Tư Duy Chuyển Động",
    description: "Những bài toán tổng hợp khó nhất về tỉ lệ, chuyển động và phần trăm của Lớp 5.",
    topics: ["toán chuyển động phức tạp (ngược chiều, cùng chiều)", "bài toán phần trăm và lãi suất lắt léo", "thể tích hình khối phức hợp", "tìm x trong các biểu thức nâng cao"],
    targetGradeLevel: GradeLevel.FINAL,
    mapIcon: "🗼"
  },
  {
    islandId: "gFinal_ultimate_wisdom",
    islandNumber: 6, // Hidden Island
    name: "Thánh Địa Trí Tuệ Tối Thượng",
    description: "Nơi chỉ huyền thoại mới có thể chinh phục. Tổng hợp những câu đố logic khó nhất từ mọi cấp độ.",
    topics: [
      "Câu đố logic kinh điển cấp độ khó",
      "Mật mã và suy luận ký tự",
      "Tư duy không gian và hình học phi truyền thống",
      "Bài toán thực tế yêu cầu phân tích đa chiều",
      "Kết hợp kiến thức từ lớp 1 đến lớp 5"
    ],
    targetGradeLevel: GradeLevel.FINAL,
    mapIcon: "💎"
  }
];

// Fun Quizzes for Treasure Chests
export const FUN_QUIZZES: FunQuiz[] = [
  { id: "fq1", question: "Con gì buổi sáng đi bằng 4 chân, buổi trưa đi bằng 2 chân, buổi tối đi bằng 3 chân?", answer: "Con người", points: 20, type: 'fill' },
  { id: "fq2", question: "Cái gì luôn ở phía trước bạn nhưng bạn không bao giờ nhìn thấy?", answer: "Tương lai", points: 15, type: 'fill' },
  { id: "fq3", question: "Trong một cuộc đua, nếu bạn vượt qua người thứ hai, bạn đang ở vị trí thứ mấy?", options: ["Thứ nhất", "Thứ hai", "Thứ ba", "Thứ tư"], answer: "Thứ hai", points: 18, type: 'mc' },
  { id: "fq4", question: "Có một rổ táo, trong rổ có 5 quả. Làm sao để chia cho 5 bạn, mỗi bạn 1 quả mà trong rổ vẫn còn 1 quả?", answer: "Đưa cho 4 bạn mỗi bạn 1 quả, bạn cuối cùng nhận cả rổ táo", points: 22, type: 'fill' },
  { id: "fq5", question: "Cái gì càng lớn càng bé?", answer: "Cua", points: 16, type: 'fill' },
  { id: "fq6", question: "Cái gì có thể đi khắp thế giới mà vẫn ở nguyên một chỗ?", options: ["Con tem", "Cái bóng", "Suy nghĩ", "Giấc mơ"], answer: "Con tem", points: 19, type: 'mc' },
];

// Messages in a Bottle
export const MESSAGES_IN_BOTTLE: MessageInBottleContent[] = [
  { id: "mib1", text: "Ước gì mình có một cây kem thật to!", type: "wish" },
  { id: "mib2", text: "Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc. - Ngạn ngữ Gruzia", type: "quote" },
  { id: "mib3", text: "Đôi khi, câu trả lời khó nhất lại nằm ở ngay trước mắt.", type: "hint" },
  { id: "mib4", text: "Một ngày nào đó tôi sẽ khám phá hết các hòn đảo!", type: "wish" },
  { id: "mib5", text: "Sự khác biệt giữa bình thường và phi thường chỉ là một chút 'thêm'. - Jimmy Johnson", type: "quote" },
  { id: "mib6", text: "Đừng ngại thử thách, chúng giúp bạn mạnh mẽ hơn.", type: "hint" },
];

// Friendly NPCs
export const FRIENDLY_NPCS: FriendlyNPC[] = [
  { id: "npc_parrot", name: "Vẹt Thông Thái Kiki", imageUrl: "https://i.ibb.co/YPGvL2d/npc-parrot-kiki.png" },
  { id: "npc_monkey", name: "Khỉ Lém Lỉnh Miko", imageUrl: "https://i.ibb.co/7bgGjWb/npc-monkey-miko.png" },
  { id: "npc_turtle", name: "Rùa Già Hiền Triết Toto", imageUrl: "https://i.ibb.co/KscvTj1/npc-turtle-toto.png" },
  { id: "npc_crab", name: "Cua Càng To Rocky", imageUrl: "https://i.ibb.co/1njC5P1/npc-crab-rocky.png" },
];

// NPC Interactions
export const NPC_INTERACTIONS: NPCInteraction[] = [
  { id: "int_fact1", npcIds: ["npc_turtle"], type: "fact", text: "Đảo Kho Báu này đã tồn tại hàng ngàn năm rồi đấy, cậu bé ạ!", points: 5 },
  { id: "int_enc1", npcIds: ["npc_parrot"], type: "encouragement", text: "Cứ tiếp tục cố gắng, kho báu tri thức đang chờ bạn phía trước!", points: 3 },
  { id: "int_riddle1", npcIds: ["npc_monkey"], type: "riddle", text: "Tôi có thành phố nhưng không có nhà, có rừng nhưng không có cây, có nước nhưng không có cá. Tôi là gì?", answer: "Bản đồ", points: 25 },
  { id: "int_fact2", npcIds: ["npc_crab"], type: "fact", text: "Nghe nói có những viên đá quý ẩn giấu trên đảo này, chúng giúp người sở hữu thông minh hơn!", points: 5 },
  { id: "int_enc2", npcIds: ["npc_turtle"], type: "encouragement", text: "Mỗi câu hỏi bạn giải được là một bước tiến gần hơn đến kho báu vĩ đại.", points: 3 },
  { id: "int_riddle2", npcIds: ["npc_parrot"], type: "riddle", text: "Cái gì có nhiều chìa khóa nhưng không mở được ổ khóa nào?", answer: "Đàn piano", points: 20 },
];

// Collectible Items
export const COLLECTIBLE_ITEMS: CollectibleItem[] = [
  { id: "col_seashell", name: "Vỏ Sò Ánh Kim", icon: "🐚", description: "Một vỏ sò hiếm có, phát ra ánh sáng lung linh kỳ ảo." },
  { id: "col_starfish", name: "Sao Biển Cầu Vồng", icon: "⭐", description: "Loài sao biển này có thể đổi màu theo tâm trạng của người tìm thấy nó." },
  { id: "col_map_fragment", name: "Mảnh Bản Đồ Cổ", icon: "📜", description: "Một mảnh của tấm bản đồ dẫn đến kho báu huyền thoại, đã bị xé rách." },
  { id: "col_pirate_coin", name: "Đồng Xu Hải Tặc", icon: "🪙", description: "Một đồng xu cổ xưa, có lẽ thuộc về một thuyền trưởng hải tặc lừng danh." },
  { id: "col_crystal_shard", name: "Mảnh Pha Lê Năng Lượng", icon: "🔮", description: "Chứa đựng năng lượng bí ẩn, có thể là chìa khóa cho một bí mật nào đó." },
];

// Shop Accessories
export const SHOP_ACCESSORIES: ThemeAccessory[] = [
  {
    id: "neon_star_background",
    name: "Nền Sao Neon",
    description: "Thêm hiệu ứng các ngôi sao neon lấp lánh bay lượn trên nền.",
    iconUrl: "https://i.ibb.co/KqrBChz/icon-neon-stars.png",
    price: 100,
    appliesToTheme: [Theme.NEON],
    type: AccessoryType.BACKGROUND_EFFECT,
    config: {
      particleShape: 'star',
      particleColor: ['#00f5d4', '#fa2772', '#7DF9FF', '#AD00FF'],
      count: 50,
      speed: 0.5,
      size: 2,
      sizeVariation: 1,
      opacity: 0.7
    } as BackgroundEffectConfig,
  },
  {
    id: "girly_heart_cursor",
    name: "Con Trỏ Tim Bay Bổng",
    description: "Con trỏ chuột của bạn sẽ để lại một vệt hình trái tim hồng đáng yêu.",
    iconUrl: "https://i.ibb.co/WpYhVzC/icon-girly-cursor.png",
    price: 80,
    appliesToTheme: [Theme.GIRLY],
    type: AccessoryType.CURSOR_TRAIL,
    config: {
      trailColor: ['#f472b6', '#ec4899', '#fda4af'],
      trailLength: 15,
      fadeSpeed: 0.05,
      particleSize: 8,
      shape: 'star', // Using 'star' for hearts as an example, actual heart shape may need custom draw logic
    } as CursorTrailConfig,
  },
  {
    id: "frutiger_bubble_background",
    name: "Nền Bong Bóng Frutiger",
    description: "Hiệu ứng bong bóng nhẹ nhàng trôi nổi, tạo cảm giác tươi mới và trong trẻo.",
    iconUrl: "https://i.ibb.co/PZfPSTC/icon-frutiger-bubbles.png",
    price: 90,
    appliesToTheme: [Theme.FRUTIGER_AERO, Theme.DEFAULT],
    type: AccessoryType.BACKGROUND_EFFECT,
    config: {
      particleShape: 'circle',
      particleColor: ['rgba(34,211,238,0.5)', 'rgba(103,232,249,0.4)', 'rgba(165,243,252,0.6)'],
      count: 30,
      speed: 0.3,
      size: 15,
      sizeVariation: 8,
      opacity: 0.6
    } as BackgroundEffectConfig,
  },
  {
    id: "neon_button_glow",
    name: "Viền Nút Neon Rực Sáng",
    description: "Các nút bấm chính sẽ có thêm hiệu ứng viền neon phát sáng nổi bật.",
    iconUrl: "https://i.ibb.co/mJ3X3kL/icon-neon-button-glow.png",
    price: 120,
    appliesToTheme: [Theme.NEON],
    type: AccessoryType.UI_ACCENT,
    config: {
      cssVariables: {
        '--button-primary-shadow': '0 0 10px 5px green',
        '--button-answer-option-shadow': '0 0 10px 5px green',
      }
    } as UIAccentConfig,
  },
  {
    id: "girly_sparkle_accent",
    name: "Điểm Nhấn Lấp Lánh",
    description: "Một vài chi tiết trên giao diện sẽ được thêm hiệu ứng lấp lánh nhẹ nhàng.",
    iconUrl: "https://i.ibb.co/s1N371w/icon-girly-sparkle.png",
    price: 70,
    appliesToTheme: [Theme.GIRLY],
    type: AccessoryType.UI_ACCENT,
    config: {
      cssVariables: {
        '--accessory-card-box-shadow': '0 0 15px 5px rgba(244, 114, 182, 0.3)', // Pinkish glow
        '--title-text-gradient-from': '#f9a8d4', // Lighter pink
        '--title-text-gradient-to': '#db2777',   // Deeper pink
      }
    } as UIAccentConfig,
  },
  {
    id: "universal_confetti_correct",
    name: "Pháo Hoa Chúc Mừng",
    description: "Bắn pháo hoa rực rỡ mỗi khi bạn trả lời đúng. Áp dụng cho mọi giao diện.",
    iconUrl: "https://i.ibb.co/stY0N0S/icon-confetti-correct.png",
    price: 150,
    appliesToTheme: 'all',
    type: AccessoryType.BACKGROUND_EFFECT,
    config: {
      particleShape: "circle", 
      particleColor: ["#FFC700", "#FF69B4", "#00F5D4", "#FF4E50", "#FC913A"], 
      count: 120,          
      size: 1.1,          
      oneShot: true,       
      target: 'feedbackIndicator' 
    } as BackgroundEffectConfig,
  },
  {
    id: "universal_treasure_open_sparkle",
    name: "Lấp Lánh Mở Rương",
    description: "Tạo hiệu ứng lấp lánh khi mở rương báu. Áp dụng cho mọi giao diện.",
    iconUrl: "https://i.ibb.co/VMD0b0c/icon-treasure-sparkle.png",
    price: 180,
    appliesToTheme: 'all',
    type: AccessoryType.BACKGROUND_EFFECT,
    config: {
      particleShape: 'star', 
      particleColor: ['#FFD700', '#FFA500', '#FFFACD', '#F0E68C'], 
      count: 150,
      size: 1.2, 
      oneShot: true,
      target: 'treasureChestModalIcon' 
    } as BackgroundEffectConfig,
  },
  {
    id: "neon_sound_pack",
    name: "Gói Âm Thanh Neon",
    description: "Thay đổi một số âm thanh giao diện thành phong cách Neon.",
    iconUrl: "https://i.ibb.co/DkF7bCv/icon-neon-sound.png",
    price: 200,
    appliesToTheme: [Theme.NEON],
    type: AccessoryType.SOUND_PACK_VARIATION,
    config: {
      sounds: {
        [BUTTON_CLICK_SOUND_URL]: CUSTOM_SOUND_NEON_CLICK,
        [CORRECT_ANSWER_SOUND_URL]: CUSTOM_SOUND_NEON_CORRECT,
      }
    } as SoundPackVariationConfig,
  },
  {
    id: "girly_sound_pack",
    name: "Gói Âm Thanh Lấp Lánh",
    description: "Thay đổi một số âm thanh giao diện thành phong cách Công Chúa Lấp Lánh.",
    iconUrl: "https://i.ibb.co/yR0tDjj/icon-girly-sound.png",
    price: 190,
    appliesToTheme: [Theme.GIRLY],
    type: AccessoryType.SOUND_PACK_VARIATION,
    config: {
      sounds: {
        [BUTTON_CLICK_SOUND_URL]: CUSTOM_SOUND_GIRLY_CLICK,
        [CORRECT_ANSWER_SOUND_URL]: CUSTOM_SOUND_GIRLY_CORRECT,
      }
    } as SoundPackVariationConfig,
  },
];
