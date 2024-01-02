import React, { useEffect, useState } from 'react'
import { createContext } from "react";
import { io } from "socket.io-client";

export const globalContext = createContext();

const CHUNK_SIZE = 524288; 
export const GlobalProvider = ({ children }) => {
    const [socket, setSocket] = useState({})
    const [socketId, setSocketId] = useState('');
    const [fileDataInChunks, setFileDataInChunks] = useState([])
    const [recievingFileDetails, setRecievingFileDetails] = useState({});
    const [triggerSendFile, setTriggerSendFile] = useState({});
    const [triggerAcceptFile, setTriggerAcceptFile] = useState({});
    const [downloadCompleted, setDownloadCompleted] = useState(false);
    const [qrModal,setQrModal] = useState(false);
    useEffect(()=>{
        console.log(fileDataInChunks)
    },[fileDataInChunks])
    useEffect(() => {
        if (!(Object.keys(socket).length > 0)) {
            console.log("Request to Connect")
            // let socket = io("http://localhost:4003");
            // let socket = io("https://snapsyncv2-backend.azurewebsites.net");
            let socket = io("https://snapsync-backendv2-0.onrender.com");
            
            setSocket(socket)
        } else {
            //FOR BOTH
            socket.on("ConnectionEstablished", (data) => {
                setSocketId(data);
                console.log("Connected to socket");
            });
            //FOR SENDER
            socket.on("sendFileToReciever", (data) => {
                setTriggerSendFile(data)
            })
            //FOR RECIEVER
            socket.on("recieveTheChunk", (fileData) => {
                setTriggerAcceptFile(fileData);
            })

        }
    }, [socket])

    useEffect(() => {
        const { index, recievingLink } = triggerSendFile
        if (Object.keys(socket)?.length > 0 && Object.keys(triggerSendFile)?.length > 0)
        {
            socket.emit("sendingTheChunk", { fileData: fileDataInChunks[index], index, recievingLink })
            setRecievingFileDetails((prev)=>{return {...prev,currentIndex:index+1}})
        }
    }, [triggerSendFile])

    useEffect(() => {
        if (Object.keys(socket)?.length > 0 && Object.keys(triggerAcceptFile)?.length > 0)
        {
            setFileDataInChunks((prev)=>[...prev,triggerAcceptFile.fileData])
            setRecievingFileDetails((prev)=>{return {...prev,currentIndex:triggerAcceptFile.index+1}})
            if(triggerAcceptFile.index!=recievingFileDetails.totalIndexes-1)
            {
                socket.emit("sendMeFile",{index:triggerAcceptFile.index+1,recievingLink:triggerAcceptFile.recievingLink});           
            }
            else
            {
                setDownloadCompleted(true);
            }
        }
    }, [triggerAcceptFile])
    return (
        <globalContext.Provider value={{ socket, socketId, CHUNK_SIZE, recievingFileDetails, setRecievingFileDetails,fileDataInChunks, setFileDataInChunks,downloadCompleted ,qrModal,setQrModal }}>
            {children}
        </globalContext.Provider>
    )
}
