// Permission
const tablePermissions = document.querySelector("[table-permissions]");
const buttonSubmit = document.querySelector("[button-submit]");

if (buttonSubmit) {
    buttonSubmit.addEventListener("click", () => {
        let permissions = [];
        const rows = tablePermissions.querySelectorAll("[data-name]");
       
        rows.forEach((row) => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if (name == "id") { 
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    })
                });
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                    // console.log(name);
                    // console.log(checked);
                });
            }
        });
        // console.log(permissions);
        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            console.log(inputPermissions);
            inputPermissions.value = JSON.stringify(permissions);
            formChangePermissions.submit();
            // console.log(inputPermissions);
        }
    });


}
// End Permission
// permissions data default 
const dataRecords = document.querySelector("[data-records]");
// console.log(dataRecords);
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");
    records.forEach((record, index) => {
        const permissions = record.permissions;
        // console.log(permissions);
        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
            // console.log(index);
            // console.log(permission);
        });
    }); 
}
// end permissions data default 
