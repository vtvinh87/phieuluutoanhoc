
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
    GEMINI_API_MODEL,
    API_KEY_ERROR_MESSAGE,
    QUESTION_GENERATION_ERROR_MESSAGE,
    HINT_GENERATION_ERROR_MESSAGE,
    HINT_API_KEY_ERROR_MESSAGE,
    HINT_UNAVAILABLE_MESSAGE,
    GRADE_LEVEL_TEXT_MAP,
    ISLAND_CONFIGS 
} from '../constants';
import { GradeLevel, Question, QuestionType } from "../types";
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

export const generateMathQuestion = async (
  targetGradeLevel: GradeLevel, 
  topics: string[],
  islandName?: string,
  islandId?: string 
): Promise<Question | null> => {
  const currentAi = initializeAi();
  if (!currentAi) {
    console.error(API_KEY_ERROR_MESSAGE);
    return null;
  }

  const gradeDescription = GRADE_LEVEL_TEXT_MAP[targetGradeLevel] || `cấp độ ${targetGradeLevel}`;
  let topicInstruction = "";

  if (topics && topics.length > 0) {
    topicInstruction = `Câu hỏi nên tập trung vào các chủ đề sau: ${topics.join(', ')}.`;
  } else {
    topicInstruction = `Câu hỏi nên phù hợp với chương trình học chung của ${gradeDescription}.`;
  }

  const prompt = `Bạn là một giáo viên tiểu học chuyên ra đề toán bằng tiếng Việt, có khả năng sáng tạo những câu hỏi vừa thử thách vừa thú vị.
Hãy tạo một câu hỏi toán trắc nghiệm cho học sinh trình độ tương đương ${gradeDescription}.
${topicInstruction}
Câu hỏi nên có 4 lựa chọn đáp án. Câu hỏi phải hoàn toàn dựa trên văn bản, không yêu cầu hình ảnh.

Yêu cầu về tính chất câu hỏi:
- Câu hỏi cần phải vui vẻ, thú vị và hấp dẫn, lôi cuốn học sinh.
- Câu hỏi nên kích thích tư duy, thử thách trí tuệ một cách vừa phải, không quá dễ cũng không quá khó.
- Khi học sinh giải được, câu hỏi nên mang lại cảm giác thành tựu và đáng giá.
- Nếu có thể, hãy thêm một chút yếu tố bất ngờ, mới lạ hoặc một cách tiếp cận độc đáo trong câu hỏi, nhưng vẫn đảm bảo phù hợp với trình độ và chủ đề.

Hãy cung cấp câu hỏi dưới dạng một đối tượng JSON. Đối tượng JSON phải có các thuộc tính sau:
- "text": Nội dung câu hỏi (string).
- "topic": Chủ đề chính của câu hỏi (string, ví dụ: "Phép cộng", "Hình học", "Toán đố").
- "options": Một mảng gồm 4 chuỗi là các lựa chọn đáp án (string[]).
- "correctAnswer": Chuỗi đáp án đúng, phải là một trong các giá trị của mảng "options" (string).

Ví dụ cấu trúc JSON mong muốn:
{
  "text": "Trong một cuộc đua thuyền rồng trên Đảo Kho Báu, thuyền của Thuyền Trưởng Mắt Cú có 5 tay chèo, thuyền của Hải Tặc Râu Bạc có nhiều hơn thuyền Thuyền Trưởng Mắt Cú 3 tay chèo. Hỏi thuyền Hải Tặc Râu Bạc có bao nhiêu tay chèo?",
  "topic": "Toán đố vui",
  "options": ["6 tay chèo", "7 tay chèo", "8 tay chèo", "9 tay chèo"],
  "correctAnswer": "8 tay chèo"
}

Lưu ý quan trọng:
- Chỉ trả về duy nhất đối tượng JSON, không có bất kỳ văn bản nào khác bao quanh hay giải thích thêm.
- Nội dung câu hỏi, chủ đề, và các lựa chọn phải hoàn toàn bằng tiếng Việt.
- Đảm bảo câu hỏi phù hợp với trình độ học sinh ${gradeDescription} và các chủ đề được yêu cầu.
- Đảm bảo "correctAnswer" là một trong các giá trị trong mảng "options".
`;

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_API_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
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
      console.error("Generated question data is malformed:", parsedQuestionData);
      return null;
    }
    
    const newQuestion: Question = {
      id: uuidv4(),
      text: parsedQuestionData.text,
      targetGradeLevel: targetGradeLevel,
      topic: parsedQuestionData.topic,
      type: QuestionType.MULTIPLE_CHOICE,
      options: parsedQuestionData.options,
      correctAnswer: parsedQuestionData.correctAnswer,
      // image property will be undefined
      islandName: islandName,
      islandId: islandId, 
    };
    return newQuestion;

  } catch (error) {
    console.error("Error generating question from Gemini API:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
        return null; 
    }
    return null;
  }
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
    return HINT_GENERATION_ERROR_MESSAGE;
  }
};