const handlebars = require('handlebars');
const fs = require('fs');
const path = require("path");

function renderTemplate(templatePath, data) {
    const templateSource = fs.readFileSync(path.join(__dirname, templatePath), "utf8");
    const template = handlebars.compile(templateSource);
    return template(data);
}

module.exports = renderTemplate;
