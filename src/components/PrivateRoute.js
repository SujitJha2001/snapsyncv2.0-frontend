import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { globalContext } from '../context/GlobalProvider';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
    const { socket, CHUNK_SIZE, socketId, recievingFileDetails, setRecievingFileDetails } = useContext(globalContext);
    const { recieverString } = useParams();
    const [isValid, setIsValid] = useState(null);
    const [popUpResponse, setPopUpResponse] = useState(null);
    const navigate = useNavigate();

    function showConfirmationDialog(message) {
        const isConfirmed = window.confirm(message);
        if (isConfirmed)
        {
            setPopUpResponse(true);
            setRecievingFileDetails((prev)=>{return {...prev,recieverSocketId:socketId}});
            socket.emit('updateRecieverSocketId', {recieverSocketId:socketId,recievingLink:recieverString});
        }
        else 
        {
            setPopUpResponse(false);
            navigate("/");
        }
    }
    useEffect(() => {
        if (socket && Object.keys(socket).length > 0) {
            socket.emit('validateRecieverStringAsk', recieverString);
            socket.on('validateRecieverStringReply', (response) => {
                setRecievingFileDetails(response)
                setIsValid(response.isValid);
            });
        } else {
            console.log('Socket is not initialized or does not have the emit method.');
            // console.error('Socket is not initialized or does not have the emit method.');
        }
    }, [socket, recieverString]);

    useEffect(() => {
        if(isValid)
        {
            /*******************************PROMPT ***************************************/
            showConfirmationDialog(
                `Do you want to recieve file ${(recievingFileDetails.fileName.length > 30) ? `${recievingFileDetails.fileName.slice(0, 25)}...${recievingFileDetails.fileName.slice(recievingFileDetails.fileName.length - 5, recievingFileDetails.fileName.length)}` : recievingFileDetails.fileName} of size - ${(recievingFileDetails.fileSize / (1024 * 1024)).toFixed(2)} MB`
            )
            /*******************************PROMPT ***************************************/            
        }
    }, [isValid])

    if ((isValid === null) || (isValid && popUpResponse===null)) {
        // Loading state, you can render a loader or other UI if needed
        return <Loader />;
    }

    return isValid && popUpResponse ? (
        children
    ) : (
        <Navigate to="/" />
    );
};

export default PrivateRoute;
