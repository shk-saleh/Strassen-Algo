import React, { useState } from 'react'
import axios from 'axios';

const Form = () => {

    const [inputs, setInputs] = useState({firstname: ' ', lastname: ' ', email: ' ', password: ''});
    const [message, setMessage] = useState('');


    const submitForm = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post('http://localhost:8000/', inputs);
          if (res.data === "Student added!") {
            setMessage("Form submitted successfully!");
            setInputs({ firstname: '', lastname: '', email: '', password: '' });
          }
        } catch (error) {
          setMessage("Failed to submit form.");
        }
    };
    

    return (

        <div className='w-100 p-4 border border-gray-500 flex justify-center rounded-2xl'>

            <form className='w-full'>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">First Name :</legend>
                    <input type="text" className="input w-full" placeholder="Type here"  value={inputs.firstname} onChange={(e) => setInputs({ ...inputs, firstname: e.target.value })}/>
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Last Name :</legend>
                    <input type="text" className="input w-full" placeholder="Type here" value={inputs.lastname} onChange={(e) => setInputs({ ...inputs, lastname: e.target.value })} />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email :</legend>
                    <input type="email" className="input w-full" placeholder="Type here" value={inputs.email} onChange={(e) => setInputs({ ...inputs, email: e.target.value })}/>
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Password :</legend>
                    <input type="password" className="input w-full" placeholder="Type here" value={inputs.password} onChange={(e) => setInputs({ ...inputs, password: e.target.value })} />
                </fieldset>

                <button onClick={submitForm} className="btn w-full mt-4">Register</button>

                {message && (
                    <span className="text-green-600 font-semibold mt-4">{message}</span>
                )}

            </form>

        </div>
    )
}

export default Form