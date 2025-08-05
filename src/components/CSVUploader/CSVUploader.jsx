import React from 'react';
import Papa from 'papaparse';
import styles from './CSVUploader.module.css';

const CSVUploader = ({ onFileUpload }) => {
    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                onFileUpload(result.data);
            }
        });
    };

    return (
        <div className={styles.uploader}>
            <input type="file" accept=".csv" onChange={handleChange} />
        </div>
    );
};

export default CSVUploader;
