const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const uploadFileToS3 = async (file) => {
    const fileKey = `${uuidv4()}-${file.originalname}`;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: file.buffer
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        return { url: uploadResult.Location, fileKey };
    } catch (err) {
        console.error('Error uploading file to S3', err);
        throw err;
    }
};

const deleteFileFromS3 = async (fileKey) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey
    };

    try {
        await s3.deleteObject(params).promise();
    } catch (err) {
        console.error('Error deleting file from S3', err);
        throw err;
    }
};

module.exports = {
    uploadFileToS3,
    deleteFileFromS3
};
