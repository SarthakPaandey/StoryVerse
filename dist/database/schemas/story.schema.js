"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const StorySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    theme: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    contributions: [{
            _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Contribution' },
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            content: { type: String, required: true },
            imageUrl: String,
            votes: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now }
        }],
    settings: {
        maxParticipants: { type: Number, default: 10 },
        contributionMaxLength: { type: Number, default: 280 },
        allowImageGeneration: { type: Boolean, default: true },
        isPrivate: { type: Boolean, default: false }
    }
});
exports.Story = mongoose_1.default.model('Story', StorySchema);
