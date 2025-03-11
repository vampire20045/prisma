"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singupInput = exports.singinInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.singinInput = zod_1.default.object({
    name: zod_1.default.string().min(6).max(20),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(20)
});
exports.singupInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(20)
});
