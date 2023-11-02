import React, { useCallback } from 'react'
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { DragDropContext,Draggable, Droppable} from 'react-beautiful-dnd';
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { useEffect, useState } from "react";
import { downloadExtractedPDF, getUploadedPDF, mergePDF } from '../../../api/api';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();
const PdfEdit = ({fileId}) => {
    const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [extractedFileId, setExtractedFileId] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  let count =0
  if(pages.length){
    count=pages.reduce((acc,curr)=>{
      if(curr.selected){
        acc++
      }
      return acc
    },0)
  }
  const getFile = useCallback(async () => {
    const fileData = await getUploadedPDF(fileId); 
    const pdfArrayBuffer = fileData;
    const uint8Array = new Uint8Array(pdfArrayBuffer); 

    const blob = new Blob([uint8Array], { type: "application/pdf" });
    const fileObject = new File([blob], "lastAdded.pdf", {
      type: "application/pdf",
    })
    setFile(fileObject);
  },[fileId]);
  const handleDocumentLoadSuccess = ({ numPages }) => {
    let pages=[]
    for(let i=1;i<=numPages;i++){
       pages.push({value:i,selected:false})
    }
    setPages(pages)
  };
  const setSelectedPage = (page) => {
    setPages(pages.filter(val=>{
      if(val.value===page){
        val.selected=!val.selected
      }
      return val
    }))
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let page;
    let newPages= pages
    //  Logic
    if (source.droppableId === "available" && destination.droppableId=== "available") {
      page = newPages[source.index];
      if (source.index < destination.index) {
        
        for (let i = source.index; i < destination.index; i++) {
          newPages[i] = newPages[i + 1];
        }
      } else if (source.index > destination.index) {
       
        for (let i = source.index; i > destination.index; i--) {
          newPages[i] = newPages[i - 1];
        }
    } 
    newPages[destination.index] = page
    setPages(newPages)
  };
}
const handleSubmit = async () => {
  setIsLoading(true)
  const bodyData = {
    pages,
    fileId,
  };

  const data = await mergePDF(bodyData)
  
  
  if (data.status) {
    setIsLoading(false)
    setExtractedFileId(data.fileId) 
    
  } 
};
const handleDownload = async() => {
 const {fileData,fileName}= await downloadExtractedPDF(extractedFileId) 
 console.log(fileData)
 const uint8Array = new Uint8Array(fileData.data)
 const blob = new Blob([uint8Array], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const element = document.createElement('a');
  element.href = url;
  element.download = fileName;
  element.click();
  URL.revokeObjectURL(url);
}
const handleReset = async() => {
  setExtractedFileId("")
 }

  useEffect(() => {
    
    getFile();
  }, [getFile]);
  return (
    <>
      
        <div className="w-full h-full flex mt-20 sm:mt-30">
           <DragDropContext onDragEnd={onDragEnd}>
          

        <Droppable droppableId="available" direction={"horizontal"}>
        {(provided, snapshot) => (
  <div className="md:w-9/12 w-full px-2 xl:px-16 pt-16 min-h-screen"
  ref={provided.innerRef}
  {...provided.droppableProps}>
    {file && (
      <Document
        file={file}
        onLoadSuccess={handleDocumentLoadSuccess}
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-12"
      >
        {pages.map((el, index) => ( 
          
          <Draggable draggableId={index.toString()} index={index}>
          {(provided, snapshot) => (
          <div
          className={`relative rounded-lg shadow-md p-2 md:p-5 bg-white ${el.selected ? 'border-double border-4 border-primary-100' : ''}`}
          onClick={()=>{setSelectedPage(el.value)}}
          key={el.value}
          {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
          >
            {console.log(index)}
            <p className="hidden">{el.value}</p>
            <Page
              className="border-2 flex justify-center"
              pageNumber={el.value}
              width={150}
            />
            <label>
              Page {el.value}
              
            </label>
          </div>
          )}
          </Draggable>
        ))}
      </Document>
    )}
    {provided.placeholder}
  </div>
   )}
   </Droppable>

   </DragDropContext>

        
          <div className="md:w-3/12 hidden md:flex flex-col justify-center top-5 sticky  max-h-[640px] ">
            <div className="flex flex-col  px-3 ">
              <h3 className="text-3xl text-center mt-5 mb-10 ">
                Extract pages
              </h3>
              <p className="text-xl text-center mt-5 mb-10 ">
                Just <span className='text-primary-300'>Click</span> to select pages And <span className='text-primary-300'>Drag</span> to rearrange
              </p>
              
              <p className="text-xl text-center mt-5 mb-2 ">
              Pages to Extract:{count}
              </p>

             {extractedFileId?
            <div className='flex justify-between'>
         <button
         onClick={handleDownload}
         className="self-center mt-5 w-auto h-auto px-3 py-2 rounded-lg bg-secondary-500 text-white font-semibold"
         >
         Download
         </button>
          <button
          onClick={handleReset}
          className="self-center mt-5 w-auto h-auto px-3 py-2 rounded-lg bg-secondary-500 text-white font-semibold"
          >
          Reset
          </button>
          </div>

              :
<button
                onClick={handleSubmit}
                className="self-center mt-5 w-auto h-auto px-3 py-2 rounded-lg bg-secondary-500 text-white font-semibold"
              >
                Let's Extract
              </button>
}
            </div>
          </div>
        </div>

        {/* div for displaying extraction handling panel on sm only */}
        <div className="md:hidden sticky bottom-0 z-30 flex  w-[100%] bg-white pb-2">
          <div className="flex flex-col w-full px-4 ">
            <h3 className="text-3xl text-center mt-5 mb-10 ">Extract pages</h3>
            

            <label htmlFor="toExtract">
              Pages to Extract:5
            </label>

            <input
              id="toExtract"
              className=" ps-2 w-full border-2 border-black rounded-md"
              readOnly
              value="5"
            />

            <button
              
              className="self-center mt-10 w-auto h-auto px-3 py-2 rounded-lg bg-green-400 text-white font-semibold"
            >
              Let's merge
            </button>
          </div>
        </div>
        
       
      </>
  )
}

export default PdfEdit