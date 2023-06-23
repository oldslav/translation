"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translate = void 0;
const deep_object_diff_1 = require("deep-object-diff");
const fs_1 = __importDefault(require("fs"));
const glob_1 = require("glob");
const just_extend_1 = __importDefault(require("just-extend"));
const path_1 = __importDefault(require("path"));
const cli_1 = require("./cli");
const util_1 = require("./util");
class Translate {
    constructor() {
        this.translate = () => {
            if (cli_1.argv.filePath && cli_1.argv.dirPath)
                throw new Error('You should only provide a single file or a directory.');
            if (!cli_1.argv.filePath && !cli_1.argv.dirPath)
                throw new Error('You must provide a single file or a directory.');
            if (cli_1.argv.dirPath)
                this.translateFiles(cli_1.argv.dirPath);
            else if (cli_1.argv.filePath)
                this.translateFile(cli_1.argv.filePath);
        };
        this.translateFiles = (dirPath) => {
            console.log('Finding files for translation...');
            const filePaths = (0, glob_1.globSync)(`${dirPath}/**/${cli_1.argv.from}.json`, {
                ignore: [`${dirPath}/**/node_modules/**`, `${dirPath}/**/dist/**`],
            });
            if (filePaths.length === 0)
                throw new Error(`0 files found for translation in ${dirPath}`);
            console.log(`${filePaths.length} files found.`);
            filePaths.forEach((filePath) => this.translateFile(filePath));
        };
        this.translateFile = (filePath) => {
            try {
                const fileForTranslation = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
                const saveTo = path_1.default.join(filePath.substring(0, filePath.lastIndexOf('/')), `${cli_1.argv.to}.json`);
                if (cli_1.argv.override || !fs_1.default.existsSync(saveTo))
                    this.translationDoesNotExists(fileForTranslation, saveTo);
                else
                    this.translationAlreadyExists(fileForTranslation, saveTo);
            }
            catch (e) {
                console.log(`${e.message} at: ${filePath}`);
            }
        };
        this.translationAlreadyExists = (fileForTranslation, saveTo) => {
            try {
                const existingTranslation = JSON.parse(fs_1.default.readFileSync(saveTo, 'utf-8'));
                this.deleteIfNeeded(fileForTranslation, existingTranslation, saveTo);
                this.translateIfNeeded(fileForTranslation, existingTranslation, saveTo);
            }
            catch (e) {
                console.log(`${e.message} at: ${saveTo}`);
            }
        };
        this.deleteIfNeeded = (fileForTranslation, existingTranslation, saveTo) => {
            const diffForDeletion = (0, deep_object_diff_1.deletedDiff)(existingTranslation, fileForTranslation);
            if (Object.keys(diffForDeletion).length !== 0) {
                const content = (0, just_extend_1.default)(true, existingTranslation, diffForDeletion);
                this.writeToFile(content, saveTo, `Unnecessary lines deleted for: ${saveTo}`);
            }
        };
        this.translateIfNeeded = (fileForTranslation, existingTranslation, saveTo) => {
            const diffForTranslation = (0, deep_object_diff_1.addedDiff)(existingTranslation, fileForTranslation);
            if (Object.keys(diffForTranslation).length === 0) {
                console.log(`Everything already translated for: ${saveTo}`);
                return;
            }
            const valuesForTranslation = this.getValuesForTranslation(diffForTranslation);
            this.callTranslateAPI(valuesForTranslation, diffForTranslation, saveTo);
        };
        this.translationDoesNotExists = (fileForTranslation, saveTo) => {
            if (Object.keys(fileForTranslation).length === 0) {
                console.log(`Nothing to translate, file is empty: ${saveTo}`);
                return;
            }
            const valuesForTranslation = this.getValuesForTranslation(fileForTranslation);
            this.callTranslateAPI(valuesForTranslation, fileForTranslation, saveTo);
        };
        this.getValuesForTranslation = (object) => {
            const values = [];
            (function findValues(json) {
                Object.values(json).forEach((value) => {
                    if (typeof value === 'object')
                        findValues(value);
                    else
                        values.push(value);
                });
            })(object);
            return values;
        };
        this.printAxiosError = (error, saveTo) => {
            const errorFilePath = saveTo.replace(`${cli_1.argv.to}.json`, `${cli_1.argv.from}.json`);
            console.error(`Request error for file: ${errorFilePath}`);
            if (error.response?.status && error.response.statusText && error.response.data) {
                console.log(`Status Code: ${error.response?.status}`);
                console.log(`Status Text: ${error.response?.statusText}`);
                console.log(`Data: ${JSON.stringify(error.response?.data)}`);
            }
            else {
                console.log(error.message);
            }
        };
        this.saveTranslation = (value, originalObject, saveTo) => {
            // replaceAll() is used because of weird bug that sometimes happens
            // when translate api return delimiter with space in between
            let translations = (0, util_1.replaceAll)(value, '{| }', '{|}');
            translations = (0, util_1.replaceAll)(translations, '{ |}', '{|}');
            let content = this.createTranslatedObject(translations.split(Translate.sentenceDelimiter.trim()), originalObject);
            let message = `File saved: ${saveTo}`;
            if (fs_1.default.existsSync(saveTo) && !cli_1.argv.override) {
                const existingTranslation = JSON.parse(fs_1.default.readFileSync(saveTo, 'utf-8'));
                content = (0, just_extend_1.default)(true, existingTranslation, content);
                message = `File updated: ${saveTo}`;
            }
            this.writeToFile(content, saveTo, message);
        };
        this.createTranslatedObject = (translations, originalObject) => {
            const translatedObject = { ...originalObject };
            let index = 0;
            (function addTranslations(json) {
                Object.keys(json).forEach((key) => {
                    if (typeof json[key] === 'object')
                        addTranslations(json[key]);
                    // eslint-disable-next-line no-param-reassign
                    else
                        json[key] = translations[index++]?.trim();
                });
            })(translatedObject);
            return translatedObject;
        };
        this.writeToFile = (content, saveTo, message) => {
            try {
                fs_1.default.writeFileSync(saveTo, JSON.stringify(content, null, 2));
                console.log(message);
            }
            catch (e) {
                console.log(e.message);
            }
        };
    }
}
exports.Translate = Translate;
Translate.sentenceDelimiter = '\n{|}\n';
//# sourceMappingURL=translate.js.map