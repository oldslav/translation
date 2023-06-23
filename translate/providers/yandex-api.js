"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YandexApi = void 0;
const axios_1 = __importDefault(require("axios"));
const html_entities_1 = require("html-entities");
const cli_1 = require("../cli");
const translate_1 = require("../translate");
class YandexApi extends translate_1.Translate {
    constructor() {
        super(...arguments);
        this.callTranslateAPI = (valuesForTranslation, originalObject, saveTo) => {
            axios_1.default
                .post('https://translate.api.cloud.yandex.net/translate/v2/translate', {
                sourceLanguageCode: 'ru',
                folderId: cli_1.argv.key,
                targetLanguageCode: cli_1.argv.to,
                texts: [(0, html_entities_1.encode)(valuesForTranslation.join(translate_1.Translate.sentenceDelimiter))],
            })
                .then((response) => {
                const value = response.data.translations[0].text;
                this.saveTranslation((0, html_entities_1.decode)(value), originalObject, saveTo);
            })
                .catch((error) => this.printAxiosError(error, saveTo));
        };
    }
}
exports.YandexApi = YandexApi;
//# sourceMappingURL=yandex-api.js.map