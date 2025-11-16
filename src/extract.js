const adm_zip = require("adm-zip");
const path = require("node:path");
const { exit } = require("node:process");

const public_path = path.join(__dirname, "..", "public.zip");
const views_path = path.join(__dirname, "views.zip");

function unzip_files() {
    try {
        const unzip_public = new adm_zip(public_path);
        const unzip_views = new adm_zip(views_path);
    } catch (err) {
        console.log("seems like you did not download everything ...");
        exit(1);
    }
}

module.exports = unzip_files;
