const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();


const fs = require('fs').promises;
const path = require('path');

const inputDir = './input';
const outputDir = './output';
const targetLanguage = 'zh-CN'; // 目标语言，比如 'zh-CN' 代表中文，'en' 代表英文

fs.readdir(inputDir)
    .then(files => files.filter(file => file.endsWith('.html')))
    .then(htmlFiles => {
        htmlFiles.forEach(file => {
            const filePath = path.join(inputDir, file);
            fs.readFile(filePath, 'utf8')
                .then(async htmlContent => {
                    // 调用 Google 翻译 API 进行翻译
                    let [translations] = await translate.translate(htmlContent, targetLanguage);
                    translations = Array.isArray(translations) ? translations : [translations];
                    const translatedHtmlContent = translations[0];

                    const outputFilePath = path.join(outputDir, file);
                    fs.writeFile(outputFilePath, translatedHtmlContent).then(r => {
                        console.log("翻译完成")
                    });
                });
        });
    })
    .catch(console.error);
