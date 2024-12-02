"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = __importDefault(require("express"));
const story_routes_1 = require("./story.routes");
const user_routes_1 = __importDefault(require("./user.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
function createRouter(webSocketService) {
    const router = express_1.default.Router();
    router.use('/stories', (0, story_routes_1.createStoryRouter)(webSocketService));
    router.use('/users', user_routes_1.default);
    router.use('/auth', auth_routes_1.default);
    return router;
}
exports.default = createRouter;
