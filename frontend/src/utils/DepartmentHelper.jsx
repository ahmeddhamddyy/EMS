/*
import { useNavigate } from "react-router-dom"
 
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

export const DepartmentButtons = ({_id}) => {
    return(
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-teal-600 text-white"
            onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
            >Edit</button>
            <button className="px-3 py-1 bg-red-600 text-white">Delete</button>
        </div>
    )
}
    */


import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
  },
  {
    name: "Actions",
    cell: (row) => row.action, // 👈 هنا هنعرِض الأزرار
  },
];

export const DepartmentButtons = ({ _id }) => {
  const navigate = useNavigate(); // 👈 عرفنا navigate هنا

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>

      <button className="px-3 py-1 bg-red-600 text-white">
        Delete
      </button>
    </div>
  );
};
