"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const inference_1 = require("@huggingface/inference");
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
class AIService {
    constructor() {
        this.hf = new inference_1.HfInference(config_1.config.ai.huggingFaceApiKey);
    }
    async generateImage(prompt) {
        try {
            const result = await this.hf.textToImage({
                model: 'stabilityai/stable-diffusion-2',
                inputs: prompt,
                parameters: {
                    negative_prompt: 'blurry, bad quality, nsfw',
                    num_inference_steps: 30,
                    guidance_scale: 7.5
                }
            });
            // Convert result to base64
            return Buffer.from(await result.arrayBuffer()).toString('base64');
        }
        catch (error) {
            logger_1.logger.error('Error generating image:', error);
            throw error;
        }
    }
    async moderateContent(text) {
        try {
            const result = await this.hf.textClassification({
                model: 'facebook/roberta-hate-speech-detection',
                inputs: text
            });
            return result[0].label === 'LABEL_0'; // Safe content
        }
        catch (error) {
            logger_1.logger.error('Error moderating content:', error);
            throw error;
        }
    }
}
exports.AIService = AIService;
