class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        }
        :{}

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryStrCopy = {...this.queryStr};
        // console.log(queryStrCopy);
        // Removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key)=>{
            delete queryStrCopy[key];
        })
        
        //filter for price and rating
        let queryStr = JSON.stringify(queryStrCopy);
        // console.log(queryStr)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=> `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sortProducts(){
        const order = this.queryStr.order || "";
        const sortOrder = order === "best rating" ? { ratings: -1 } 
                        : order === "newest" ? { createdAt: -1 }
                        : order === "lowest" ? { price: 1 }
                        : order === "highest" ? { price: -1 }
                        : { _id: -1 };
        this.query = this.query.sort(sortOrder);
        return this;
        // console.log(this.queryStr.order)
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        // console.log(currentPage, skip)

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures