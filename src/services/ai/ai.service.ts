import { HfInference } from '@huggingface/inference';
import { config } from '../../config';
import { logger } from '../../utils/logger';

export class AIService {
  private hf: HfInference;
  
  constructor() {
    this.hf = new HfInference(config.ai.huggingFaceApiKey);
  }

  async generateImage(prompt: string): Promise<string> {
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
    } catch (error) {
      logger.error('Error generating image:', error);
      throw error;
    }
  }

  async moderateContent(text: string): Promise<boolean> {
    try {
      const result = await this.hf.textClassification({
        model: 'facebook/roberta-hate-speech-detection',
        inputs: text
      });

      return result[0].label === 'LABEL_0'; // Safe content
    } catch (error) {
      logger.error('Error moderating content:', error);
      throw error;
    }
  }
}