import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import LoadSubmittedFile from './LoadSubmittedFile';

function NextPage() {
    const { state } = useLocation();
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!state?.fileUrl) return;
        // Fetch the uploaded file and convert to a File object
        fetch(state.fileUrl)
            .then(res => res.blob())
            .then(blob => {
                const fileName = state.fileUrl.split('/').pop();
                setFile(new File([blob], fileName, { type: blob.type }));
            });
    }, [state]);

    return (
        <div>
            <LoadSubmittedFile file={file} onLoad={(loaded) => console.log(loaded)} />
        </div>
    );
}

export default NextPage;