import React, { useState } from "react";
import JSZip from "jszip";


function LandingPage() {
    const [files, setFiles] = useState([]);
    const [warnings, setWarning] = useState("");
    const [count, setCount] = useState([]);
    const valid_extensions = [".cpg", ".bpf", ".prj", ".shp", ".shx"]
    
    function validateFiles(files) {
        const cnt = [0, 0, 0, 0, 0]
        for (let i = 0; i < files.length; i++) {
            const file = files[i].name;
            console.log(file.name);
            for (let j = 0; j < valid_extensions.length; j++) {
                if (file.endsWith(valid_extensions[j])) cnt[j]++;
            }
        }
        let valid = 1;
        for (let i = 1; i < valid_extensions.length; i++) {
            if (cnt[i] !== cnt[i - 1]) valid = 0;
        }
        if (!valid) {
            alert("Please upload ")
        }
        setCount(cnt);
        
    }
    
    function handleZipUpload(e) {
        const zip_file = e.target.files;
        if (!zip_file) {
            alert("Upload failed\nPlease reupload the zip file");
            setWarning("Upload failed\nPlease reupload the zip file");
            return
        }
        if (zip_file.length > 1 || zip_file.length === 0) {
            alert("Please upload only single zip file");
            setWarning("Please upload only single zip file")
            return
        }
        const reader = new FileReader();
        const selcted_zip = zip_file[0];

        reader.onload = async (evt) => {
            const buf = evt.target.result;

            try {
                const zip_ = await JSZip.loadAsync(buf);
                const filesInZip = [];

                // Use `Object.values` to get all files as an array
                const filesArray = Object.values(zip_.files);

                for (const zip_file of filesArray) {
                    if (!zip_file.dir) {
                    const content = await zip_file.async("uint8array");
                    filesInZip.push({
                        name: zip_file.name,
                        dir: zip_file.dir,
                        size: content.length, // ✅ Real uncompressed size in bytes
                    });
                    } else {
                    filesInZip.push({
                        name: zip_file.name,
                        dir: zip_file.dir,
                        size: 0, // ✅ Directories have no size
                    });
                    }
                }

                setFiles(filesInZip);
                console.log(filesInZip);
            }
            catch (err) {
                console.log(err);
                setWarning(err.toString());
            }

        }
        reader.readAsArrayBuffer(selcted_zip);
        validateFiles(files);
    }
    return (
        <div>
            <h1>Welcome </h1>
            <label>
                Enter the start year: &nbsp;
                <input
                    type="number"
                    min={1900}
                    max={new Date().getFullYear()} 
                />
            </label>
            <br/>
            <label>
                Enter the end year: &nbsp;
                <input
                    type="number"
                    min={1900}
                    max={new Date().getFullYear()} 
                />
            </label>
            <br/>
            <label>
                Upload  zip file (ends with ".zip"): &nbsp;
            </label>
            <input 
                type="file" 
                accept=".zip"
                onChange={handleZipUpload} 
            />

            <ul>
                {files.map((f, i) => (
                    <li key={i}>
                    Name: {f.name}, Size: {f.size}
                    </li>
                ))}
            </ul>
            
            {count.length > 0 && (
                <>
                    <h3>File Counts:</h3>
                    <ul>
                    {count.map((c, i) => (
                        <li key={i}>
                        {valid_extensions[i]} : {c}
                        </li>
                    ))}
                    </ul>
                </>
                )}


            <p>{warnings}</p>
        </div>
    );
}

export default LandingPage;