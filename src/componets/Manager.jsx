import React, { useEffect } from 'react'
import { useRef, useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {

  const ref = useRef();
  const [passwordArray, setPasswordArray] = useState([]);
  const [form, setform] = useState({
    site: '',
    username: '',
    password: ''
  });

  const passwordRef = useRef();

  const copytext = (e) => {
    // const texttocopy = e.target.text;
    navigator.clipboard.writeText(e);

    toast('Copied to Clipboard: ' + e, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  }

  const getPasswords = async () => {
    let response = await fetch('http://localhost:3000/passwords');
    let password = await response.json();
    if (password != null) {
      setPasswordArray(password);
    }
  }

  useEffect(() => {
    getPasswords();
  }, []);


  const showPassword = () => {
    if (passwordRef.current.type === "password") {
      passwordRef.current.type = "text";
      ref.current.src = "/icons/eye-svgrepo-com.svg";
    } else {
      passwordRef.current.type = "password";
      ref.current.src = "/icons/eye-off-svgrepo-com.svg";
    }
  }

  const SavePassword = async () => {
    if (form.site === '' || form.username === '' || form.password === '') {
      toast('Please fill all the fields', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (data.success) {
        toast('Password saved successfully!', {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
        setPasswordArray([...passwordArray, { ...form, _id: data.id }]);
        setform({ site: '', username: '', password: '' });
      }
    } catch (error) {
      console.error('Error saving password:', error);
      toast('Failed to save password', {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });
    }
  }
  const DeletePassword = async (id) => {
    let conform = window.confirm("Are you sure you want to delete this password?");
    if (conform) {
      try {
        const response = await fetch('http://localhost:3000/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await response.json();
        if (data.success) {
          setPasswordArray(passwordArray.filter(item => item._id !== id));
          toast('Password deleted successfully!', {
            position: "top-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        console.error('Error deleting password:', error);
        toast('Failed to delete password', {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
  }

  const HandleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
    // console.log(form);
  }

  const EditPassword = (id) => {
    const itemID = passwordArray.find(item => item._id === id);
    if (itemID) {
      setform({ site: itemID.site, username: itemID.username, password: itemID.password });
      setPasswordArray(passwordArray.filter(item => item._id !== id));
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />


      <div>
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

        <div className="container mx-auto bg-blue-950 p-4 sm:p-6 rounded-3xl shadow-2xl justify-center items-center m-1.5 mycontainer gap-1.5">
          <h1 className="text-white text-xl sm:text-2xl font-bold text-center mb-6">
            Password Manager
          </h1>
          <input type="text" name='site' id='website' className='rounded-2xl w-full bg-amber-50 mb-2.5 p-2 text-sm sm:text-base' value={form.site} onChange={HandleChange} placeholder='Enter WebSite URL' />

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 w-full">

            <input id='username' className='bg-amber-50 rounded-2xl p-1.5 flex-1 text-sm sm:text-base' name='username' type="text" value={form.username} onChange={HandleChange} placeholder='Enter Username' />
            <div className="relative flex items-center overflow-hidden rounded-2xl flex-1">

              <input ref={passwordRef} id='password' type="password" name='password' className='bg-amber-50 rounded-2xl p-1.5 pr-10 flex-1 text-sm sm:text-base' value={form.password} onChange={HandleChange} placeholder='Enter Password' />
              <span className='absolute right-3 text-sm cursor-pointer text-blue-950'><img className='h-5' ref={ref} onClick={showPassword} src="/icons/eye-off-svgrepo-com.svg" alt="" /></span>

            </div>
          </div>

          <button className="bg-blue-300 text-blue-950 font-bold rounded-2xl mt-2 flex items-center justify-center space-x-2 px-2.5 py-1.5 hover:bg-green-500 w-full" onClick={SavePassword}>
            <img className='h-6 cursor-pointer' src="/icons/add-ellipse-svgrepo-com.svg" alt="image" />
            Add Password
          </button>
        </div>
        <div className="passwords">
          <h2 className="text-white text-xl sm:text-2xl font-bold text-center mb-6">
            Your Saved Passwords:
          </h2>

          {passwordArray.length === 0 && <div className="text-white text-center text-sm sm:text-base"> No Passwords Saved Yet </div>}

          {passwordArray.length > 0 && <div className="hidden sm:block overflow-x-auto mx-auto mb-10 rounded-2xl shadow-2xl w-11/12 m-2.5">
            <table className="table-auto text-white w-full border-collapse text-sm">

              <thead className="bg-blue-700">
                <tr>
                  <th className='py-2 px-4 text-left'>Website</th>
                  <th className='py-2 px-4 text-left'>Username</th>
                  <th className='py-2 px-4 text-left'>Password</th>
                  <th className='py-2 px-4 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-blue-950">

                {passwordArray.map((item, index) => (
                  <tr key={item._id || index} className="border-b border-blue-700 hover:bg-blue-900">
                    <td className='py-2 px-4'>
                      <div className='flex justify-between items-center gap-2'>
                        <a href={item.site} target='_blank' className='break-all text-blue-300 hover:underline'>{item.site}</a>
                        <img className='h-5 cursor-pointer' onClick={() => copytext(item.site)} src="./icons/copy-course-svgrepo-com.svg" alt="copy" />
                      </div>
                    </td>
                    <td className='py-2 px-4'>
                      <div className='flex justify-between items-center gap-2'>
                        <span>{item.username}</span>
                        <img className='h-5 cursor-pointer' onClick={() => copytext(item.username)} src="./icons/copy-course-svgrepo-com.svg" alt="copy" />
                      </div>
                    </td>
                    <td className='py-2 px-4'>
                      <div className='flex justify-between items-center gap-2'>
                        <span>{item.password}</span>
                        <img className='h-5 cursor-pointer' onClick={() => copytext(item.password)} src="./icons/copy-course-svgrepo-com.svg" alt="copy" />
                      </div>
                    </td>
                    <td className='py-2 px-4 flex items-center gap-4'>

                      <img className='h-5 hover:bg-red-500 m-1' onClick={() => DeletePassword(item._id)} src="/icons/delete-svgrepo-com.svg" alt="" />
                      <img className='h-5 hover:bg-green-500 m-1' onClick={() => EditPassword(item._id)} src="/icons/edit-svgrepo-com.svg" alt="" />

                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          }

          {passwordArray.length > 0 && <div className="sm:hidden grid grid-cols-1 gap-4 mx-auto mb-10 px-2.5">
            {passwordArray.map((item) => (
              <div key={item._id} className="bg-blue-950 rounded-2xl shadow-2xl p-4 border border-blue-700">
                <div className="mb-3">
                  <p className="text-blue-300 text-xs font-bold">WEBSITE</p>
                  <div className='flex justify-between items-center gap-2 mt-1'>
                    <a href={item.site} target='_blank' className='break-all text-blue-200 hover:underline text-sm'>{item.site}</a>
                    <img className='h-5 cursor-pointer ' onClick={() => copytext(item.site)} src="./icons/copy-course-svgrepo-com.svg" alt="copy" />
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-blue-300 text-xs font-bold">USERNAME</p>
                  <div className='flex justify-between items-center gap-2 mt-1'>
                    <span className='text-sm break-all'>{item.username}</span>
                    <img className='h-5 cursor-pointer ' onClick={() => copytext(item.username)} src="./icons/copy-course-svgrepo-com.svg" alt="copy" />
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-blue-300 text-xs font-bold">PASSWORD</p>
                  <div className='flex justify-between items-center gap-2 mt-1'>
                    <span className='text-sm break-all'>{item.password}</span>
                    <img className='h-5 cursor-pointer ' onClick={() => copytext(item.password)} src="./icons/copy-course-svgrepo-com.svg" alt="copy" />
                  </div>
                </div>
                <div className='flex items-center gap-4 mt-4 pt-4 border-t border-blue-700'>
                  <img className='h-5 hover:bg-red-500 p-1 cursor-pointer' onClick={() => DeletePassword(item._id)} src="/icons/delete-svgrepo-com.svg" alt="delete" />
                  <img className='h-5 hover:bg-green-500 p-1 cursor-pointer' onClick={() => EditPassword(item._id)} src="/icons/edit-svgrepo-com.svg" alt="edit" />
                </div>
              </div>
            ))}
          </div>
          }
        </div>
      </div>

    </>
  )
}

export default Manager
