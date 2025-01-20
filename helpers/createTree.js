let count = 0;
const createTree = (arr, parentId = "") => {
    try {
        const tree = [];
        arr.forEach((item) => {
            if (item.parent_id == parentId) {
                count++;
                const newItem = item;
                newItem.index = count;
                const children = createTree(arr, item._id);
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem);
            } 
            
        });
        return tree;
    } catch(error) {
        console.log("New error: ", error);
    }
}

module.exports.createTree = (arr, parentId = "") => {
    count = 0;
    const tree = createTree(arr, parentId = "");
    return tree;
}