import React, { useContext, useEffect, useState } from 'react'
import toast from "react-hot-toast"; // Import toast module from react-hot-toast for displaying notifications
import { globalContext } from '../context/GlobalProvider';
import Loader from './Loader';
import '../App.css';
import Navbar from './Navbar';
import image from '../assets/home.svg'
import ellipsisBL from '../assets/bg_bl.svg'
import ellipsisTL from '../assets/bg_tl.svg'
import LinkAndQr from './LinkAndQr';

const Sender = () => {
    const { socket, socketId, CHUNK_SIZE, recievingFileDetails, setRecievingFileDetails, setFileDataInChunks, qrModal, setQrModal } = useContext(globalContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingFile, setUploadingFile] = useState(0);
    const [recieverLink, setRecieverLink] = useState('');
    function onFileSelect(fileRecieved) {
        if (fileRecieved && fileRecieved.files.length > 0 && fileRecieved.files[0]) {
            setUploadingFile(1);
            setSelectedFile(() => fileRecieved.files[0]);

            const reader = new FileReader();
            reader.onload = (event) => {
                const fileData = event.target.result;
                const totalChunks = Math.ceil(fileData?.byteLength / CHUNK_SIZE);
                for (let i = 0; i < totalChunks; i++) {
                    const start = i * CHUNK_SIZE;
                    const end = Math.min((i + 1) * CHUNK_SIZE, fileData.byteLength);
                    const chunk = fileData.slice(start, end);
                    const chunkArray = new Uint8Array(chunk);
                    setFileDataInChunks((prev) => [...prev, chunkArray])
                }
                /******************************************generateUniqueId ****************************/
                const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                let uniqueString = '';

                for (let i = 0; i < 10; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    uniqueString += characters.charAt(randomIndex);
                }
                // setRecieverLink(`https://snapsync.netlify.app/recieve/${uniqueString}`)
                setRecieverLink(`http://localhost:3000/recieve/${uniqueString}`)
                setQrModal(true);
                /******************************************generateUniqueId*****************************/
                setUploadingFile(2);
                setRecievingFileDetails({ fileName: fileRecieved.files[0].name, fileSize: fileData.byteLength, recievingLink: uniqueString, senderSocketId: socketId, recieverSocketId: '', currentIndex: 0, totalIndexes: totalChunks })
                socket.emit('fileReadyToUpload', { fileName: fileRecieved.files[0].name, fileSize: fileData.byteLength, recievingLink: uniqueString, senderSocketId: socketId, recieverSocketId: '', currentIndex: 0, totalIndexes: totalChunks });
                toast.success(`File Uploaded ${recieverLink}`);
            };
            reader.readAsArrayBuffer(fileRecieved.files[0]);
        }
        else {
            toast.error("File Missing");
        }
    }



    return (
        <div className='sender'>
            {/* <div class="ellipse"></div> */}
            <Navbar />
            {Object.keys(socket).length == 0 && <Loader />}
            <img src={ellipsisTL} alt="ellipsisTL" className="bg_tl" />
            <img src={ellipsisBL} alt="ellipsisBL" className="bg_bl" />
            {socket && Object.keys(socket).length > 0 && <div className='innerBody'>
                {qrModal && recieverLink.length > 0 && <LinkAndQr recieverLink={recieverLink} />}
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
                        {/*Show select file only if file is not selected */}
                        {!selectedFile && <div className="file-input-container">
                            <label htmlFor="fileInput" className="custom-file-label">Select File</label>
                            <input type="file" id="fileInput" accept="*/*" multiple={false} onChange={(e) => { onFileSelect(e.target) }} />
                        </div>}
                        

                        {/* Show file uploading if it's uploading */}
                        {(uploadingFile == 1) && <span className="loader"></span>}
                        {/* If file is selected then show it's name */}
                        {selectedFile && <span id="fileName">{(selectedFile.name.length > 30) ? `${selectedFile.name.slice(0, 25)}...${selectedFile.name.slice(selectedFile.name.length - 5, selectedFile.name.length)}` : selectedFile.name}</span>}
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

export default Sender