import { useState } from "react";

type localMediaProps = {
    bufferUrl: string | ArrayBuffer,
    url: string
    type: string
}


const useGetLocalFiles = () => {
    const [loading, setLoading] = useState(false);

    const getLocalFiles = (files: FileList | null): Promise<localMediaProps[]> => {
        setLoading(true);
        return new Promise((resolve, reject) => {
            const loclUrl: localMediaProps[] = [];  
            if (!files || !files.length) {
                setLoading(false);
                return reject(loclUrl);                 
            }

            const arrFiles = Array.from(files);
            arrFiles.forEach((file, index) => {
                const readFile = new FileReader();
                readFile.readAsDataURL(file);                
                readFile.onload = (e) => {
                    loclUrl.push({
                        bufferUrl: e.target?.result || "",
                        url: URL.createObjectURL(file),
                        type: file.type,
                    });

                    if (index === arrFiles.length - 1) {
                        setLoading(false);
                        return resolve(loclUrl);
                    }
                };
            });
        });
    };

    return {getLocalFiles, loading};    
};

export default useGetLocalFiles;


