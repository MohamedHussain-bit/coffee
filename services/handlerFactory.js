const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const ApiFeature = require('../utils/apiFeature');


// Create document
exports.createOne = (Model) => asyncHandler(async (req , res ) => {
    const document = await Model.create(req.body);
    return res.status(201).json({data : document});
});

// Get specific document
exports.getOne = (Model) => asyncHandler(async (req , res , next) => {
    const document = await Model.findById(req.params.id);

    if(!document){
        return next(new ApiError(`document for this id ${id} not found` , 404))
    };

    return res.status(200).json({data : document});
});

// Update document
exports.updateOne = (Model) => asyncHandler(async (req , res , next) => {

    const document = await Model.findByIdAndUpdate(req.params.id , req.body , {new : true});

    if(!document){
        return next(new ApiError(`document for this id ${id} not found` , 404));
    };

    return res.status(200).json({data : document});
});

// Delete document
exports.deleteOne = (Model) => asyncHandler(async (req , res , next) => {

    const product = await Model.findByIdAndDelete(req.params.id);

    if(!Model){
        return next(new ApiError(`document for this id ${id} not found` , 404));
    };

    return res.status(204).send();
});

// Get list of document
exports.getList = (Model , modelName = '') => asyncHandler( async (req , res) => {
    let filter = {};
    if(req.filterObj){
        filter = req.filterObj
    };
    const documentCounts = await Model.countDocuments()
    const apiFeature = new ApiFeature(Model.find(filter) , req.query)
        .paginate(documentCounts)
        .filter()
        .limitFildes()
        .search(modelName)
        .sort()

    const {paginationResult , mongooseQuery} = apiFeature;
    const document = await mongooseQuery;
    return res.status(200).json({results : document.length, paginationResult , data : document});
});