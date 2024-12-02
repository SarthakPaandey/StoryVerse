"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = require("../services/user/user.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const userService = new user_service_1.UserService();
router.get('/:id', auth_middleware_1.authenticate, (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error?.message || 'Internal server error' });
    }
});
exports.default = router;
