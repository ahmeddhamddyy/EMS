/*import axios from 'axios'
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

/*export const DepartmentButtons = ({ Id, onDepartmentDelete }) => {
  const navigate = useNavigate(); // 👈 عرفنا navigate هنا

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you want to delete")
    if(confirm){
     try{
                const response = await axios.delete(
                    `http://localhost:5000/api/department/${id}`, 
                    {
                    headers: {
                        "Authorization" : `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
                if(response.data.success){
                onDepartmentDelete(id)
                }
            }catch(error){
                if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
            }
          }      
  };
  */
/*export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/department/${_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      // بعد ما الـ backend يحذف، نحدث الـ state في frontend
      onDepartmentDelete(_id);

    } catch (err) {
      alert("Delete failed");
    }
  };
  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate
          (`/admin-dashboard/department/${Id}`
        )}
      >
        Edit
      </button>
      <button className="px-3 py-1 bg-red-600 text-white"
      onClick={() => handleDelete(Id)}
      >Delete</button>
    </div>
  );
};
*/

import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  { name: "S No", selector: (row) => row.sno },
  { name: "Department Name", selector: (row) => row.dep_name },
  { name: "Actions", cell: (row) => row.action },
];

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/department/${_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onDepartmentDelete(_id);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex space-x-3">
      <button className="px-3 py-1 bg-teal-600 text-white" onClick={() => navigate(`/admin-dashboard/department/${_id}`)}>
        Edit
      </button>
      <button className="px-3 py-1 bg-red-600 text-white" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
