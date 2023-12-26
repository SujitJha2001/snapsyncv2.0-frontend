import React, { useContext, useEffect } from 'react';
import '../assets/LinkAndQr.css';
import { globalContext } from '../context/GlobalProvider';
import QRCode from "qrcode.react";
import toast from "react-hot-toast";

const LinkAndQr = ({ recieverLink }) => {
    const { qrModal, setQrModal, recievingFileDetails } = useContext(globalContext)

    function copyToClipboard() {
        navigator.clipboard.writeText(recieverLink)
            .then(() => {
                toast.dismiss();
                toast.success("Receiver Link Copied");
            })
            .catch((err) => {
                console.error(err)
                toast.error('Unable to copy to clipboard');
            });
    }

    return (
        <div className='record-modal'>
            {/* <div className='record-close'>
                <button onClick={() => { setQrModal(false) }} >X</button>
            </div> */}
            <div className='record-modal-body'>
                <div className='qr'>
                    <div className='QRCode'>
                        <QRCode value={recieverLink} />
                    </div>
                </div>
                <div className='input'>
                    <div className='check-class-input-btn'>
                        <input type="text" placeholder="Sharing Link" value={recieverLink} disabled="true" />
                        <button onClick={copyToClipboard}>Copy Link</button>
                    </div>
                    <div class="slidecontainer">
                        <input type="range" min="0" max="100" value={Math.ceil((recievingFileDetails.currentIndex/recievingFileDetails.totalIndexes)*100)} className="slider" id="myRange"  style={{ background: 'orange' }} 
                        // onChange={(e) => { setProgress(e.target.value) }} 
                        />
                        <span>{`${((recievingFileDetails.currentIndex/recievingFileDetails.totalIndexes)*100).toFixed(2)}%`}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinkAndQr