const qs = require('qs')

class APIFeatures  {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }
    filter() {
        const queryObj = qs.parse(this.queryStr)
        // console.log(queryObj);
        const excludedFields = ['sort', 'page', 'limit', 'fields']
        excludedFields.forEach((el) => delete queryObj[el])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr))
        return this
    }
    
    sort() {
        if(this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ')
            console.log(sortBy);
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields() {
        if(this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1
        const limit = this.queryStr.limit * 1 || 100
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = APIFeatures