const AWS = require('aws-sdk');
const uidGenerator = require('uid-generator')
const uidgen = new uidGenerator();

AWS.config.update({
    accessKeyId: keys.aws.accessKeyId,
    secretAccessKey: keys.aws.secretAccessKey,
    region: keys.aws.region
})
const s3 = new AWS.S3();
const bucketName = keys.aws.bucketName;
const region = keys.aws.region;

mimeTypes = {
    txt: "text/plain",
    pdf: "application/pdf",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    png: "image/png",
    doc: "application/msword",
    dot: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    docm: "application/vnd.ms-word.document.macroEnabled.12",
    dotm: "application/vnd.ms-word.template.macroEnabled.12",
    xls: "application/vnd.ms-excel",
    xlt: "application/vnd.ms-excel",
    xla: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
    xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
    xltm: "application/vnd.ms-excel.template.macroEnabled.12",
    xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
    xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    ppt: "application/vnd.ms-powerpoint",
    pot: "application/vnd.ms-powerpoint",
    pps: "application/vnd.ms-powerpoint",
    ppa: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
    ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
    ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
    pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
    ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
    mdb: "application/vnd.ms-access"
}

module.exports = {

    upload: (res, fileFromBuffer, typesAllowed, callback) => {
        /*
        res -> res object from node
        fileFromBuffer -> req.file from multer
        typesAllowed -> array of allowed file types. i.e.: ["txt", "pdf"]
        callback -> function that will be executed after object has been pushed to s3. Receives as parameter the file url
        */

        if (!fileFromBuffer) return callback(null, null);
        else {
            let file = fileFromBuffer.buffer;
            let fileType = fileFromBuffer.originalname.split('.');
            let length = fileType.length;
            fileType = fileType[length - 1].toLowerCase();
            let contentType = "";

            if (typesAllowed.includes(fileType)) contentType = mimeTypes[fileType];
            else return res.status(400).json({ message: "You uploaded a ." + fileType + " file, but it must be " + typesAllowed.join(", ") });

            let fileName = uidgen.generateSync() + '.' + fileType;

            let data = {
                Bucket: bucketName,
                Key: bucketName + "-" + process.env.NODE_ENV + "/" + fileName,
                Body: file,
                ACL: 'public-read',
                ContentType: contentType
            };

            s3.putObject(data, async function (err, data) {
                if (err) return process.env.NODE_ENV == "development" ? res.status(500).json({ message: err }) : res.status(500).json({ message: "Internal server error" });
                else {
                    let fileUrl = "https://" + bucketName + '.s3.' + region + ".amazonaws.com/" + bucketName + "-" + process.env.NODE_ENV + "/" + fileName;
                    callback(fileUrl);
                }
            });
        }

    },

    uploadMultiple: (res, fileFromBuffer, typesAllowed, callback) => {
        /*
        res -> res object from node
        fileFromBuffer -> req.file from multer
        typesAllowed -> array of allowed file types. i.e.: ["txt", "pdf"]
        callback -> function that will be executed after object has been pushed to s3. Receives as parameter the file url
        */

        if (!fileFromBuffer) return callback(null, null);
        else {
            let file = fileFromBuffer[0].buffer;
            let fileType = fileFromBuffer[0].originalname.split('.');
            let length = fileType.length;
            fileType = fileType[length - 1].toLowerCase();
            let contentType = "";

            if (typesAllowed.includes(fileType)) contentType = mimeTypes[fileType];
            else return res.status(400).json({ message: "You uploaded a ." + fileType + " file, but it must be " + typesAllowed.join(", ") });

            let fileName = uidgen.generateSync() + '.' + fileType;

            let data = {
                Bucket: bucketName,
                Key: bucketName + "-" + process.env.NODE_ENV + "/" + fileName,
                Body: file,
                ACL: 'public-read',
                ContentType: contentType
            };

            s3.putObject(data, async function (err, data) {
                if (err) return process.env.NODE_ENV == "development" ? res.status(500).json({ message: err }) : res.status(500).json({ message: "Internal server error" });
                else {
                    let fileUrl = "https://" + bucketName + '.s3.' + region + ".amazonaws.com/" + bucketName + "-" + process.env.NODE_ENV + "/" + fileName;
                    callback(fileUrl);
                }
            });
        }

    },

    delete: (res, url, file, callback) => {

        if (!url || !file) return callback(null);
        else {
            var params = {
                Bucket: bucketName,
                Key: bucketName + "-" + process.env.NODE_ENV + "/" + url.split('/' + bucketName + "-" + process.env.NODE_ENV + '/')[1],
            };
            s3.deleteObject(params, function (err, data) {
                if (err) return process.env.NODE_ENV == "development" ? res.status(500).json({ message: err }) : res.status(500).json({ message: "Internal server error" });
                else callback();
            })
        }
    }
}