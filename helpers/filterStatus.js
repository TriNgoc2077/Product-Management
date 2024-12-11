module.exports = (query) => {
    
    let filterStatus = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "Inactive",
            status: "inactive",
            class: ""
        },
        {
            name: "Deleted",
            status: "deleted",
            class: ""
        }
    ];

    if(query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active";
    } else {
        filterStatus[0].class = "active";
    }
    return filterStatus;
}