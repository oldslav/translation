"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepRapidAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const html_entities_1 = require("html-entities");
const cli_1 = require("../cli");
const translate_1 = require("../translate");
const util_1 = require("../util");
class DeepRapidAPI extends translate_1.Translate {
    constructor() {
        super();
        this.callTranslateAPI = (valuesForTranslation, originalObject, saveTo) => {
            axios_1.default
                .post(`https://${DeepRapidAPI.endpoint}/language/translate/v2`, {
                q: (0, html_entities_1.encode)(valuesForTranslation.join(translate_1.Translate.sentenceDelimiter)),
                source: cli_1.argv.from,
                target: cli_1.argv.to,
            }, DeepRapidAPI.axiosConfig)
                .then((response) => {
                const value = response.data.data.translations.translatedText;
                this.saveTranslation((0, html_entities_1.decode)(value), originalObject, saveTo);
            })
                .catch((error) => this.printAxiosError(error, saveTo));
        };
        if (cli_1.argv.certificatePath)
            DeepRapidAPI.axiosConfig.httpsAgent = (0, util_1.addCustomCert)(cli_1.argv.certificatePath);
    }
}
exports.DeepRapidAPI = DeepRapidAPI;
DeepRapidAPI.endpoint = 'deep-translate1.p.rapidapi.com';
DeepRapidAPI.axiosConfig = {
    headers: {
        'X-RapidAPI-Host': DeepRapidAPI.endpoint,
        'X-RapidAPI-Key': cli_1.argv.key,
        'Content-type': 'application/json',
    },
    responseType: 'json',
};
//# sourceMappingURL=deep-rapid-api.js.map