class ApiFeatures {
    constructor(mongooseQuery , queryStrig){
        this.mongooseQuery = mongooseQuery;
        this.queryStrig = queryStrig;
    }
    filter(){
        const queryStringObj = {...this.queryStrig};
        const excludesFields = ['page' , 'limit' , 'sort'];
        excludesFields.forEach((fild) => delete queryStringObj[fild]);
        let queryString = JSON.stringify(queryStringObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g , (match) => {
        `$${match}`
        });
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
        return this;
    };

    sort(){
        if(this.queryStrig.sort){
            const sortBy = this.queryStrig.sort.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
        };
        return this;
    };

    limitFildes(){
        if(this.queryStrig.filds){
            const filds = this.queryStrig.filds.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(filds);
        }else{
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        };
        return this;
    };

    search(modelName){
        if(this.queryStrig.keyWord){
            let query = {};
            if(modelName === 'products'){
                query.$or = [
                {title : {$regex : this.queryStrig.keyWord , $options : 'i'}},
                {description : {$regex : this.queryStrig.keyWord , $options : 'i'}}
            ]
            }else{
                query = {name : {$regex : this.queryStrig.keyWord , $options : 'i'}}
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        };
        return this;
    };

    paginate(countDocument){
        const page = this.queryStrig.page * 1 || 1;
        const limit =this.queryStrig.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        // pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfBages = Math.ceil(countDocument / limit);

        // next page
        if(endIndex < countDocument){
            pagination.next = page + 1;
        }
        // last page
        if(skip > 0){
            pagination.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    };
};

module.exports = ApiFeatures;