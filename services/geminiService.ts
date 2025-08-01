import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
    GEMINI_API_MODEL,
    API_KEY_ERROR_MESSAGE,
    QUESTION_GENERATION_ERROR_MESSAGE,
    HINT_GENERATION_ERROR_MESSAGE,
    HINT_API_KEY_ERROR_MESSAGE,
    HINT_UNAVAILABLE_MESSAGE,
    GRADE_LEVEL_TEXT_MAP,
    ISLAND_DIFFICULTY_TEXT_MAP,
    QUESTIONS_PER_ISLAND,
    QUESTIONS_PER_FINAL_ISLAND, 
    ISLAND_CONFIGS, 
    ENDLESS_QUESTIONS_BATCH_SIZE,
    FINAL_TREASURE_ISLAND_ID
} from '../constants';
import { GradeLevel, Question, QuestionType, IslandDifficulty, IslandConfig } from "../types";
import { v4 as uuidv4 } from 'uuid';

let ai: GoogleGenAI | null = null;

const initializeAi = (): GoogleGenAI | null => {
  if (ai) return ai;
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY for Gemini is not configured.");
    return null; 
  }
  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Error initializing GoogleGenAI:", error);
    return null;
  }
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_QUESTION_GENERATION_RETRIES = 2; 
const INITIAL_RETRY_DELAY_MS = 2500; 

interface RawQuestionData {
  text: string;
  topic: string;
  options: string[];
  correctAnswer: string;
}

export const generateMathQuestionsForIslandSet = async (
  targetGradeLevel: GradeLevel, 
  topics: string[],
  islandName: string, 
  islandId: string, 
  difficulty: IslandDifficulty
): Promise<Question[] | null> => {
  const currentAi = initializeAi();
  if (!currentAi) {
    console.error(API_KEY_ERROR_MESSAGE);
    return null;
  }

  const gradeDescription = GRADE_LEVEL_TEXT_MAP[targetGradeLevel] || `cấp độ ${targetGradeLevel}`;
  const difficultyName = ISLAND_DIFFICULTY_TEXT_MAP[difficulty];
  const numberOfQuestionsToGenerate = targetGradeLevel === GradeLevel.FINAL ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND;

  let prompt: string;

  if (targetGradeLevel === GradeLevel.FINAL) {
      const isUltimateIsland = islandId === FINAL_TREASURE_ISLAND_ID;
      const epicDifficultyName = isUltimateIsland ? "Huyền Thoại" : "Sử Thi";
      prompt = `Bạn là một Người Gác Đền Cổ Xưa của Mê Cung Trí Tuệ, chuyên tạo ra những thử thách độc đáo và hóc búa bằng tiếng Việt cho những nhà thám hiểm ưu tú nhất.
Hòn đảo này là "${islandName}", một trong những thử thách cuối cùng.
Độ khó mặc định là "${epicDifficultyName}" - nghĩa là cực kỳ khó, đòi hỏi tư duy sâu sắc và sáng tạo.
Các thử thách nên tập trung vào các chủ đề: ${topics.join(', ')}, nhưng được biến tấu ở mức độ nâng cao, lắt léo hơn nhiều so với chương trình học thông thường.

Bạn cần tạo một BỘ GỒM CHÍNH XÁC ${numberOfQuestionsToGenerate} THỬ THÁCH. Chúng phải được trả về dưới dạng một MẢNG JSON.
Mỗi thử thách phải có 4 lựa chọn đáp án.

YÊU CẦU QUAN TRỌNG VỀ CÁC THỬ THÁCH:
- Sáng tạo, độc đáo, không theo khuôn mẫu toán học thông thường.
- Thử thách khả năng suy luận logic, giải mã, tư duy không gian, và quan sát tinh tế.
- Mỗi thử thách nên có độ khó tương đương nhau, ở mức "${epicDifficultyName}".
- Ngắn gọn, dễ hiểu về mặt mô tả tình huống/câu đố.

Định dạng JSON cho MỖI thử thách trong mảng (PHẢI TUÂN THỦ NGHIÊM NGẶT):
Mỗi đối tượng thử thách trong mảng phải có các thuộc tính sau và CHỈ những thuộc tính này:
- "text": Nội dung thử thách/câu đố/mô tả mật mã (string).
- "topic": Chủ đề chính của thử thách (string, ví dụ: "Câu đố logic", "Mật mã Caesar", "Suy luận hình ảnh").
- "options": Một mảng gồm 4 chuỗi là các lựa chọn đáp án (string[]). Một trong số đó phải là đáp án đúng.
- "correctAnswer": Chuỗi đáp án đúng (string), phải là một trong các giá trị của "options".
LƯU Ý: KHÔNG được thêm bất kỳ trường nào khác.

Ví dụ cấu trúc MẢNG JSON mong muốn (chứa ${numberOfQuestionsToGenerate} thử thách):
[
  {
    "text": "Một người nông dân muốn qua sông với một con sói, một con dê và một bắp cải. Chiếc thuyền chỉ chở được người nông dân và một thứ nữa (sói, dê hoặc cải). Nếu không có người nông dân, sói sẽ ăn thịt dê, dê sẽ ăn cải. Người nông dân phải làm thế nào để đưa tất cả qua sông an toàn? Đáp án nào sau đây mô tả lượt đi ĐẦU TIÊN và lượt về ĐẦU TIÊN hợp lý nhất?",
    "topic": "Câu đố logic cổ điển",
    "options": ["Đưa dê qua, quay về một mình", "Đưa sói qua, quay về với dê", "Đưa cải qua, quay về một mình", "Đưa dê qua, quay về với sói"],
    "correctAnswer": "Đưa dê qua, quay về một mình"
  },
  {
    "text": "Giải mã từ sau: 'KIPCV'. Từ này được mã hóa bằng cách dịch chuyển mỗi chữ cái đi 2 vị trí trong bảng chữ cái tiếng Việt (A->C, B->D,...). Từ gốc là gì?",
    "topic": "Mật mã Caesar",
    "options": ["HOABA", "IGNAV", "KHOBÁU", "KHOBAU"],
    "correctAnswer": "KHOBAU"
  } 
  // ... (Thêm các thử thách khác cho đủ CHÍNH XÁC ${numberOfQuestionsToGenerate} thử thách)
]

HƯỚNG DẪN CỰC KỲ QUAN TRỌNG VỀ ĐỊNH DẠNG ĐẦU RA:
- Chỉ trả về duy nhất MẢNG JSON.
- Mảng JSON PHẢI chứa ĐÚNG ${numberOfQuestionsToGenerate} đối tượng thử thách.
- Nội dung thử thách, chủ đề, và các lựa chọn phải hoàn toàn bằng tiếng Việt.
- Đảm bảo "correctAnswer" là một trong "options".
- Cẩn thận với cú pháp JSON.
`;
  } else {
    // Logic for non-Final islands (batch generation)
    let topicInstruction = "";
    if (topics && topics.length > 0) {
      topicInstruction = `Các câu hỏi nên tập trung vào các chủ đề sau: ${topics.join(', ')}.`;
    } else {
      topicInstruction = `Các câu hỏi nên phù hợp với chương trình học chung của ${gradeDescription}.`;
    }
    prompt = `Bạn là một giáo viên tiểu học chuyên ra đề toán bằng tiếng Việt, có khả năng sáng tạo những câu hỏi vừa thử thách vừa thú vị cho học sinh trình độ ${gradeDescription}.
Hòn đảo hiện tại là: "${islandName}".
${topicInstruction}

Bạn cần tạo một BỘ GỒM CHÍNH XÁC ${numberOfQuestionsToGenerate} CÂU HỎI toán trắc nghiệm. ${numberOfQuestionsToGenerate} câu hỏi này phải được trả về dưới dạng một MẢNG JSON (JSON array), trong đó mỗi phần tử của mảng là một đối tượng JSON đại diện cho một câu hỏi.
Mỗi câu hỏi phải hoàn toàn dựa trên văn bản, không yêu cầu hình ảnh, và có 4 lựa chọn đáp án.

YÊU CẦU QUAN TRỌNG VỀ ĐỘ KHÓ CỦA CÁC CÂU HỎI TRONG BỘ ${numberOfQuestionsToGenerate} CÂU:
Độ khó tổng thể của hòn đảo này được chọn là: "${difficultyName}".
Trong bộ ${numberOfQuestionsToGenerate} câu hỏi này (đánh số từ 0 đến ${numberOfQuestionsToGenerate - 1} theo vị trí trong mảng), độ khó của các câu hỏi phải tăng dần một cách hợp lý, phù hợp với độ khó tổng thể "${difficultyName}" của hòn đảo.
- Câu hỏi 0 (đầu tiên trong mảng):
  - Nếu độ khó đảo là "Dễ": Tạo một câu hỏi rất cơ bản, một bước tính, sử dụng số nhỏ.
  - Nếu độ khó đảo là "Trung Bình": Tạo một câu hỏi cơ bản, có thể một hoặc hai bước tính đơn giản.
  - Nếu độ khó đảo là "Khó": Tạo một câu hỏi hơi phức tạp hơn "Trung Bình", có thể hai bước tính, hoặc một khái niệm hơi nâng cao cho cấp lớp.
- Các câu hỏi ở giữa (ví dụ: 1, 2, 3 nếu có 5 câu):
  - Tăng dần độ phức tạp so với câu trước đó, phù hợp với độ khó "${difficultyName}" của đảo.
  - "Dễ": Tăng nhẹ, tập trung khái niệm cốt lõi.
  - "Trung Bình": Thêm chút thử thách (số lớn hơn, nhiều bước hơn).
  - "Khó": Nhiều bước tính hơn, kết hợp khái niệm thông minh, có thể có yếu tố gây nhiễu nhẹ.
- Câu hỏi cuối cùng trong mảng (ví dụ: câu 4 nếu có 5 câu):
  - Đây PHẢI là câu thử thách NHẤT trong bộ ${numberOfQuestionsToGenerate} câu này.
  - "Dễ": Khó nhất trong ${numberOfQuestionsToGenerate} câu dễ, có thể yêu cầu suy luận đơn giản.
  - "Trung Bình": Yêu cầu tư duy logic tốt, toán đố nhiều bước, áp dụng sáng tạo.
  - "Khó": PHẢI RẤT phức tạp, tư duy logic sâu sắc, dạng toán lạ, kết hợp nhiều kiến thức.

Yêu cầu về tính chất chung cho TẤT CẢ câu hỏi:
- Vui vẻ, thú vị, hấp dẫn, lôi cuốn.
- Kích thích tư duy, thử thách trí tuệ vừa phải (theo độ khó đã mô tả).
- Mang lại cảm giác thành tựu.
- Có thể có yếu tố bất ngờ, mới lạ, độc đáo, nhưng vẫn phù hợp trình độ và chủ đề.
- Ngắn gọn, dễ hiểu, tránh dài dòng.

Định dạng JSON cho MỖI câu hỏi trong mảng:
Mỗi đối tượng câu hỏi trong mảng phải có các thuộc tính sau và CHỈ những thuộc tính này:
- "text": Nội dung câu hỏi (string).
- "topic": Chủ đề chính của câu hỏi (string).
- "options": Một mảng gồm 4 chuỗi là các lựa chọn đáp án (string[]).
- "correctAnswer": Chuỗi đáp án đúng (string), phải là một trong các giá trị của "options".
LƯU Ý: KHÔNG được thêm bất kỳ trường nào khác như "comment", "difficulty_explanation", v.v.

Ví dụ cấu trúc MẢNG JSON mong muốn (chứa 2 câu hỏi mẫu, bạn cần tạo ${numberOfQuestionsToGenerate}):
[
  {
    "text": "Trên Đảo Kỳ Bí, có 3 con khỉ. Mỗi con khỉ có 2 quả chuối. Hỏi tổng cộng có bao nhiêu quả chuối?",
    "topic": "Phép nhân cơ bản",
    "options": ["4 quả chuối", "5 quả chuối", "6 quả chuối", "7 quả chuối"],
    "correctAnswer": "6 quả chuối"
  },
  {
    "text": "Một đàn gà có 10 chân. Hỏi đàn gà đó có bao nhiêu con?",
    "topic": "Phép chia cơ bản",
    "options": ["3 con", "4 con", "5 con", "6 con"],
    "correctAnswer": "5 con"
  }
  // ... (Thêm các câu hỏi khác cho đủ CHÍNH XÁC ${numberOfQuestionsToGenerate} câu)
]

HƯỚNG DẪN CỰC KỲ QUAN TRỌNG VỀ ĐỊNH DẠNG ĐẦU RA:
- Chỉ trả về duy nhất MẢNG JSON, bắt đầu bằng ký tự '[' và kết thúc bằng ký tự ']'. Không có bất kỳ văn bản, giải thích, hay ký tự nào khác bao quanh hay nằm ngoài mảng JSON.
- Mảng JSON PHẢI chứa ĐÚNG ${numberOfQuestionsToGenerate} đối tượng câu hỏi. Không ít hơn, không nhiều hơn.
- Nội dung câu hỏi, chủ đề, và các lựa chọn phải hoàn toàn bằng tiếng Việt.
- Đảm bảo "correctAnswer" của mỗi câu là một trong các giá trị trong mảng "options" của câu đó.
- Hãy cực kỳ cẩn thận với cú pháp JSON: đảm bảo tất cả các chuỗi được trích dẫn kép chính xác, dấu phẩy được đặt đúng giữa các phần tử và thuộc tính đối tượng, tất cả các dấu ngoặc nhọn ({}) và dấu ngoặc vuông ([]) đều được khớp và đóng đúng cách. Không có từ hoặc ký tự thừa nào trong cấu trúc mảng JSON, chỉ có các đối tượng JSON hợp lệ được phân tách bằng dấu phẩy.
`;
  }
  
  let jsonStr = ""; 
  let retries = 0;

  while (retries <= MAX_QUESTION_GENERATION_RETRIES) {
    try {
      const response: GenerateContentResponse = await currentAi.models.generateContent({
        model: GEMINI_API_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      let parsedQuestionDataArray = JSON.parse(jsonStr) as RawQuestionData[];

      if (!Array.isArray(parsedQuestionDataArray)) {
          console.error(`Generated data is not an array. Received:`, parsedQuestionDataArray);
          throw new Error("Generated data format incorrect (not an array).");
      }

      if (parsedQuestionDataArray.length > numberOfQuestionsToGenerate) {
        console.warn(`Gemini API returned ${parsedQuestionDataArray.length} questions, expected ${numberOfQuestionsToGenerate}. Slicing to the required number.`);
        parsedQuestionDataArray = parsedQuestionDataArray.slice(0, numberOfQuestionsToGenerate);
      }
      
      if (parsedQuestionDataArray.length !== numberOfQuestionsToGenerate) {
        console.error(`Generated data array does not contain exactly ${numberOfQuestionsToGenerate} questions. Received ${parsedQuestionDataArray.length} questions. Content:`, parsedQuestionDataArray);
        throw new Error(`Generated data format incorrect (expected ${numberOfQuestionsToGenerate} questions, got ${parsedQuestionDataArray.length}).`);
      }
      
      const processedQuestions: Question[] = [];
      for (const rawQ of parsedQuestionDataArray) {
        if (
          !rawQ.text ||
          typeof rawQ.text !== 'string' ||
          !rawQ.topic ||
          typeof rawQ.topic !== 'string' ||
          !Array.isArray(rawQ.options) ||
          rawQ.options.length === 0 || 
          !rawQ.options.every(opt => typeof opt === 'string') ||
          !rawQ.correctAnswer ||
          typeof rawQ.correctAnswer !== 'string' ||
          !rawQ.options.includes(rawQ.correctAnswer)
        ) {
          console.error("A generated question in the array is malformed or has incorrect types:", rawQ, "Original JSON string:", jsonStr);
          throw new Error("Malformed question data or incorrect types within the array."); 
        }
        processedQuestions.push({
          id: uuidv4(),
          text: rawQ.text,
          targetGradeLevel: targetGradeLevel,
          topic: rawQ.topic,
          type: QuestionType.MULTIPLE_CHOICE,
          options: rawQ.options,
          correctAnswer: rawQ.correctAnswer,
          islandName: islandName, 
          islandId: islandId, 
        });
      }
      
      return processedQuestions; 

    } catch (error) {
      console.error(`Error generating question set (attempt ${retries + 1}/${MAX_QUESTION_GENERATION_RETRIES + 1}, difficulty ${difficultyName}, island ${islandName}) from Gemini API:`, error);
      
      let isRateLimitError = false;
      let isApiKeyError = false;
      let isJsonParseOrFormatError = false;

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes("429") || errorMessage.includes("resource_exhausted") || errorMessage.includes("rate limit") || errorMessage.includes("quota")) {
          isRateLimitError = true;
        }
        if (errorMessage.includes('api key not valid') || errorMessage.includes('api_key_invalid')) {
          isApiKeyError = true;
        }
        if ((error instanceof SyntaxError && errorMessage.includes('json')) || errorMessage.includes('json parse error') || errorMessage.includes('unexpected token')) {
            isJsonParseOrFormatError = true;
            console.error("Failed to parse JSON. Raw response from API may have been:", jsonStr);
        } else if (errorMessage.includes("malformed") || errorMessage.includes("format incorrect") || errorMessage.includes("incorrect types")) {
            isJsonParseOrFormatError = true; 
            console.error("JSON content format/type error or incorrect number of questions. Raw response from API may have been:", jsonStr);
        }
      } else if (typeof error === 'object' && error !== null) { 
        const errorString = String(error).toLowerCase();
         if (errorString.includes("429") || errorString.includes("resource_exhausted") || errorString.includes("rate limit") || errorString.includes("quota")) {
          isRateLimitError = true;
        }
      }

      if (isApiKeyError) {
        console.error("API Key is invalid. No retries will be attempted.");
        return null; 
      }

      if (isRateLimitError || isJsonParseOrFormatError) {
        if (retries < MAX_QUESTION_GENERATION_RETRIES) {
          const backoffDelay = INITIAL_RETRY_DELAY_MS * Math.pow(2, retries);
          console.log(`Retrying in ${backoffDelay}ms... (Reason: ${isRateLimitError ? "Rate Limit" : "JSON/Format/Content Error"})`);
          await delay(backoffDelay);
          retries++;
        } else {
          console.error(`Max retries (${MAX_QUESTION_GENERATION_RETRIES}) reached for ${isRateLimitError ? "Rate Limit" : "JSON/Format/Content Error"}. Question set generation failed for ${islandName} (${difficultyName}).`);
          return null; 
        }
      } else {
        console.error("Unhandled or non-retryable error during question set generation.", error);
        return null; 
      }
    }
  }
  console.error(`Exited retry loop without success or explicit failure for ${islandName} (${difficultyName}). Question set generation failed.`);
  return null; 
};

export const getMathHint = async (questionText: string, studentTargetGrade: GradeLevel): Promise<string> => {
  const currentAi = initializeAi();
  if (!currentAi) {
    return API_KEY_ERROR_MESSAGE;
  }
  
  const gradeDescription = GRADE_LEVEL_TEXT_MAP[studentTargetGrade] || `cấp độ ${studentTargetGrade}`;

  const prompt = `Bạn là Thần Toán Học, một vị thần toán học thân thiện và thông thái, đang giúp đỡ một học sinh có trình độ tương đương ${gradeDescription}.
Học sinh này đang gặp khó khăn với câu hỏi toán sau: "${questionText}".
Hãy đưa ra một gợi ý thật ngắn gọn (tối đa 2 câu), đơn giản, khích lệ (bằng tiếng Việt) để giúp em ấy suy nghĩ đúng hướng giải quyết bài toán.
Quan trọng: KHÔNG được tiết lộ trực tiếp đáp án hoặc các bước giải chi tiết. Chỉ gợi mở suy nghĩ.
Ví dụ gợi ý tốt: "Thử nghĩ xem phép tính nào phù hợp nhỉ?" hoặc "Để ý kỹ các con số xem có mối liên hệ gì không nhé!".
Chỉ trả về phần văn bản gợi ý, không thêm bất kỳ lời chào hay giải thích nào khác.`;

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_API_MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    const hintText = response.text.trim();
    return hintText || HINT_UNAVAILABLE_MESSAGE;
  } catch (error) {
    console.error("Error fetching hint from Gemini API:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
        return HINT_API_KEY_ERROR_MESSAGE;
    }
    if (error instanceof Error && (error.message.toLowerCase().includes("429") || error.message.toLowerCase().includes("resource_exhausted"))) {
        return "Thần Toán Học đang hơi quá tải, vui lòng thử lại sau chút nhé!";
    }
    return HINT_GENERATION_ERROR_MESSAGE;
  }
};

export const generateEndlessMathQuestions = async (
  targetGradeLevel: GradeLevel,
  difficultyLevel: number
): Promise<Question[] | null> => {
  const currentAi = initializeAi();
  if (!currentAi) {
    console.error(API_KEY_ERROR_MESSAGE);
    return null;
  }

  const gradeDescription = GRADE_LEVEL_TEXT_MAP[targetGradeLevel] || `cấp độ ${targetGradeLevel}`;
  
  const gradeIslands = ISLAND_CONFIGS.filter(island => island.targetGradeLevel === targetGradeLevel);
  const allTopicsForGrade = [...new Set(gradeIslands.flatMap(island => island.topics))];
  
  let topicInstruction = "";
  if (allTopicsForGrade.length > 0) {
    topicInstruction = `Các câu hỏi phải bao quát toàn bộ kiến thức của ${gradeDescription}, ngẫu nhiên trong các chủ đề như: ${allTopicsForGrade.slice(0, 5).join(', ')}, và các chủ đề khác thuộc chương trình lớp học.`;
  } else {
    topicInstruction = `Các câu hỏi phải phù hợp với toàn bộ chương trình học chung của ${gradeDescription}.`;
  }

  let difficultyDescription = "";
  switch (true) {
      case difficultyLevel <= 2:
          difficultyDescription = "Cực kỳ dễ, dành cho người mới bắt đầu, thường chỉ có một bước tính toán với các số rất nhỏ.";
          break;
      case difficultyLevel <= 4:
          difficultyDescription = "Dễ đến trung bình, phù hợp với trình độ chuẩn của học sinh lớp này, có thể có 1-2 bước tính đơn giản.";
          break;
      case difficultyLevel <= 6:
          difficultyDescription = "Khá thử thách, yêu cầu 2-3 bước suy luận, có thể là toán đố hoặc làm việc với số lớn hơn.";
          break;
      case difficultyLevel <= 8:
          difficultyDescription = "Khó, là các bài toán đố phức tạp, yêu cầu tư duy logic, kết hợp nhiều kiến thức.";
          break;
      case difficultyLevel <= 10:
          difficultyDescription = "Rất khó và lắt léo, đòi hỏi tư duy sáng tạo, có thể là các dạng toán lạ hoặc có yếu tố gây nhiễu để thử thách học sinh giỏi.";
          break;
  }


  const prompt = `Bạn là một giáo viên tiểu học chuyên ra đề toán bằng tiếng Việt cho Chế Độ Vô Tận.
Học sinh đang chơi ở trình độ ${gradeDescription}.
${topicInstruction}

Bạn cần tạo một BỘ GỒM CHÍNH XÁC ${ENDLESS_QUESTIONS_BATCH_SIZE} CÂU HỎI toán trắc nghiệm. Các câu hỏi này phải được trả về dưới dạng một MẢNG JSON.
Độ khó của các câu hỏi trong bộ này phải tương đối đồng đều và phù hợp với độ khó được mô tả là: "${difficultyDescription}" (Cấp độ ${difficultyLevel}/10).
Mỗi câu hỏi phải hoàn toàn dựa trên văn bản, không yêu cầu hình ảnh, và có 4 lựa chọn đáp án.

YÊU CẦU QUAN TRỌNG:
- Câu hỏi phải bao quát toàn bộ kiến thức của ${gradeDescription}.
- Độ khó nhất quán ở mức đã mô tả.
- Vui vẻ, thú vị, nhưng vẫn đảm bảo tính học thuật.
- Ngắn gọn, dễ hiểu.

Định dạng JSON cho MỖI câu hỏi trong mảng (PHẢI TUÂN THỦ NGHIÊM NGẶT):
Mỗi đối tượng câu hỏi trong mảng phải có các thuộc tính sau và CHỈ những thuộc tính này:
- "text": Nội dung câu hỏi (string).
- "topic": Chủ đề chính của câu hỏi (string, ví dụ: "Phép nhân", "Hình học", "Toán đố").
- "options": Một mảng gồm ĐÚNG 4 chuỗi là các lựa chọn đáp án (string[]).
- "correctAnswer": Chuỗi đáp án đúng (string), phải là một trong các giá trị của "options".
LƯU Ý: KHÔNG được thêm bất kỳ trường nào khác.

Ví dụ cấu trúc MẢNG JSON mong muốn (chứa 2 câu hỏi mẫu, bạn cần tạo ${ENDLESS_QUESTIONS_BATCH_SIZE}):
[
  {
    "text": "Một cửa hàng có 5 hộp bánh, mỗi hộp có 8 cái bánh. Hỏi cửa hàng có tất cả bao nhiêu cái bánh?",
    "topic": "Phép nhân",
    "options": ["30 cái", "35 cái", "40 cái", "45 cái"],
    "correctAnswer": "40 cái"
  },
  {
    "text": "Hình vuông có cạnh 7cm. Chu vi hình vuông đó là bao nhiêu?",
    "topic": "Hình học - Chu vi",
    "options": ["14cm", "21cm", "28cm", "35cm"],
    "correctAnswer": "28cm"
  }
  // ... (Thêm các câu hỏi khác cho đủ CHÍNH XÁC ${ENDLESS_QUESTIONS_BATCH_SIZE} câu)
]

HƯỚNG DẪN CỰC KỲ QUAN TRỌNG VỀ ĐỊNH DẠNG ĐẦU RA:
- Chỉ trả về duy nhất MẢNG JSON, bắt đầu bằng '[' và kết thúc bằng ']'. Không có bất kỳ văn bản, giải thích, hay ký tự nào khác bao quanh hay nằm ngoài mảng JSON.
- Mảng JSON PHẢI chứa ĐÚNG ${ENDLESS_QUESTIONS_BATCH_SIZE} đối tượng câu hỏi.
- Nội dung câu hỏi, chủ đề, và các lựa chọn phải hoàn toàn bằng tiếng Việt.
- Đảm bảo "correctAnswer" là một trong "options".
- Cẩn thận với cú pháp JSON.
`;

  let jsonStr = "";
  let retries = 0;

  while (retries <= MAX_QUESTION_GENERATION_RETRIES) {
    try {
      const response: GenerateContentResponse = await currentAi.models.generateContent({
        model: GEMINI_API_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      let parsedQuestionDataArray = JSON.parse(jsonStr) as RawQuestionData[];

      if (!Array.isArray(parsedQuestionDataArray)) {
        throw new Error("Generated data is not an array.");
      }
      
      if (parsedQuestionDataArray.length > ENDLESS_QUESTIONS_BATCH_SIZE) {
        parsedQuestionDataArray = parsedQuestionDataArray.slice(0, ENDLESS_QUESTIONS_BATCH_SIZE);
      }

      if (parsedQuestionDataArray.length !== ENDLESS_QUESTIONS_BATCH_SIZE) {
        throw new Error(`Generated data array does not contain exactly ${ENDLESS_QUESTIONS_BATCH_SIZE} questions. Got ${parsedQuestionDataArray.length}.`);
      }
      
      const processedQuestions: Question[] = [];
      for (const rawQ of parsedQuestionDataArray) {
        if (
          !rawQ.text || typeof rawQ.text !== 'string' ||
          !rawQ.topic || typeof rawQ.topic !== 'string' ||
          !Array.isArray(rawQ.options) || rawQ.options.length !== 4 || 
          !rawQ.options.every(opt => typeof opt === 'string') ||
          !rawQ.correctAnswer || typeof rawQ.correctAnswer !== 'string' ||
          !rawQ.options.includes(rawQ.correctAnswer)
        ) {
          console.error("A generated endless question is malformed:", rawQ);
          throw new Error("Malformed endless question data.");
        }
        processedQuestions.push({
          id: uuidv4(),
          text: rawQ.text,
          targetGradeLevel: targetGradeLevel,
          topic: rawQ.topic,
          type: QuestionType.MULTIPLE_CHOICE,
          options: rawQ.options,
          correctAnswer: rawQ.correctAnswer,
          islandName: `Endless Mode - ${GRADE_LEVEL_TEXT_MAP[targetGradeLevel]}`,
          islandId: `endless_${targetGradeLevel}`,
        });
      }
      return processedQuestions;

    } catch (error) {
      console.error(`Error generating endless question set (attempt ${retries + 1}/${MAX_QUESTION_GENERATION_RETRIES + 1}, grade ${gradeDescription}, difficultyLevel ${difficultyLevel}):`, error);
      let isRateLimitError = false;
      let isApiKeyError = false;
      let isJsonParseOrFormatError = false;

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes("429") || errorMessage.includes("resource_exhausted") || errorMessage.includes("rate limit") || errorMessage.includes("quota")) isRateLimitError = true;
        if (errorMessage.includes('api key not valid') || errorMessage.includes('api_key_invalid')) isApiKeyError = true;
        if ((error instanceof SyntaxError && errorMessage.includes('json')) || errorMessage.includes('json parse error') || errorMessage.includes('unexpected token') || errorMessage.includes("malformed") || errorMessage.includes("format incorrect") || errorMessage.includes("incorrect types")) isJsonParseOrFormatError = true;
      } else if (typeof error === 'object' && error !== null) {
        const errorString = String(error).toLowerCase();
        if (errorString.includes("429") || errorString.includes("resource_exhausted")) isRateLimitError = true;
      }

      if (isApiKeyError) {
        console.error("API Key is invalid for endless mode. No retries.");
        return null;
      }
      if (isRateLimitError || isJsonParseOrFormatError) {
        if (retries < MAX_QUESTION_GENERATION_RETRIES) {
          const backoffDelay = INITIAL_RETRY_DELAY_MS * Math.pow(2, retries);
          await delay(backoffDelay);
          retries++;
        } else {
          console.error(`Max retries reached for endless mode. Failed for grade ${gradeDescription}.`);
          return null;
        }
      } else {
        return null;
      }
    }
  }
  return null;
};