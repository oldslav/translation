"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureRapidAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const html_entities_1 = require("html-entities");
const cli_1 = require("../cli");
const translate_1 = require("../translate");
const util_1 = require("../util");
class AzureRapidAPI extends translate_1.Translate {
    constructor() {
        super();
        this.callTranslateAPI = (valuesForTranslation, originalObject, saveTo) => {
            axios_1.default
                .post(`https://${AzureRapidAPI.endpoint}/translate`, [{ text: (0, html_entities_1.encode)(valuesForTranslation.join(translate_1.Translate.sentenceDelimiter)) }], AzureRapidAPI.axiosConfig)
                .then((response) => {
                const value = response.data[0].translations[0].text;
                this.saveTranslation((0, html_entities_1.decode)(value), originalObject, saveTo);
            })
                .catch((error) => this.printAxiosError(error, saveTo));
        };
        if (cli_1.argv.certificatePath)
            AzureRapidAPI.axiosConfig.httpsAgent = (0, util_1.addCustomCert)(cli_1.argv.certificatePath);
    }
}
exports.AzureRapidAPI = AzureRapidAPI;
AzureRapidAPI.endpoint = 'microsoft-translator-text.p.rapidapi.com';
AzureRapidAPI.axiosConfig = {
    headers: {
        'X-ClientTraceId': crypto_1.default.randomUUID(),
        'X-RapidAPI-Host': AzureRapidAPI.endpoint,
        'X-RapidAPI-Key': cli_1.argv.key,
        'Content-type': 'application/json',
    },
    params: {
        'api-version': '3.0',
        from: cli_1.argv.from,
        to: cli_1.argv.to,
    },
    responseType: 'json',
};
//# sourceMappingURL=azure-rapid-api.js.map