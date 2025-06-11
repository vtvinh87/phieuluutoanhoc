
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
    ISLAND_CONFIGS 
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

const MAX_QUESTION_GENERATION_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 2000; // Start with 2 seconds

export const generateMathQuestion = async (
  targetGradeLevel: GradeLevel, 
  topics: string[],
  islandName: string, 
  islandId: string, 
  questionIndexInIsland: number, // 0-4
  difficulty: IslandDifficulty
): Promise<Question | null> => {
  const currentAi = initializeAi();
  if (!currentAi) {
    console.error(API_KEY_ERROR_MESSAGE);
    return null;
  }

  const gradeDescription = GRADE_LEVEL_TEXT_MAP[targetGradeLevel] || `cấp độ ${targetGradeLevel}`;
  const difficultyName = ISLAND_DIFFICULTY_TEXT_MAP[difficulty];
  let topicInstruction = "";

  if (topics && topics.length > 0) {
    topicInstruction = `Câu hỏi nên tập trung vào các chủ đề sau: ${topics.join(', ')}.`;
  } else {
    topicInstruction = `Câu hỏi nên phù hợp với chương trình học chung của ${gradeDescription}.`;
  }

  const prompt = `Bạn là một giáo viên tiểu học chuyên ra đề toán bằng tiếng Việt, có khả năng sáng tạo những câu hỏi vừa thử thách vừa thú vị cho học sinh trình độ ${gradeDescription}.
Hòn đảo hiện tại là: "${islandName}".
${topicInstruction}

Bạn cần tạo một câu hỏi toán trắc nghiệm. Câu hỏi phải hoàn toàn dựa trên văn bản, không yêu cầu hình ảnh, và có 4 lựa chọn đáp án.

YÊU CẦU QUAN TRỌNG VỀ ĐỘ KHÓ CỦA CÂU HỎI:
Trong một hòn đảo, sẽ có 5 câu hỏi (đánh số từ 0 đến 4). Độ khó của các câu hỏi này phải tăng dần.
- Độ khó của hòn đảo này được chọn là: "${difficultyName}".
- Đây là câu hỏi thứ ${questionIndexInIsland + 1} trong số 5 câu (chỉ số ${questionIndexInIsland}).

Hướng dẫn tạo câu hỏi dựa trên chỉ số và độ khó đã chọn:
- Câu hỏi ${questionIndexInIsland} (0 là câu đầu tiên, 4 là câu cuối cùng):
  - Nếu chỉ số câu hỏi là 0 (câu đầu tiên):
    - Khi độ khó là "Dễ": Tạo một câu hỏi rất cơ bản, một bước tính, sử dụng số nhỏ, dễ hiểu.
    - Khi độ khó là "Trung Bình": Tạo một câu hỏi cơ bản, có thể một hoặc hai bước tính đơn giản, từ ngữ rõ ràng.
    - Khi độ khó là "Khó": Tạo một câu hỏi hơi phức tạp hơn một chút so với mức "Trung Bình", có thể yêu cầu hai bước tính, hoặc giới thiệu một khái niệm hơi nâng cao hơn một chút cho cấp lớp nhưng vẫn trong phạm vi chủ đề.
  - Nếu chỉ số câu hỏi là 1, 2, hoặc 3:
    - Hãy tăng dần độ phức tạp so với câu hỏi có chỉ số ${questionIndexInIsland > 0 ? questionIndexInIsland -1 : 0} trước đó, nhưng vẫn phải phù hợp với độ khó "${difficultyName}" của hòn đảo.
    - Khi độ khó là "Dễ": Tăng độ khó rất nhẹ, vẫn tập trung vào các khái niệm cốt lõi, có thể thay đổi số liệu hoặc tình huống một chút.
    - Khi độ khó là "Trung Bình": Thêm một chút thử thách, có thể là số lớn hơn, nhiều bước tính hơn một chút, hoặc một dạng bài biến thể nhẹ nhàng.
    - Khi độ khó là "Khó": Câu hỏi có thể yêu cầu nhiều bước tính hơn, hoặc kết hợp các khái niệm đơn giản một cách thông minh, hoặc có yếu tố gây nhiễu nhẹ để thử thách sự cẩn thận.
  - Nếu chỉ số câu hỏi là 4 (câu cuối cùng):
    - Đây PHẢI là câu hỏi thử thách NHẤT của hòn đảo này.
    - Khi độ khó là "Dễ": Vẫn là câu hỏi ở mức độ dễ nhưng là câu khó nhất trong 5 câu dễ của đảo này. Có thể yêu cầu một chút suy luận đơn giản hoặc áp dụng kiến thức một cách hơi khác biệt.
    - Khi độ khó là "Trung Bình": Câu hỏi yêu cầu tư duy logic tốt, có thể là bài toán đố nhiều bước, hoặc cần áp dụng kiến thức một cách sáng tạo và thông minh.
    - Khi độ khó là "Khó": Câu hỏi PHẢI RẤT phức tạp, yêu cầu tư duy logic sâu sắc. Đây có thể là dạng toán lạ, hoặc kết hợp nhiều kiến thức một cách không tường minh, đòi hỏi học sinh phải phân tích kỹ đề bài và vận dụng nhiều kỹ năng.

Yêu cầu về tính chất câu hỏi (áp dụng cho tất cả các câu):
- Câu hỏi cần phải vui vẻ, thú vị và hấp dẫn, lôi cuốn học sinh.
- Câu hỏi nên kích thích tư duy, thử thách trí tuệ một cách vừa phải (theo độ khó đã mô tả ở trên).
- Khi học sinh giải được, câu hỏi nên mang lại cảm giác thành tựu và đáng giá.
- Nếu có thể, hãy thêm một chút yếu tố bất ngờ, mới lạ hoặc một cách tiếp cận độc đáo trong câu hỏi, nhưng vẫn đảm bảo phù hợp với trình độ và chủ đề. Câu hỏi phải ngắn gọn, dễ hiểu, tránh dài dòng.

Hãy cung cấp câu hỏi dưới dạng một đối tượng JSON. Đối tượng JSON phải có các thuộc tính sau:
- "text": Nội dung câu hỏi (string). Câu hỏi phải ngắn gọn và rõ ràng.
- "topic": Chủ đề chính của câu hỏi (string, ví dụ: "Phép cộng", "Hình học", "Toán đố logic").
- "options": Một mảng gồm 4 chuỗi là các lựa chọn đáp án (string[]).
- "correctAnswer": Chuỗi đáp án đúng, phải là một trong các giá trị của mảng "options" (string).

Ví dụ cấu trúc JSON mong muốn:
{
  "text": "Trên Đảo Kỳ Bí, có 3 con khỉ đang giữ kho báu. Mỗi con khỉ có 2 quả chuối. Hỏi tổng cộng có bao nhiêu quả chuối?",
  "topic": "Phép nhân cơ bản",
  "options": ["4 quả chuối", "5 quả chuối", "6 quả chuối", "7 quả chuối"],
  "correctAnswer": "6 quả chuối"
}

Hãy cực kỳ cẩn thận để đảm bảo rằng đối tượng JSON bạn trả về là hoàn toàn hợp lệ, đặc biệt là cú pháp của các mảng (ví dụ: mảng 'options' phải có dấu phẩy giữa các phần tử và được bao bởi dấu ngoặc vuông).

Lưu ý quan trọng:
- Chỉ trả về duy nhất đối tượng JSON, không có bất kỳ văn bản nào khác bao quanh hay giải thích thêm.
- Nội dung câu hỏi, chủ đề, và các lựa chọn phải hoàn toàn bằng tiếng Việt.
- Đảm bảo câu hỏi phù hợp với trình độ học sinh ${gradeDescription}, các chủ đề được yêu cầu, và đặc biệt là chỉ số câu hỏi và độ khó "${difficultyName}" của hòn đảo.
- Đảm bảo "correctAnswer" là một trong các giá trị trong mảng "options".
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

      const parsedQuestionData = JSON.parse(jsonStr);

      if (
        !parsedQuestionData.text ||
        !parsedQuestionData.topic ||
        !Array.isArray(parsedQuestionData.options) ||
        parsedQuestionData.options.length === 0 || 
        !parsedQuestionData.correctAnswer ||
        !parsedQuestionData.options.includes(parsedQuestionData.correctAnswer)
      ) {
        console.error("Generated question data is malformed after successful parse:", parsedQuestionData, "Original JSON string:", jsonStr);
        return null; // Malformed content, unlikely a retry will fix the content schema itself.
      }
      
      const newQuestion: Question = {
        id: uuidv4(),
        text: parsedQuestionData.text,
        targetGradeLevel: targetGradeLevel,
        topic: parsedQuestionData.topic,
        type: QuestionType.MULTIPLE_CHOICE,
        options: parsedQuestionData.options,
        correctAnswer: parsedQuestionData.correctAnswer,
        islandName: islandName,
        islandId: islandId, 
      };
      return newQuestion; // Success

    } catch (error) {
      console.error(`Error generating question (attempt ${retries + 1}/${MAX_QUESTION_GENERATION_RETRIES + 1}, index ${questionIndexInIsland}, difficulty ${difficultyName}, island ${islandName}) from Gemini API:`, error);
      
      let isRateLimitError = false;
      let isApiKeyError = false;
      let isJsonParseError = false;

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes("429") || errorMessage.includes("resource_exhausted") || errorMessage.includes("rate limit") || errorMessage.includes("quota")) {
          isRateLimitError = true;
        }
        if (errorMessage.includes('api key not valid') || errorMessage.includes('api_key_invalid')) {
          isApiKeyError = true;
        }
        // Check for JSON parsing error specifically
        if (error instanceof SyntaxError && errorMessage.includes('json')) { // SyntaxError is typical for JSON.parse failures
            isJsonParseError = true;
            console.error("Failed to parse JSON. Raw response from API may have been:", jsonStr);
        } else if (errorMessage.includes('json') || errorMessage.includes('unexpected token')) { // Broader check
            isJsonParseError = true;
            console.error("Failed to parse JSON. Raw response from API may have been:", jsonStr);
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

      // Retry for rate limit errors or JSON parsing errors (which might be transient)
      if (isRateLimitError || isJsonParseError) {
        if (retries < MAX_QUESTION_GENERATION_RETRIES) {
          const backoffDelay = INITIAL_RETRY_DELAY_MS * Math.pow(2, retries);
          console.log(`Retrying in ${backoffDelay}ms... (Reason: ${isRateLimitError ? "Rate Limit" : "JSON Parse Error"})`);
          await delay(backoffDelay);
          retries++;
          // continue to next iteration of the while loop
        } else {
          console.error(`Max retries (${MAX_QUESTION_GENERATION_RETRIES}) reached for ${isRateLimitError ? "Rate Limit" : "JSON Parse Error"}. Question generation failed.`);
          return null; 
        }
      } else {
        console.error("Non-retryable error or unhandled error structure during question generation.");
        return null; 
      }
    }
  }
  console.error("Exited retry loop without success or explicit failure. Question generation failed.");
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
Ví dụ gợi ý tốt: "Thử nghĩ xem phép tính nào phù hợp nhỉ?" hoặc "Để ý kỹ các con số xem có mối liên hệ gì không nhé!".`;

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_API_MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text.trim() || HINT_UNAVAILABLE_MESSAGE;
  } catch (error) {
    console.error("Error fetching hint from Gemini API:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
        return HINT_API_KEY_ERROR_MESSAGE;
    }
    // Check for rate limit error in hints as well, though less critical than question gen
    if (error instanceof Error && (error.message.toLowerCase().includes("429") || error.message.toLowerCase().includes("resource_exhausted"))) {
        return "Thần Toán Học đang hơi quá tải, vui lòng thử lại sau chút nhé!";
    }
    return HINT_GENERATION_ERROR_MESSAGE;
  }
};
