require('dotenv').config()
const fs = require('fs')
const aws = require('aws-sdk')
const multer = require('multer')
const uuid = require('uuid')

const s3 = new aws.S3({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
})

const MulterStorage = multer.diskStorage({
    destination: '/tmp',
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + '_' + file.originalname)
    }
})


async function storeFilesToS3(files, trip_id) {
    store_status = files.map(file => {
        console.log(file)
        let file_content = fs.readFileSync(file.path)
        let params = {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET,
            Key: `${trip_id}/${file.filename}`,
            Body: file_content
        }
        return s3.upload(params).promise().then(
            data => {return data}).catch(
            err => {return err})
    })
    return Promise.all(store_status)
}

module.exports = {MulterStorage, storeFilesToS3}