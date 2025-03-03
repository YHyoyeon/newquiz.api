import { logger } from './logger/logger';
import geoip from 'geoip-lite';

export interface IGeoInfo {
    country: string;
    region: string;
}

class GeoHelper {
    constructor() {
    }

    public lookup(ip: string): IGeoInfo {
        const geo = geoip.lookup(ip);
        if (geo) {
            logger.debug('geo', geo);

            return {
                country: geo.country,
                region: geo.region,
            };
        }
    }
}

export default new GeoHelper;