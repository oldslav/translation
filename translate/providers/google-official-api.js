"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOfficialAPI = void 0;
const v2_1 = require("@google-cloud/translate/build/src/v2");
const html_entities_1 = require("html-entities");
const cli_1 = require("../cli");
const translate_1 = require("../translate");
class GoogleOfficialAPI extends translate_1.Translate {
    constructor() {
        super(...arguments);
        this.callTranslateAPI = (valuesForTranslation, originalObject, saveTo) => {
            new v2_1.Translate({ key: cli_1.argv.key })
                .translate((0, html_entities_1.encode)(valuesForTranslation.join(translate_1.Translate.sentenceDelimiter)), {
                from: cli_1.argv.from,
                to: cli_1.argv.to,
            })
                .then((response) => {
                const value = response[0];
                this.saveTranslation((0, html_entities_1.decode)(value), originalObject, saveTo);
            })
                .catch((error) => {
                const err = error;
                const errorFilePath = saveTo.replace(`${cli_1.argv.to}.json`, `${cli_1.argv.from}.json`);
                console.error(`Request error for file: ${errorFilePath}`);
                if (err.response?.statusCode && err.response.statusMessage && err.errors[0].message) {
                    console.log(`Status Code: ${err.response.statusCode}`);
                    console.log(`Status Text: ${err.response.statusMessage}`);
                    console.log(`Data: ${JSON.stringify(err.errors[0].message)}`);
                }
                else {
                    console.log(error);
                }
            });
        };
    }
}
exports.GoogleOfficialAPI = GoogleOfficialAPI;
//# sourceMappingURL=google-official-api.js.map