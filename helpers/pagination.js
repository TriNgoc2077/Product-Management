module.exports = (objectPagination, query, countProducts) => {

    if(query.page) {
        objectPagination.currentPage = 
            isNaN(parseInt(query.page)) ? 1 : parseInt(query.page);
    }
    const totalPage = Math.ceil(countProducts/objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
    
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
    return objectPagination;
}