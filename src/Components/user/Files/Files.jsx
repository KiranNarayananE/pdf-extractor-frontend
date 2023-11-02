import React, { useCallback, useEffect, useState } from 'react'
import MaxWidthWrapper from '../../Common/MaxWidthWrapper/MaxWidthWrapper'
import { deletePdf, getFiles } from '../../../api/api';
import { ArrowDownOnSquareIcon ,TrashIcon} from "@heroicons/react/24/solid"

const Files = () => {
    const [data, setData] = useState([]);
    const getFile = useCallback(async () => {
        const fileData = await getFiles(); 
       
        setData(fileData[0].files);
      },[]);
      const handleDownload = async(fileData,fileName) => { 
        
        const uint8Array = new Uint8Array(fileData.data)
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
         const url = URL.createObjectURL(blob);
         const element = document.createElement('a');
         element.href = url;
         element.download = fileName;
         element.click();
         URL.revokeObjectURL(url);
       }

       const handleDelete= async(id) => { 
          let response=await deletePdf(id)
          if(response){
            setData( data.filter((val)=>{
                if(val._id!==id){
                    return val
                }
            }))
          }
       }

      useEffect(() => {
        getFile();
      }, [getFile]);
  return (
    <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 '>
        <div className="min-w-screen flex items-center justify-center font-sans overflow-x-scroll scrollbar-hide">
          <div className="w-full lg:w-5/6">
            <div className=" shadow-md rounded my-6 ">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className=" bg-gray-200 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-center">Name</th>
             
                    <th className="py-3 px-6 text-center">Delete</th>
                    <th className="py-3 px-6 text-center">Download</th>
                    
                  </tr>
                </thead>
                <tbody className=" text-sm font-light">
                  {data
                    .map((pdf, index) => (
                      <tr
                        className="border-b border-gray-200 hover:bg-gray-100"
                        key={pdf._id}
                      >
                        <td
                          className="py-3 px-6 text-center"
                          key={pdf?.modifiedFileName}
                        >
                          <div className="flex items-center justify-center">
                            {pdf?.modifiedFileName}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <div
                              className="w-4 mr-2 transform hover:text-secondary-500 hover:scale-110"
                              key={pdf?.originalFileName}
                            >
                              <TrashIcon
                                
                                onClick={() => {
                                    handleDelete(pdf?._id);
                                  }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <div
                              className="w-4 mr-2 transform hover:text-secondary-500 hover:scale-110"
                              key={pdf?._id}
                            >
                              <ArrowDownOnSquareIcon

                                onClick={() => {
                                    handleDownload(pdf?.modifiedFileData,pdf?.modifiedFileName);
                                  }}
                              />
                            </div>
                          </div>
                        </td>

                        
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
    </MaxWidthWrapper>
  )
}

export default Files