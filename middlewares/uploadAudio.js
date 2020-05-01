const AWS = require('aws-sdk');
const multer = require('multer');
const tempBuffers = {};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

const upload = multer();

const saveAudio = async(buffer, customer, isFinal, timeStamp) => {
  const beforeBuffer = tempBuffers[customer];
  const mergedBuffer = beforeBuffer
    ? Buffer.concat([beforeBuffer, buffer])
    : Buffer.concat([buffer]);
  tempBuffers[customer] = mergedBuffer;

  if (isFinal === 'true') {
    const savedBuffer = tempBuffers[customer];
    const params = {
      Bucket: 'mypeer',
      Key: `${customer}_${timeStamp}`,
      Body: savedBuffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'audio/webm',
    };
    try {
      const result =  await s3.upload(params).promise();
      if (result.Location) {
        delete tempBuffers[customer];
        return result.Location;
      }
    } catch (err) {
      console.warn(err);
    }
  }
  return false;
};

module.exports = { upload, saveAudio };
