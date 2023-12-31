"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateSupplier = void 0;
const azure_official_api_1 = require("./providers/azure-official-api");
const azure_rapid_api_1 = require("./providers/azure-rapid-api");
const deep_rapid_api_1 = require("./providers/deep-rapid-api");
const google_official_api_1 = require("./providers/google-official-api");
const lecto_rapid_api_1 = require("./providers/lecto-rapid-api");
const lingvanex_rapid_api_1 = require("./providers/lingvanex-rapid-api");
const nlp_rapid_api_1 = require("./providers/nlp-rapid-api");
class TranslateSupplier {
}
exports.TranslateSupplier = TranslateSupplier;
TranslateSupplier.providers = {
    'google-official': new google_official_api_1.GoogleOfficialAPI(),
    'azure-official': new azure_official_api_1.AzureOfficialAPI(),
    'azure-rapid': new azure_rapid_api_1.AzureRapidAPI(),
    'deep-rapid': new deep_rapid_api_1.DeepRapidAPI(),
    'lecto-rapid': new lecto_rapid_api_1.LectoRapidAPI(),
    'lingvanex-rapid': new lingvanex_rapid_api_1.LingvanexRapidAPI(),
    'nlp-rapid': new nlp_rapid_api_1.NLPRapidAPI(),
};
TranslateSupplier.getProvider = (provider) => TranslateSupplier.providers[provider];
//# sourceMappingURL=translate-supplier.js.map