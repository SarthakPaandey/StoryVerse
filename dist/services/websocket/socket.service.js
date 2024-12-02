"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("../../utils/logger");
class WebSocketService {
    constructor(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
        this.initializeHandlers();
    }
    initializeHandlers() {
        this.io.on('connection', (socket) => {
            logger_1.logger.info(`Client connected: ${socket.id}`);
            socket.on('join_story', (storyId) => {
                socket.join(`story:${storyId}`);
            });
            socket.on('leave_story', (storyId) => {
                socket.leave(`story:${storyId}`);
            });
            socket.on('disconnect', () => {
                logger_1.logger.info(`Client disconnected: ${socket.id}`);
            });
        });
    }
    emitStoryUpdate(storyId, data) {
        this.io.to(`story:${storyId}`).emit('story_updated', data);
    }
    emitNewContribution(storyId, data) {
        this.io.to(`story:${storyId}`).emit('new_contribution', data);
    }
}
exports.WebSocketService = WebSocketService;
