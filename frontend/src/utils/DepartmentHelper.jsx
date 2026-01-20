export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno
    },
    {
        name: "Department Name",
        selector: (row) => row.dep_name
    },
    {
        name: "S No",
        selector: (row) => row.sno
    }
]

export const DepartmentButtons = () => {
    return(
        <div>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    )
}