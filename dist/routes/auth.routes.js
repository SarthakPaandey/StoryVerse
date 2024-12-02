"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_service_1 = require("../services/auth/auth.service");
const router = express_1.default.Router();
const authService = new auth_service_1.AuthService();
router.post('/telegram', async (req, res) => {
    try {
        const result = await authService.authenticateTelegramUser(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
