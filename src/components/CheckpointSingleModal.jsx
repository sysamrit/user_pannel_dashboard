import React, { useState } from 'react';
import '../style/fileinputbtn.css';
import Fileinputbutton from './Fileinputbutton';

function CheckpointSingleModal({ setVisibleContainer, modalVisible }) {
    const [addFileImage, setAddFileImage] = useState([""]);

    const addFile = () => {
        setAddFileImage([...addFileImage, ""]);
    }

    const updateAddFile = (content, index) => {
        const addFileData = [...addFileImage];
        addFileData[index] = content;
        setAddFileImage(addFileData);
    }

    const handleClickCancel = () => {
        setVisibleContainer(false);
    };

    const handleFileDelete = () => {
        setAddFileImage([""]);
    };

    React.useEffect(() => {
        if (!modalVisible) {
            handleFileDelete();
        }
    }, [modalVisible]);

    return (
        <>
            <div className='view_image_modal' style={modalVisible ? { zIndex: 10 } : { zIndex: -10 }}>
                <div className="scrolling_container">
                    <h3>Upload Files</h3>
                    <div className='inputFileButton'>
                        {addFileImage && addFileImage.map((ele, indx) => {
                            return <Fileinputbutton inputFileUpdate={updateAddFile} key={indx} index_no={indx} value={ele} />
                        })}
                    </div>
                </div>
                <div className="cancel_btn">
                    <button type='button' onClick={handleClickCancel} style={{ backgroundColor: "gray" }}>Cancel</button>
                    <button type='button' onClick={addFile} style={{ backgroundColor: "green" }}>Add</button>
                </div>
            </div>
        </>
    );
}

export default CheckpointSingleModal;
