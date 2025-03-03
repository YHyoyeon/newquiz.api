import express from 'express';
import fs from 'fs';
import path from 'path';
import * as middlewares from '../../shared/middlewares';

const CONTROLLERS_PATH = path.resolve(__dirname, '../controllers');

// 재귀적으로 디렉토리에서 컨트롤러 파일 목록 가져오기
function getControllerFiles(dirPath: string): string[] {
    const results: string[] = [];
    const files = fs.readdirSync(dirPath);

    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dirPath, files[i]);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 하위 디렉토리 탐색
            results.push(...getControllerFiles(filePath));
        } else if (files[i].endsWith('_controller.ts')) {
            results.push(filePath);
        }
    }

    return results;
}

// 라우트를 동적으로 등록하는 함수
export default async function (router: express.Router) {
    const controllerFiles = getControllerFiles(CONTROLLERS_PATH);
    const registeredRoutes = new Set<string>();

    console.log(`🔍 발견된 컨트롤러 파일:`, controllerFiles);

    for (let i = 0; i < controllerFiles.length; i++) {
        const filePath = controllerFiles[i];
        // console.log(`🚀 처리 중인 컨트롤러 파일: ${filePath}`);
        const controller = await import(filePath);

        const execute = controller.execute;
        const meta = controller.meta;

        if (typeof execute !== 'function' || !meta) {
            console.warn(`⚠️ ${filePath}에서 'execute' 함수 또는 'meta' 정보가 없습니다.`);
            continue;
        }

        const relativePath = path.relative(CONTROLLERS_PATH, filePath);
        const routePath = '/' + relativePath.replace('_controller.ts', '').replace(/\\/g, '/');
        const method = meta.method || 'get';
        const validationSchema = meta.validationSchema;

        if (registeredRoutes.has(routePath)) {
            console.warn(`⚠️ 중복된 라우트 발견: ${routePath}`);
            continue;
        }

        registeredRoutes.add(routePath);

        router[method](
            routePath,
            [
                middlewares.requestMiddleware,
                validationSchema ? middlewares.validationMiddleware(validationSchema) : undefined,
                execute,
                middlewares.responseMiddleware,
            ].filter(Boolean) // undefined 미들웨어 제거
        );

        console.log(`✅ 라우트 등록 완료: [${method.toUpperCase()}] ${routePath}`);
    }
}
