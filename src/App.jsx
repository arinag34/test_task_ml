import React, { useState } from 'react';
import CSVUploader from './components/CSVUploader/CSVUploader.jsx';
import ExperimentList from './components/ExperimentList/ExperimentList.jsx';
import BuildChart from './components/BuildChart/BuildChart.jsx';

const App = () => {
    const [data, setData] = useState([]);
    const [experiments, setExperiments] = useState([]);
    const [selectedExperiments, setSelectedExperiments] = useState([]);

    const handleFileUpload = (parsedData) => {
        const cleanedData = parsedData.filter(row => row.experiment_id);
        setData(cleanedData);

        const uniqueExperiments = [...new Set(cleanedData.map(d => d.experiment_id))];
        setExperiments(uniqueExperiments);
    };

    return (
        <div>
            <h1>Visualize your experiments</h1>
            <CSVUploader onFileUpload={handleFileUpload} />
            <ExperimentList
                experiments={experiments}
                selected={selectedExperiments}
                onSelect={setSelectedExperiments}
            />
            <BuildChart data={data} selectedExperiments={selectedExperiments} />
        </div>
    );
};

export default App;
