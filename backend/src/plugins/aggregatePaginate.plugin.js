/* eslint-disable no-param-reassign */

const aggregatePaginate = (schema) => {
    /**
     * @typedef {Object} QueryResult
     * @property {Document[]} results - Results for the current page
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
    /**
     * Query for documents with pagination
     * @param {Array} [pipeline] - Mongo aggregation pipeline
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default: 10)
     * @param {number} [options.page] - Current page (default: 1)
     * @returns {Promise<QueryResult>}
     */
    schema.statics.aggregatePaginate = async function (pipeline, options) {
        const Model = this;

        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
        const skip = (page - 1) * limit;

        const countPipeline = [...pipeline, { $count: 'totalResults' }];

        const countPromise = Model.aggregate(countPipeline).exec();

        const docsPipeline = [...pipeline];
        if (options.sortBy) {
            const sort = {};
            options.sortBy.split(',').forEach((sortOption) => {
                const [key, order] = sortOption.split(':');
                sort[key] = order === 'desc' ? -1 : 1;
            });
            docsPipeline.push({ $sort: sort });
        }
        docsPipeline.push({ $skip: skip }, { $limit: limit });

        const docsPromise = Model.aggregate(docsPipeline).exec();

        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [countResult, results] = values;
            const totalResults = countResult.length > 0 ? countResult[0].totalResults : 0;
            const totalPages = Math.ceil(totalResults / limit);
            return { results, page, limit, totalPages, totalResults };
        });
    };
};

module.exports = aggregatePaginate;

