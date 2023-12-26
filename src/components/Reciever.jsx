import React, { useContext, useEffect, useState } from 'react'
import toast from "react-hot-toast"; // Import toast module from react-hot-toast for displaying notifications
import { globalContext } from '../context/GlobalProvider';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';
import '../App.css';
import Navbar from './Navbar';
import image from '../assets/home.svg'
import ellipsisBL from '../assets/bg_bl.svg'
import ellipsisTL from '../assets/bg_tl.svg'

const Reciever = () => {
    const { socket, CHUNK_SIZE, socketId, recievingFileDetails, setRecievingFileDetails, downloadCompleted, fileDataInChunks } = useContext(globalContext);
    const { recieverString } = useParams();
    useEffect(() => {
        socket.emit("sendMeFile", { index: 0, recievingLink: recieverString });
    }, [])
    useEffect(() => {
        if (downloadCompleted == true) {
            console.log("Download Completed");
            const chunks = fileDataInChunks?.map(chunk => new Uint8Array(chunk).buffer);
            const blob = new Blob(chunks, { type: "application/octet-stream" });

            // Create a link element to trigger the download
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = recievingFileDetails.fileName;
            // Trigger the download
            downloadLink.click();

            // Clean up the URL object
            URL.revokeObjectURL(downloadLink.href);
        }
    }, [downloadCompleted])
    /**
     *             
            {socket && Object.keys(socket).length > 0 && Object.keys(recievingFileDetails).length > 0 && <div className='innerBody'>
                <h1>{recieverString}</h1>
            </div>}
     */
    return (
        <div className='sender'>
            {/* <div class="ellipse"></div> */}
            <Navbar />
            {(Object.keys(socket).length == 0 || Object.keys(recievingFileDetails).length == 0) && <Loader />}
            <img src={ellipsisTL} alt="ellipsisTL" className="bg_tl" />
            <img src={ellipsisBL} alt="ellipsisBL" className="bg_bl" />
            {socket && Object.keys(socket).length > 0 && <div className='innerBody'>
                <div className='leftPart'>
                    <div className='middlePart'>
                        <div className='shortDescription'>
                            <span className='firstTitle'>Effortless File Sharing with</span>
                            <span className='secondTitle'>SNAP</span>
                            <span className='thirdTitle'>SYNC</span>
                        </div>
                        <div className='longDescription'>
                            <span className='longDescriptionContent'>Welcome to SNAP SYNC, your go-to platform for seamless file sharing. Experience a straightforward process to upload and download files effortlessly.
                            </span>
                        </div>
                        {/* If file is selected then show it's name */}
                        {socket && Object.keys(socket).length > 0 && Object.keys(recievingFileDetails).length > 0 && <span id="fileName">{(recievingFileDetails.fileName.length > 30) ? `${recievingFileDetails.fileName.slice(0, 25)}...${recievingFileDetails.fileName.slice(recievingFileDetails.fileName.length - 5, recievingFileDetails.fileName.length)}` : recievingFileDetails.fileName}</span>}
                        <div class="slidecontainer">
                            <input type="range" min="0" max="100" value={Math.ceil((recievingFileDetails.currentIndex / recievingFileDetails.totalIndexes) * 100)} className="slider" id="myRange" />
                            <span>{`${((recievingFileDetails.currentIndex / recievingFileDetails.totalIndexes) * 100).toFixed(2)}%`}</span>
                        </div>
                    </div>
                    <div className='endPart'>
                        <span className='note-title'>Note</span>
                        <span>1. Click on the 'Select File' button.</span>
                        <span>2.Your file will be securely uploaded, and a unique link and QR code will be</span>
                        <span style={{ margin: "0px 0px 0px 10px" }}>generated.</span>
                    </div>
                </div>
                <div className='rightPart'>
                    <img className='img' src={image} alt="React Image" />
                </div>
            </div>}
        </div>
    )
}

export default Reciever