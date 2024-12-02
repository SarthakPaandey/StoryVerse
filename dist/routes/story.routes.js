"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoryRouter = createStoryRouter;
const express_1 = __importDefault(require("express"));
const story_service_1 = require("../services/story/story.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const bull_service_1 = require("../services/queue/bull.service");
function createStoryRouter(webSocketService) {
    const router = express_1.default.Router();
    const storyService = new story_service_1.StoryService(webSocketService);
    const queueService = new bull_service_1.QueueService();
    router.post('/', auth_middleware_1.authenticate, (req, res) => {
        try {
            const story = await storyService.createStory(req.body);
            return res.status(201).json(story);
        }
        catch (error) {
            return res.status(500).json({ message: error?.message || 'Internal server error' });
        }
    });
    router.post('/:id/contributions', auth_middleware_1.authenticate, (req, res) => {
        try {
            const { content } = req.body;
            const { id: storyId } = req.params;
            const { userId } = req.user;
            const story = await storyService.addContribution(storyId, userId, content);
            // Queue image generation
            if (story.contributions && story.contributions.length > 0) {
                const lastContribution = story.contributions[story.contributions.length - 1];
                await queueService.addImageGenerationJob({
                    prompt: content,
                    storyId,
                    contributionId: lastContribution._id?.toString()
                });
            }
            return res.status(201).json(story);
        }
        catch (error) {
            return res.status(500).json({ message: error?.message || 'Internal server error' });
        }
    });
    return router;
}
exports.default = router;
