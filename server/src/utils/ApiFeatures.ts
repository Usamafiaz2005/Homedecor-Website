export class ApiFeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1. Search Bar Logic (Weighted Text Search)
  search() {
    if (this.queryString.keyword) {
      this.query = this.query.find({
        $text: { $search: this.queryString.keyword }
      }).select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
    }
    return this;
  }

  // 2. Advanced Filtering Logic
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Handle array filters (e.g., color=walnut,beige -> color: { $in: ['walnut', 'beige'] })
    if (queryObj.color) {
      queryObj['variants.color'] = { $in: queryObj.color.split(',') };
      delete queryObj.color;
    }
    if (queryObj.material) {
      queryObj['variants.material'] = { $in: queryObj.material.split(',') };
      delete queryObj.material;
    }

    // Advanced filtering for price and ratings (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 3. Sorting Logic
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default to newest
    }
    return this;
  }

  // 4. Pagination Logic
  paginate() {
    const page = parseInt(this.queryString.page as string, 10) || 1;
    const limit = parseInt(this.queryString.limit as string, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}