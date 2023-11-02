import React, { useRef, useState } from 'react'
import MaxWidthWrapper from '../../Common/MaxWidthWrapper/MaxWidthWrapper'
import { uploadPDF } from '../../../api/api'
import { Toast } from '../../../Utils/alert'
import PdfEdit from '../Pdfedit/PdfEdit'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const [isLoading,setIsLoading]=useState(false)
    const [fileId, setFileId] = useState('')
    const navigate=useNavigate()
    const IsUserAuth = useSelector((state) => state.user?.Token);
    const fileInputRef = useRef(null)
    const triggerAddFile = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };
      const handleFileInput = async(e) => {
        if(IsUserAuth){
        if (e.target.files) {
          setIsLoading(true)
          const selectedFile = e.target.files[0];
          if (selectedFile.type === "application/pdf") {
             const formData = new FormData();
            formData.append("file", selectedFile);
            const res = await uploadPDF(formData)
            if(res.status){
                setIsLoading(false)
                setFileId(res.response.files[res.response.files.length-1]._id)
            }
          } else {
            setIsLoading(false)
            Toast.fire({
                icon: "error",
                title: "Please add a PDF file",
              })
          }
        }
      }else {
        Toast.fire({
          icon: "error",
          title: "Please login",
        })
        setTimeout(()=>{
          navigate("/login")
        },1000)
      }
      };  
  return (
    <>
    {!fileId?
    <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
        <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
          <p className='text-sm font-semibold text-gray-700'>
            NEW TO PDF ?
          </p>
        </div>
        <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
          Edit and merge your {' '}
          <span className='text-secondary-500'>PDF </span>{' '}
          documents in seconds.
        </h1>
        <p className='mt-7 max-w-prose text-zinc-700 sm:text-lg'>
          PDF allows you to have edit and merge any
          PDF document. Simply upload your file and start
          selecting only required right away.
        </p>
        <input
             type="file"
             ref={fileInputRef}
             onChange={handleFileInput}
             className=" hidden mt-3"
           />
        <button className=" mt-7 rounded-full bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white"
        onClick={triggerAddFile}>
                  Get Started
        </button>
        
      </MaxWidthWrapper>
      :
      <PdfEdit fileId={fileId}/>
    }
    </>
  )
}

export default Home