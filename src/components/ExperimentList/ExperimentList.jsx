import React from 'react';
import { FixedSizeList as List } from 'react-window';
import styles from './ExperimentList.module.css';

const ExperimentList = ({ experiments, selected, onSelect }) => {
    const toggleSelect = (expId) => {
        onSelect(
            selected.includes(expId)
                ? selected.filter(id => id !== expId)
                : [...selected, expId]
        );
    };

    const Row = ({ index, style }) => {
        const exp = experiments[index];
        return (
            <div style={style} className={styles.row}>
                <label>
                    <input
                        type="checkbox"
                        checked={selected.includes(exp)}
                        onChange={() => toggleSelect(exp)}
                    />
                    {exp}
                </label>
            </div>
        );
    };

    return (
        <div className={styles.list}>
            <h3>Select Experiments</h3>
            <List
                height={400}
                itemCount={experiments.length}
                itemSize={35}
                width={300}
            >
                {Row}
            </List>
        </div>
    );
};

export default ExperimentList;
