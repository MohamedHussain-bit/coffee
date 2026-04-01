const asyncHandler = require('express-async-handler');

const User = require('../models/userSchema');

// @desc     Add product to wishlist
// @route    POST /api/v1/wishlist
// @access   Protected/user
exports.addProductTowishList = asyncHandler(async (req , res , next) => {
    const user = await User.findOneAndUpdate(
        req.user._id,
        {
            $addToSet : {wishList : req.body.productId}
        },
        {
            new : true
        }
    );
    res.status(200).json({
        status : 'Success',
        message : 'Product added successfully to your wishlist',
        data : user.wishList
    });
});