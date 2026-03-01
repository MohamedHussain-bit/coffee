const multer = require('multer');

const ApiErorr = require('../utils/apiError');

exports.uploadSingleImage = (fildName) => {
    const storage = multer.memoryStorage();

    const filter = (req , file , cb) => {
        if(file.mimetype.startsWith('image')){
            cb(null , true);
        } else {
            cb(new ApiErorr('only image allowed' , 400) , false);
        };
    };

    const upload = multer({storage : storage , fileFilter : filter});

    return upload.single(fildName);
};

exports.uploadMixOfImages = (arryObtions) => {
    const storage = multer.memoryStorage();

    const filter = (req , file , cb) => {
        if(file.mimetype.startsWith('image')){
            cb(null , true);
        } else {
            cb(new ApiErorr(`only images allowed` , 400) , false);
        };
    };
    
    const upload = multer({storage : storage , fileFilter : filter});

    return upload.fields(arryObtions)
}