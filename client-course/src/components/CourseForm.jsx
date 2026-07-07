import { useEffect, useState } from "react";
import "./CourseForm.css";
import axios from 'axios'
function CourseForm() {
    const [course,setCourse]=useState({
        coursename:'',
        author:'',
        price:'',
        enroll:''
    })
    const [updateCount,setUpdateCount]=useState(0)
    const [data,setData]=useState([])
    const [editId,setEditId]=useState(null)
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setCourse((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        ...course,
        enroll: course.enroll === "true"
    };

    const { data } = await axios.post(
        "http://localhost:8080/course",
        payload
    );

    alert(data.message);

    setUpdateCount((prev) => prev + 1);

    setCourse({
        coursename: "",
        author: "",
        price: "",
        enroll: ""
    });
};

    const fetchCourse=async()=>{
        const res=await axios.get("http://localhost:8080/course/")
        setData(res.data)
    }
    useEffect(()=>{
        fetchCourse()
    },[updateCount])

    const deleteCourse=async(id)=>{
        const {data}=await axios.delete(`http://localhost:8080/course/${id}`)
        alert(data.message)
        setUpdateCount(updateCount+1)
    }

  const editCourse = (item) => {
    setCourse({
        coursename: item.coursename,
        author: item.author,
        price: item.price,
        enroll: String(item.enroll) // converts true/false to "true"/"false"
    });

    setEditId(item._id);
}
   const saveCourse = async (e) => {
    e.preventDefault();

    const payload = {
        ...course,
        enroll: course.enroll === "true"
    };

    const { data } = await axios.put(
        `http://localhost:8080/course/${editId}`,
        payload
    );

    alert(data.message);

    setUpdateCount((prev) => prev + 1);

    setCourse({
        coursename: "",
        author: "",
        price: "",
        enroll: ""
    });

    setEditId(null);
};
  return (
    <div className="page">

      {/* Form Section */}
      <div className="course-container">

        <div className="header">
          <h1>Course Management System</h1>
          <p>Create and manage your courses</p>
        </div>

        <form className="course-form" onSubmit={editId ? saveCourse: handleSubmit}>

          <div className="form-group">
            <label>Course Name</label>
            <input onChange={handleChange} value={course.coursename} name="coursename" type="text" placeholder="Enter Course Name" />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input onChange={handleChange} value={course.author} name="author" type="text" placeholder="Enter Author Name" />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input onChange={handleChange} value={course.price} name="price" type="number" placeholder="Enter Price" />
          </div>

          <div className="form-group">
            <label>Enrollment</label>
          <select
                name="enroll"
                value={course.enroll}
                onChange={handleChange}
            >
                <option value="">Select Status</option>
                <option value="true">True</option>
                <option value="false">False</option>
            </select>
          </div>

          <div className="button-group">

          {
            editId ?
            <button className="btn save-btn">Save Course</button> :
            <button className="btn save-btn">Add Course</button>

          }
           <button
            type="button"
            className="btn reset-btn"
            onClick={() => {
                setCourse({
                    coursename: "",
                    author: "",
                    price: "",
                    enroll: ""
                });

                setEditId(null);
            }}
        >
            Reset
        </button>
          </div>

        </form>

      </div>

      {/* Fetch Data Section */}
      <div className="course-list" style={{marginLeft:'12px'}} >

        <h2>Available Courses</h2>

     {data.map((item) => (
    <div className="course-card" key={item._id}>
        <h3>{item.coursename}</h3>

        <p>
            <strong>Author:</strong> {item.author}
        </p>

        <p>
            <strong>Price:</strong> ₹{item.price}
        </p>

        <p>
            <strong>Enrollment:</strong> {item.enroll ? "Available" : "Not Available"}
        </p>

        <div className="card-buttons">
            <button
                className="edit-btn"
                onClick={() => editCourse(item)}
            >
                Edit
            </button>

            <button
                className="delete-btn"
                onClick={() => deleteCourse(item._id)}
            >
                Delete
            </button>
        </div>
    </div>
))}



      </div>

    </div>
  );
}

export default CourseForm;