"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAll = exports.addCustomCert = void 0;
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const process_1 = require("process");
const addCustomCert = (certificatePath) => {
    try {
        return new https_1.default.Agent({
            ca: fs_1.default.readFileSync(certificatePath),
        });
    }
    catch (e) {
        console.log(`Certificate not fount at: ${certificatePath}`);
        return (0, process_1.exit)(1);
    }
};
exports.addCustomCert = addCustomCert;
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const replaceAll = (str, find, replace) => str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
exports.replaceAll = replaceAll;
//# sourceMappingURL=util.js.map