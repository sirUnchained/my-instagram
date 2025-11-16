const adm_zip = require("adm-zip");
const path = require("node:path");
const { exit } = require("node:process");

const public_path = path.join(__dirname, "..", "public.zip");
const views_path = path.join(__dirname, "views.zip");

function unzip_files() {
    try {
        const unzip_public = new adm_zip(public_path);
        const unzip_views = new adm_zip(views_path);

        const unzip_public_path = path.join(public_path, "..");
        const unzip_views_path = path.join(views_path, "..");

        unzip_public.extractAllTo(unzip_public_path, true);
        unzip_views.extractAllTo(unzip_views_path, true);
    } catch (_) {
        console.log("seems like you did not download everything ...");
        exit(1);
    }
}

module.exports = unzip_files;
