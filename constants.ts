import { GradeLevel, IslandConfig, IslandDifficulty, Theme, FunQuiz, MessageInBottleContent, FriendlyNPC, NPCInteraction, CollectibleItem, DailyChallengeDefinition, DailyChallengeType, WeeklyChallengeDefinition, WeeklyChallengeType, ThemeAccessory, AccessoryType, UIAccentConfig, SoundPackVariationConfig, BackgroundEffectConfig, CursorTrailConfig } from './types';

export const GEMINI_API_MODEL = 'gemini-2.5-flash-preview-04-17';

export const QUESTIONS_PER_ISLAND = 5;
export const QUESTIONS_PER_FINAL_ISLAND = 4; // Số lượng câu hỏi/thử thách đặc biệt cho đảo cuối
export const MAX_PLAYER_LIVES = 3;
export const ISLANDS_PER_GRADE = 10;

// Game Title
export const GAME_TITLE_TEXT = "Cuộc Phiêu Lưu Toán Học Trên Đảo Kho Báu";


// Error Messages
export const API_KEY_ERROR_MESSAGE = "Lỗi: API Key cho Gemini chưa được cấu hình. Vui lòng kiểm tra biến môi trường process.env.API_KEY.";
export const QUESTION_GENERATION_ERROR_MESSAGE = "Rất tiếc, không thể tạo đủ câu hỏi cho hòn đảo này vào lúc này. Nguyên nhân có thể do kết nối hoặc giới hạn truy cập. Vui lòng thử lại sau hoặc chọn một hòn đảo/độ khó khác.";
export const HINT_GENERATION_ERROR_MESSAGE = "Rất tiếc, Thần Toán Học tạm thời không thể đưa ra gợi ý. Hãy thử tự suy nghĩ thêm nhé!";
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
export const ACTIVATE_FOR_THIS_THEME_TEXT = "Kích hoạt cho giao diện này";
export const NO_OWNED_COMPATIBLE_ACCESSORIES_TEXT = "Bạn chưa sở hữu phụ kiện nào tương thích với giao diện này.";
export const DEACTIVATE_TEXT = "Hủy Kích Hoạt";
export const ACTIVATE_TEXT = "Kích Hoạt";


// UI Text Constants - Dynamic (Functions)
export const ISLAND_PREPARING_MESSAGE = (islandName: string): string => `Đang chuẩn bị Đảo ${islandName}...`;
export const STARTING_ISLAND_TEXT = (islandName: string, difficulty: string): string => `Bắt đầu Đảo ${islandName} (Cấp độ ${difficulty})!`;
export const TRAVELLING_TO_ISLAND_TEXT = (islandName: string): string => `Đang di chuyển đến Đảo ${islandName}...`;
export const REWARD_TEXT_EASY_PERFECT = "Xuất sắc! Hoàn thành đảo Dễ với điểm tuyệt đối!";
export const REWARD_TEXT_MEDIUM_PERFECT = "Không thể tin được! Chinh phục đảo Trung Bình hoàn hảo!";
export const REWARD_TEXT_HARD_PERFECT = "Đỉnh của chóp! Đảo Khó cũng không làm khó được bạn!";
export const SHOOTING_STAR_CLICK_SUCCESS_MESSAGE = (points: number): string => `Bạn bắt được ngôi sao may mắn và nhận ${points} điểm!`;
export const COLLECTIBLE_COLLECTION_TOAST_MESSAGE = (itemName: string): string => `Bạn đã tìm thấy "${itemName}"!`;
export const FILTER_GRADE_ACHIEVEMENTS_TEXT = (grade: GradeLevel): string => `Huy hiệu Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`;
export const TREASURE_CHEST_THANKS_MESSAGE = "Cảm ơn bạn đã mở rương! Chúc may mắn lần sau.";
export const TREASURE_CHEST_POINTS_MESSAGE = (points: number): string => `Bạn tìm thấy ${points} điểm trong rương!`;
export const TREASURE_CHEST_QUIZ_CORRECT_MESSAGE = (points: number): string => `Chính xác! Bạn nhận được ${points} điểm từ câu đố!`;
export const TREASURE_CHEST_QUIZ_INCORRECT_MESSAGE = "Rất tiếc, câu trả lời chưa đúng.";
export const CHOOSE_ISLAND_DIFFICULTY_TEXT = (islandName: string) => `Chọn độ khó cho đảo ${islandName}`;
export const ACCESSORIES_FOR_THEME_TEXT = (themeName: string) => `Phụ kiện cho Giao Diện: ${themeName}`;


// Endless Mode
export const ENDLESS_MODE_LIVES = 5;
export const ENDLESS_QUESTIONS_BATCH_SIZE = 10; // Number of questions per batch
export const ENDLESS_MODE_DIFFICULTY: IslandDifficulty = IslandDifficulty.MEDIUM;
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
export const CUSTOM_SOUND_NEON_CLICK = '/sounds/neon_ui_click.mp3'; // Placeholder
export const CUSTOM_SOUND_NEON_CORRECT = '/sounds/neon_ui_correct.mp3'; // Placeholder
export const CUSTOM_SOUND_GIRLY_CLICK = '/sounds/girly_ui_click.mp3'; // Placeholder
export const CUSTOM_SOUND_GIRLY_CORRECT = '/sounds/girly_ui_correct.mp3'; // Placeholder


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
export const FINAL_TREASURE_ISLAND_ID = "gFinal_main_treasure";

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
    description: "Làm quen với phép cộng, trừ đơn giản trong phạm vi 10.",
    topics: ["phép cộng trong phạm vi 10", "phép trừ trong phạm vi 10", "tìm số còn thiếu trong phép cộng/trừ", "bài toán có lời văn về cộng/trừ (phạm vi 10)"],
    targetGradeLevel: GradeLevel.GRADE_1,
    mapIcon: "➕"
  },
  { islandId: "g1_island_03_shapes_basic", islandNumber: 3, name: "Làng Hình Học Vui", description: "Nhận biết các hình cơ bản.", topics: ["hình vuông", "hình tròn", "hình tam giác", "hình chữ nhật"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "📐" },
  { islandId: "g1_island_04_counting_1_20", islandNumber: 4, name: "Rặng San Hô Số (1-20)", description: "Mở rộng đếm và so sánh số đến 20.", topics: ["đếm đến 20", "so sánh số trong phạm vi 20"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "🐠" },
  { islandId: "g1_island_05_time_days_week", islandNumber: 5, name: "Đồng Hồ Thời Gian", description: "Học về các ngày trong tuần.", topics: ["các ngày trong tuần", "thứ tự ngày trong tuần"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "🗓️" },
  { islandId: "g1_island_06_measurement_length_basic", islandNumber: 6, name: "Thung Lũng Đo Dài", description: "So sánh độ dài cơ bản.", topics: ["dài hơn", "ngắn hơn", "cao hơn", "thấp hơn"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "📏" },
  { islandId: "g1_island_07_problem_solving_simple", islandNumber: 7, name: "Hang Toán Đố Nhỏ", description: "Giải toán đố đơn giản.", topics: ["toán đố cộng trừ phạm vi 10"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "💡" },
  { islandId: "g1_island_08_patterns_simple", islandNumber: 8, name: "Suối Quy Luật Kỳ Diệu", description: "Tìm quy luật đơn giản.", topics: ["quy luật hình ảnh", "quy luật số đơn giản"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "🎨" },
  { islandId: "g1_island_09_money_coins_basic", islandNumber: 9, name: "Chợ Tiền Xu Ban Sơ", description: "Nhận biết tiền xu cơ bản.", topics: ["nhận biết mệnh giá tiền xu nhỏ"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "💰" },
  { islandId: "g1_island_10_review_grade1", islandNumber: 10, name: "Đỉnh Tri Thức Lớp 1", description: "Ôn tập kiến thức lớp 1.", topics: ["cộng trừ phạm vi 20", "hình học cơ bản", "thời gian", "đo lường"], targetGradeLevel: GradeLevel.GRADE_1, mapIcon: "🌟" },

  // --- GRADE 2 --- (10 Islands)
  { islandId: "g2_island_01_counting_1_100", islandNumber: 1, name: "Thảo Nguyên Trăm Số", description: "Đếm, đọc, viết, so sánh số trong phạm vi 100.", topics: ["số có hai chữ số", "so sánh số phạm vi 100", " cấu tạo số (chục, đơn vị)"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "💯" },
  { islandId: "g2_island_02_addition_subtraction_100_no_carry", islandNumber: 2, name: "Biển Cộng Trừ Không Nhớ (P.vi 100)", description: "Cộng, trừ không nhớ trong phạm vi 100.", topics: ["cộng không nhớ phạm vi 100", "trừ không nhớ phạm vi 100"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🌊" },
  { islandId: "g2_island_03_addition_subtraction_100_with_carry", islandNumber: 3, name: "Núi Cộng Trừ Có Nhớ (P.vi 100)", description: "Cộng, trừ có nhớ trong phạm vi 100.", topics: ["cộng có nhớ phạm vi 100", "trừ có nhớ phạm vi 100"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🏔️" },
  { islandId: "g2_island_04_multiplication_division_intro", islandNumber: 4, name: "Rừng Nhân Chia Bí Ẩn", description: "Làm quen phép nhân, chia.", topics: ["phép nhân (bảng 2, 5)", "phép chia (bảng 2, 5)"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🌳" },
  { islandId: "g2_island_05_time_clock_hours_halfhours", islandNumber: 5, name: "Tháp Đồng Hồ Chính Xác", description: "Xem giờ đúng, giờ rưỡi.", topics: ["xem giờ đúng", "xem giờ rưỡi"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "⏰" },
  { islandId: "g2_island_06_measurement_length_cm_m", islandNumber: 6, name: "Sông Đo Độ Dài (cm, m)", description: "Đo độ dài bằng cm, m.", topics: ["đơn vị đo độ dài cm, m", "ước lượng độ dài"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🏞️" },
  { islandId: "g2_island_07_shapes_3d_basic", islandNumber: 7, name: "Xưởng Hình Khối Kỳ Diệu", description: "Nhận biết hình khối cơ bản.", topics: ["hình lập phương", "hình hộp chữ nhật", "hình cầu", "hình trụ"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🧊" },
  { islandId: "g2_island_08_problem_solving_multistep_simple", islandNumber: 8, name: "Mê Cung Toán Đố Lớp 2", description: "Giải toán đố nhiều bước đơn giản.", topics: ["toán đố kết hợp cộng trừ", "toán đố nhân chia đơn giản"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "🧩" },
  { islandId: "g2_island_09_data_simple_charts", islandNumber: 9, name: "Vườn Thống Kê Nhỏ", description: "Đọc biểu đồ tranh đơn giản.", topics: ["biểu đồ tranh"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "📊" },
  { islandId: "g2_island_10_review_grade2", islandNumber: 10, name: "Ngọn Hải Đăng Lớp 2", description: "Ôn tập kiến thức lớp 2.", topics: ["cộng trừ phạm vi 100", "nhân chia (bảng 2,3,4,5)", "thời gian", "đo lường"], targetGradeLevel: GradeLevel.GRADE_2, mapIcon: "💡" },
   // --- GRADE 3 --- (10 Islands)
  { islandId: "g3_island_01_numbers_1000", islandNumber: 1, name: "Vương Quốc Nghìn Số", description: "Số đến 1000, so sánh, làm tròn.", topics: ["số có ba chữ số", "so sánh số phạm vi 1000", "làm tròn số đến hàng chục, hàng trăm"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🏰" },
  { islandId: "g3_island_02_multiplication_division_tables", islandNumber: 2, name: "Đấu Trường Bảng Cửu Chương", description: "Hoàn thiện bảng nhân chia.", topics: ["bảng nhân 6,7,8,9", "bảng chia 6,7,8,9"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "⚔️" },
  { islandId: "g3_island_03_addition_subtraction_1000", islandNumber: 3, name: "Thác Cộng Trừ Nghìn Lớn", description: "Cộng trừ trong phạm vi 1000.", topics: ["cộng trừ có nhớ phạm vi 1000"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🌊" },
  { islandId: "g3_island_04_fractions_intro", islandNumber: 4, name: "Đảo Phân Số Kỳ Diệu", description: "Làm quen với phân số.", topics: ["1/2", "1/3", "1/4", "1/5"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🍕" },
  { islandId: "g3_island_05_time_minutes_calendar", islandNumber: 5, name: "Lịch Vạn Niên Thời Gian", description: "Xem giờ đến phút, xem lịch.", topics: ["xem giờ chính xác đến phút", "xem lịch (ngày, tháng, năm)"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "📆" },
  { islandId: "g3_island_06_measurement_weight_g_kg", islandNumber: 6, name: "Cân Đo Trọng Lượng (g, kg)", description: "Đo trọng lượng bằng g, kg.", topics: ["đơn vị đo khối lượng g, kg", "cân đĩa"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "⚖️" },
  { islandId: "g3_island_07_geometry_perimeter", islandNumber: 7, name: "Vườn Chu Vi Hình Học", description: "Tính chu vi hình vuông, chữ nhật.", topics: ["chu vi hình vuông", "chu vi hình chữ nhật"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🌳" },
  { islandId: "g3_island_08_problem_solving_complex", islandNumber: 8, name: "Kim Tự Tháp Toán Đố Lớp 3", description: "Giải toán đố phức tạp hơn.", topics: ["toán đố nhiều bước liên quan nhân chia"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🔺" },
  { islandId: "g3_island_09_money_transactions", islandNumber: 9, name: "Siêu Thị Tiền Tệ Thông Minh", description: "Tính toán tiền tệ đơn giản.", topics: ["cộng trừ tiền tệ", "bài toán mua bán"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🛒" },
  { islandId: "g3_island_10_review_grade3", islandNumber: 10, name: "Đài Thiên Văn Lớp 3", description: "Ôn tập kiến thức lớp 3.", topics: ["số đến 10000", "nhân chia thành thạo", "phân số", "chu vi"], targetGradeLevel: GradeLevel.GRADE_3, mapIcon: "🔭" },

  // --- GRADE 4 --- (10 Islands)
  { islandId: "g4_island_01_numbers_large", islandNumber: 1, name: "Thiên Hà Triệu Số", description: "Số đến hàng triệu, lớp triệu.", topics: ["số có nhiều chữ số", "hàng và lớp", "so sánh số lớn"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🌌" },
  { islandId: "g4_island_02_multiplication_division_large_numbers", islandNumber: 2, name: "Xưởng Nhân Chia Số Lớn", description: "Nhân chia với số có nhiều chữ số.", topics: ["nhân với số có hai, ba chữ số", "chia cho số có một, hai chữ số"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "⚙️" },
  { islandId: "g4_island_03_fractions_operations", islandNumber: 3, name: "Thung Lũng Phân Số Cao Cấp", description: "Cộng trừ phân số cùng mẫu.", topics: ["so sánh phân số", "cộng trừ phân số cùng mẫu số"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🏞️" },
  { islandId: "g4_island_04_decimals_intro", islandNumber: 4, name: "Hồ Thập Phân Huyền Bí", description: "Làm quen số thập phân.", topics: ["khái niệm số thập phân", "đọc viết số thập phân"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "💧" },
  { islandId: "g4_island_05_geometry_area", islandNumber: 5, name: "Công Viên Diện Tích Rộng Lớn", description: "Tính diện tích hình chữ nhật, vuông.", topics: ["diện tích hình chữ nhật", "diện tích hình vuông"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🏞️" },
  { islandId: "g4_island_06_measurement_volume_capacity", islandNumber: 6, name: "Bể Chứa Thể Tích (ml, l)", description: "Đo thể tích, dung tích.", topics: ["ml, l", "đổi đơn vị đo thể tích"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🧪" },
  { islandId: "g4_island_07_average_problem", islandNumber: 7, name: "Đỉnh Cao Trung Bình Cộng", description: "Bài toán tìm trung bình cộng.", topics: ["tìm trung bình cộng của nhiều số"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "📈" },
  { islandId: "g4_island_08_problem_solving_ratio_proportion_simple", islandNumber: 8, name: "Cầu Tỷ Lệ Đơn Giản", description: "Bài toán liên quan đến tỷ lệ.", topics: ["bài toán rút về đơn vị", "bài toán tìm hai số khi biết tổng và tỷ"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🌉" },
  { islandId: "g4_island_09_data_bar_charts", islandNumber: 9, name: "Bảo Tàng Biểu Đồ Cột", description: "Đọc và phân tích biểu đồ cột.", topics: ["biểu đồ cột"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "🏛️" },
  { islandId: "g4_island_10_review_grade4", islandNumber: 10, name: "Thư Viện Cổ Lớp 4", description: "Ôn tập kiến thức lớp 4.", topics: ["số tự nhiên lớn", "bốn phép tính với số tự nhiên", "phân số", "diện tích"], targetGradeLevel: GradeLevel.GRADE_4, mapIcon: "📚" },

  // --- GRADE 5 --- (10 Islands)
  { islandId: "g5_island_01_decimals_operations", islandNumber: 1, name: "Đại Dương Thập Phân Bao La", description: "Cộng, trừ, nhân, chia số thập phân.", topics: ["cộng trừ số thập phân", "nhân chia số thập phân"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🌊" },
  { islandId: "g5_island_02_percentage_intro", islandNumber: 2, name: "Rừng Tỷ Lệ Phần Trăm", description: "Làm quen với tỷ số phần trăm.", topics: ["khái niệm tỷ số phần trăm", "tìm tỷ số phần trăm của hai số"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🌲" },
  { islandId: "g5_island_03_geometry_triangle_circle_area", islandNumber: 3, name: "Đền Thờ Diện Tích Tam Giác Tròn", description: "Diện tích tam giác, hình tròn.", topics: ["diện tích hình tam giác", "chu vi, diện tích hình tròn"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "⛩️" },
  { islandId: "g5_island_04_motion_problems_simple", islandNumber: 4, name: "Xa Lộ Chuyển Động Đều", description: "Bài toán chuyển động đều đơn giản.", topics: ["quãng đường, vận tốc, thời gian"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🛣️" },
  { islandId: "g5_island_05_measurement_volume_cube_cuboid", islandNumber: 5, name: "Xưởng Đúc Thể Tích Khối", description: "Thể tích hình hộp chữ nhật, lập phương.", topics: ["thể tích hình hộp chữ nhật", "thể tích hình lập phương"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🏭" },
  { islandId: "g5_island_06_problem_solving_percentage", islandNumber: 6, name: "Chợ Giảm Giá Phần Trăm", description: "Bài toán liên quan tỷ số phần trăm.", topics: ["tìm giá trị phần trăm của một số", "bài toán lãi suất, giảm giá"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🛍️" },
  { islandId: "g5_island_07_data_analysis_charts", islandNumber: 7, name: "Viện Nghiên Cứu Biểu Đồ", description: "Phân tích các loại biểu đồ.", topics: ["biểu đồ đường", "biểu đồ quạt"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🔬" },
  { islandId: "g5_island_08_number_sequences_patterns", islandNumber: 8, name: "Thung Lũng Dãy Số Thông Thái", description: "Tìm quy luật dãy số phức tạp.", topics: ["dãy số cách đều", "dãy số có quy luật phức tạp"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🏞️" },
  { islandId: "g5_island_09_logic_reasoning_puzzles", islandNumber: 9, name: "Hang Động Tư Duy Logic", description: "Câu đố logic, suy luận toán học.", topics: ["suy luận logic", "toán vui"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🧠" },
  { islandId: "g5_island_10_review_grade5", islandNumber: 10, name: "Cổng Vinh Quang Lớp 5", description: "Tổng ôn kiến thức tiểu học.", topics: ["ôn tập số thập phân", "tỷ số phần trăm", "hình học không gian", "toán chuyển động"], targetGradeLevel: GradeLevel.GRADE_5, mapIcon: "🎓" },

  {
    islandId: FINAL_TREASURE_ISLAND_ID,
    islandNumber: 1, // Only one island in this "grade"
    name: "Mê Cung Trí Tuệ Cổ Đại",
    description: "Nơi huyền thoại được thử thách, kho báu trí tuệ đang chờ đợi.",
    topics: ["Câu đố logic cổ đại", "Mật mã kho báu", "Thử thách tư duy trừu tượng", "Suy luận không gian (mô tả bằng lời)", "Câu đố mẹo toán học", "Giải mã ký hiệu cổ"],
    targetGradeLevel: GradeLevel.FINAL,
    mapIcon: "👑💎" 
  }
];

// Messages in a Bottle
export const MESSAGES_IN_BOTTLE: MessageInBottleContent[] = [
  { id: "wish1", text: "Ước gì mình học thật giỏi toán!", type: "wish" },
  { id: "quote1", text: "Thiên tài một phần trăm là cảm hứng và chín mươi chín phần trăm là mồ hôi. - Thomas Edison", type: "quote" },
  { id: "hint1", text: "Đôi khi, vẽ hình ra sẽ giúp bạn giải toán dễ hơn đó!", type: "hint" },
  { id: "wish2", text: "Mong rằng mọi bài kiểm tra đều đạt điểm 10!", type: "wish" },
  { id: "quote2", text: "Việc học giống như con thuyền bơi ngược dòng, không tiến ắt sẽ lùi.", type: "quote" },
];

// Fun Quizzes for Treasure Chests
export const FUN_QUIZZES: FunQuiz[] = [
  { id: "quiz1", question: "Con gì đầu dê đuôi ốc?", answer: "Con dốc", points: TREASURE_QUIZ_REWARD_POINTS_MIN, type: 'fill' },
  { id: "quiz2", question: "1 cộng 1 bằng mấy (đố mẹo)?", answer: "11", options: ["2", "0", "11", "3"], points: TREASURE_QUIZ_REWARD_POINTS_MAX, type: 'mc' },
  { id: "quiz3", question: "Trong một cuộc thi chạy, nếu bạn vượt qua người thứ hai, bạn sẽ đứng thứ mấy?", answer: "Thứ hai", options: ["Thứ nhất", "Thứ hai", "Thứ ba", "Không biết"], points: TREASURE_QUIZ_REWARD_POINTS_MIN, type: 'mc' },
  { id: "quiz4", question: "Cái gì luôn đi nhưng không bao giờ đến nơi?", answer: "Thời gian", type: 'fill', points: TREASURE_QUIZ_REWARD_POINTS_MAX },
];

// Friendly NPCs
export const FRIENDLY_NPCS: FriendlyNPC[] = [
  { id: "npc_owl", name: "Cú Thông Thái", imageUrl: "https://i.ibb.co/VvzK93T/npc-cu-thong-thai.png" },
  { id: "npc_squirrel", name: "Sóc Nhanh Nhẹn", imageUrl: "https://i.ibb.co/bJCqN70/npc-soc-nhanh-nhen.png" },
  { id: "npc_turtle", name: "Rùa Kiên Trì", imageUrl: "https://i.ibb.co/kSvFrCx/npc-rua-kien-tri.png" },
];

// NPC Interactions
export const NPC_INTERACTIONS: NPCInteraction[] = [
  { id: "owl_fact1", npcIds: ["npc_owl"], type: "fact", text: "Bạn có biết rằng số Pi (π) là một hằng số toán học vô cùng thú vị không? Nó có vô hạn chữ số sau dấu phẩy đấy!", points: 5 },
  { id: "owl_riddle1", npcIds: ["npc_owl"], type: "riddle", text: "Tôi có các thành phố, nhưng không có nhà cửa. Tôi có núi, nhưng không có cây. Tôi có nước, nhưng không có cá. Tôi là gì?", answer: "Bản đồ", points: 15 },
  { id: "squirrel_encouragement1", npcIds: ["npc_squirrel"], type: "encouragement", text: "Cố lên nào! Mỗi bài toán giải được là một bước tiến lớn đó!", points: 3 },
  { id: "squirrel_riddle1", npcIds: ["npc_squirrel"], type: "riddle", text: "Cái gì càng lấy đi càng lớn?", answer: "Cái hố", points: 10 },
  { id: "turtle_fact1", npcIds: ["npc_turtle"], type: "fact", text: "Từ từ mà chắc! Cũng giống như giải toán, cẩn thận từng bước sẽ giúp bạn đến đích.", points: 5 },
  { id: "turtle_riddle1", npcIds: ["npc_turtle"], type: "riddle", text: "Buổi sáng đi bằng 4 chân, buổi trưa đi bằng 2 chân, buổi tối đi bằng 3 chân. Đó là con gì?", answer: "Con người", points: 20 },
  { id: "generic_encouragement", type: "encouragement", text: "Bạn đang làm rất tốt! Tiếp tục khám phá nhé!", points: 2 },
];

// Collectible Items
export const COLLECTIBLE_ITEMS: CollectibleItem[] = [
  { id: "shell_rare", name: "Vỏ Sò Ánh Kim", icon: "🐚", description: "Một vỏ sò hiếm với những đường vân lấp lánh như vàng." },
  { id: "map_ancient", name: "Bản Đồ Cổ Đại", icon: "🗺️", description: "Mảnh bản đồ cũ kỹ, dường như dẫn đến một kho báu bị lãng quên." },
  { id: "gem_blue", name: "Viên Đá Saphia", icon: "💎", description: "Viên đá quý màu xanh biển sâu, tỏa ra ánh sáng huyền bí." },
  { id: "compass_magic", name: "La Bàn Kỳ Diệu", icon: "🧭", description: "Chiếc la bàn không chỉ hướng, mà còn rung nhẹ khi ở gần điều bí ẩn." },
  { id: "feather_phoenix", name: "Lông Vũ Phượng Hoàng", icon: "🪶", description: "Một chiếc lông vũ ấm áp, được cho là rơi từ một con phượng hoàng lửa." },
];

// Shop Accessories
export const SHOP_ACCESSORIES: ThemeAccessory[] = [
  {
    id: "neon_star_effect",
    name: "Hiệu Ứng Sao Neon",
    description: "Thêm các ngôi sao neon lấp lánh bay nhẹ nhàng trên nền giao diện Chiến Binh Neon.",
    iconUrl: "https://i.ibb.co/yWw0kF6/icon-neon-star-effect.png",
    price: 150,
    appliesToTheme: [Theme.NEON],
    type: AccessoryType.BACKGROUND_EFFECT,
    config: { particleShape: 'star', particleColor: '#00f5d4', count: 30, speed: 0.3, size: 2, sizeVariation: 1, opacity: 0.8 } as BackgroundEffectConfig
  },
  {
    id: "girly_sparkle_cursor",
    name: "Con Trỏ Lấp Lánh",
    description: "Thêm một vệt sáng lấp lánh màu hồng theo sau con trỏ chuột của bạn.",
    iconUrl: "https://i.ibb.co/PN20rW8/icon-girly-sparkle-cursor.png",
    price: 100,
    appliesToTheme: [Theme.GIRLY],
    type: AccessoryType.CURSOR_TRAIL,
    config: { trailColor: '#f472b6', trailLength: 12, fadeSpeed: 0.08, particleSize: 2.5, shape: 'star' } as CursorTrailConfig
  },
  {
    id: "aero_bubble_border",
    name: "Viền Bong Bóng Aero",
    description: "Thêm hiệu ứng viền bong bóng tinh tế cho các nút và thẻ trong giao diện Frutiger Aero.",
    iconUrl: "https://i.ibb.co/QjT9P1x/icon-aero-bubble-border.png",
    price: 80,
    appliesToTheme: [Theme.FRUTIGER_AERO, Theme.DEFAULT],
    type: AccessoryType.UI_ACCENT,
    config: { 
      cssVariables: { 
        '--accessory-button-border': '2px dotted rgba(100, 180, 255, 0.6)',
        '--accessory-card-box-shadow': '0 0 12px rgba(100, 180, 255, 0.4)',
      } 
    } as UIAccentConfig
  },
  {
    id: "neon_button_glow",
    name: "Nút Neon Phát Sáng",
    description: "Làm cho các nút chính trong giao diện Neon có thêm hiệu ứng hào quang phát sáng.",
    iconUrl: "https://i.ibb.co/7Kx3xDs/icon-neon-button-glow.png", // Placeholder
    price: 120,
    appliesToTheme: [Theme.NEON],
    type: AccessoryType.UI_ACCENT,
    config: {
      cssVariables: {
        '--button-primary-shadow': '0 0 8px var(--accent, #00f5d4), 0 0 16px var(--accent, #00f5d4)',
        '--button-answer-option-shadow': '0 0 6px var(--accent, #fa2772)',
      }
    } as UIAccentConfig
  },
  {
    id: "girly_sound_pack",
    name: "Gói Âm Thanh Kẹo Ngọt",
    description: "Thay đổi một số âm thanh trong game thành phiên bản ngọt ngào, vui tai hơn cho giao diện Công Chúa.",
    iconUrl: "https://i.ibb.co/GMSdGkB/icon-girly-sound-pack.png", // Placeholder
    price: 70,
    appliesToTheme: [Theme.GIRLY],
    type: AccessoryType.SOUND_PACK_VARIATION,
    config: {
      sounds: {
        [BUTTON_CLICK_SOUND_URL]: CUSTOM_SOUND_GIRLY_CLICK, // Placeholder path
        [CORRECT_ANSWER_SOUND_URL]: CUSTOM_SOUND_GIRLY_CORRECT, // Placeholder path
      }
    } as SoundPackVariationConfig
  },
  {
    id: "universal_confetti_correct",
    name: "Pháo Hoa Chúc Mừng",
    description: "Hiệu ứng pháo hoa nhỏ bắn ra khi trả lời đúng câu hỏi. Áp dụng cho mọi giao diện.",
    iconUrl: "https://i.ibb.co/8XJ30fQ/icon-universal-confetti.png", // Placeholder
    price: 200,
    appliesToTheme: 'all',
    type: AccessoryType.BACKGROUND_EFFECT, // Could be UI_ACCENT if it's a small overlay animation
    config: { particleShape: 'circle', particleColor: ['#FFD700', '#FF69B4', '#00F5D4', '#FF4500'], count: 15, speed: 2, size: 3, oneShot: true, target: 'feedbackIndicator' } as BackgroundEffectConfig // Custom 'oneShot' and 'target' properties
  }
];
