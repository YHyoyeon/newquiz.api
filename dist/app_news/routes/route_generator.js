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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const middlewares = __importStar(require("../../shared/middlewares"));
const CONTROLLERS_PATH = path_1.default.resolve(__dirname, '../controllers');
const FILE_EXT = process.env.FILE_EXT || 'ts';
// 재귀적으로 디렉토리에서 컨트롤러 파일 목록 가져오기
function getControllerFiles(dirPath) {
    const results = [];
    const files = fs_1.default.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
        const filePath = path_1.default.join(dirPath, files[i]);
        const stat = fs_1.default.statSync(filePath);
        if (stat.isDirectory()) {
            // 하위 디렉토리 탐색
            results.push(...getControllerFiles(filePath));
        }
        else if (files[i].endsWith(`_controller.${FILE_EXT}`)) {
            results.push(filePath);
        }
    }
    return results;
}
// 라우트를 동적으로 등록하는 함수
function default_1(router) {
    return __awaiter(this, void 0, void 0, function* () {
        const controllerFiles = getControllerFiles(CONTROLLERS_PATH);
        const registeredRoutes = new Set();
        console.log(`🔍 발견된 컨트롤러 파일:`, controllerFiles);
        for (let i = 0; i < controllerFiles.length; i++) {
            const filePath = controllerFiles[i];
            // console.log(`🚀 처리 중인 컨트롤러 파일: ${filePath}`);
            const controller = yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            const execute = controller.execute;
            const meta = controller.meta;
            if (typeof execute !== 'function' || !meta) {
                console.warn(`⚠️ ${filePath}에서 'execute' 함수 또는 'meta' 정보가 없습니다.`);
                continue;
            }
            const relativePath = path_1.default.relative(CONTROLLERS_PATH, filePath);
            const routePath = '/' + relativePath.replace(`_controller.${FILE_EXT}`, '').replace(/\\/g, '/');
            const method = meta.method || 'get';
            const validationSchema = meta.validationSchema;
            if (registeredRoutes.has(routePath)) {
                console.warn(`⚠️ 중복된 라우트 발견: ${routePath}`);
                continue;
            }
            registeredRoutes.add(routePath);
            router[method](routePath, [
                middlewares.requestMiddleware,
                validationSchema ? middlewares.validationMiddleware(validationSchema) : undefined,
                execute,
                middlewares.responseMiddleware,
            ].filter(Boolean) // undefined 미들웨어 제거
            );
            console.log(`✅ 라우트 등록 완료: [${method.toUpperCase()}] ${routePath}`);
        }
    });
}
//# sourceMappingURL=route_generator.js.map