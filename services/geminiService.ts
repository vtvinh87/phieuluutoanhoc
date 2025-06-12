
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
    QUESTIONS_PER_ISLAND
} from '../constants';
import { GradeLevel, Question, QuestionType, IslandDifficulty } from "../types";
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

// Utility function to introduce a delay
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
  let topicInstruction = "";

  if (topics && topics.length > 0) {
    topicInstruction = `Các câu hỏi nên tập trung vào các chủ đề sau: ${topics.join(', ')}.`;
  } else {
    topicInstruction = `Các câu hỏi nên phù hợp với chương trình học chung của ${gradeDescription}.`;
  }

  const prompt = `Bạn là một giáo viên tiểu học chuyên ra đề toán bằng tiếng Việt, có khả năng sáng tạo những câu hỏi vừa thử thách vừa thú vị cho học sinh trình độ ${gradeDescription}.
Hòn đảo hiện tại là: "${islandName}".
${topicInstruction}

Bạn cần tạo một BỘ GỒM CHÍNH XÁC ${QUESTIONS_PER_ISLAND} CÂU HỎI toán trắc nghiệm. ${QUESTIONS_PER_ISLAND} câu hỏi này phải được trả về dưới dạng một MẢNG JSON (JSON array), trong đó mỗi phần tử của mảng là một đối tượng JSON đại diện cho một câu hỏi.
Mỗi câu hỏi phải hoàn toàn dựa trên văn bản, không yêu cầu hình ảnh, và có 4 lựa chọn đáp án.

YÊU CẦU QUAN TRỌNG VỀ ĐỘ KHÓ CỦA CÁC CÂU HỎI TRONG BỘ ${QUESTIONS_PER_ISLAND} CÂU:
Độ khó tổng thể của hòn đảo này được chọn là: "${difficultyName}".
Trong bộ ${QUESTIONS_PER_ISLAND} câu hỏi này (đánh số từ 0 đến ${QUESTIONS_PER_ISLAND - 1} theo vị trí trong mảng), độ khó của các câu hỏi phải tăng dần một cách hợp lý, phù hợp với độ khó tổng thể "${difficultyName}" của hòn đảo.
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
  - Đây PHẢI là câu thử thách NHẤT trong bộ ${QUESTIONS_PER_ISLAND} câu này.
  - "Dễ": Khó nhất trong ${QUESTIONS_PER_ISLAND} câu dễ, có thể yêu cầu suy luận đơn giản.
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

Ví dụ cấu trúc MẢNG JSON mong muốn (chứa 2 câu hỏi mẫu, bạn cần tạo ${QUESTIONS_PER_ISLAND}):
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
  // ... (Thêm các câu hỏi khác cho đủ CHÍNH XÁC ${QUESTIONS_PER_ISLAND} câu)
]

HƯỚNG DẪN CỰC KỲ QUAN TRỌNG VỀ ĐỊNH DẠNG ĐẦU RA:
- Chỉ trả về duy nhất MẢNG JSON, bắt đầu bằng ký tự '[' và kết thúc bằng ký tự ']'. Không có bất kỳ văn bản, giải thích, hay ký tự nào khác bao quanh hay nằm ngoài mảng JSON.
- Mảng JSON PHẢI chứa ĐÚNG ${QUESTIONS_PER_ISLAND} đối tượng câu hỏi. Không ít hơn, không nhiều hơn.
- Nội dung câu hỏi, chủ đề, và các lựa chọn phải hoàn toàn bằng tiếng Việt.
- Đảm bảo "correctAnswer" của mỗi câu là một trong các giá trị trong mảng "options" của câu đó.
- Hãy cực kỳ cẩn thận với cú pháp JSON: đảm bảo tất cả các chuỗi được trích dẫn kép chính xác, dấu phẩy được đặt đúng giữa các phần tử và thuộc tính đối tượng, tất cả các dấu ngoặc nhọn ({}) và dấu ngoặc vuông ([]) đều được khớp và đóng đúng cách. Không có từ hoặc ký tự thừa nào trong cấu trúc mảng JSON, chỉ có các đối tượng JSON hợp lệ được phân tách bằng dấu phẩy.
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
          // temperature: 0.7, // Adjust if needed for creativity vs. precision
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

      if (parsedQuestionDataArray.length > QUESTIONS_PER_ISLAND) {
        console.warn(`Gemini API returned ${parsedQuestionDataArray.length} questions, expected ${QUESTIONS_PER_ISLAND}. Slicing to the required number.`);
        parsedQuestionDataArray = parsedQuestionDataArray.slice(0, QUESTIONS_PER_ISLAND);
      }
      
      if (parsedQuestionDataArray.length !== QUESTIONS_PER_ISLAND) {
        console.error(`Generated data array does not contain exactly ${QUESTIONS_PER_ISLAND} questions. Received ${parsedQuestionDataArray.length} questions. Content:`, parsedQuestionDataArray);
        throw new Error(`Generated data format incorrect (expected ${QUESTIONS_PER_ISLAND} questions, got ${parsedQuestionDataArray.length}).`);
      }
      
      const processedQuestions: Question[] = [];
      for (const rawQ of parsedQuestionDataArray) {
        if (
          !rawQ.text ||
          typeof rawQ.text !== 'string' ||
          !rawQ.topic ||
          typeof rawQ.topic !== 'string' ||
          !Array.isArray(rawQ.options) ||
          rawQ.options.length === 0 || // Typically should be 4, but at least 1
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
      
      return processedQuestions; // Success

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
        // Check for specific JSON parsing errors or general format issues from our validation
        if ((error instanceof SyntaxError && errorMessage.includes('json')) || errorMessage.includes('json parse error') || errorMessage.includes('unexpected token')) {
            isJsonParseOrFormatError = true;
            console.error("Failed to parse JSON. Raw response from API may have been:", jsonStr);
        } else if (errorMessage.includes("malformed") || errorMessage.includes("format incorrect") || errorMessage.includes("incorrect types")) {
            isJsonParseOrFormatError = true; // Our custom validation errors also fall here for retry
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
        // For other types of errors not specifically handled for retry (e.g., network issues not caught as 429, unexpected server errors)
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
