"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger/logger");
const geoip_lite_1 = __importDefault(require("geoip-lite"));
class GeoHelper {
    constructor() {
    }
    lookup(ip) {
        const geo = geoip_lite_1.default.lookup(ip);
        if (geo) {
            logger_1.logger.debug('geo', geo);
            return {
                country: geo.country,
                region: geo.region,
            };
        }
    }
}
exports.default = new GeoHelper;
//# sourceMappingURL=geo_hepler.js.map