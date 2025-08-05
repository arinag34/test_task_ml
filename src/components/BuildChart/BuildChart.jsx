import React, { useMemo, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import styles from './BuildChart.module.css';

const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#a28fd0', '#f95d6a', '#2f4b7c', '#665191'
];

const downsample = (data, maxPoints = 150) => {
    if (data.length <= maxPoints) return data;
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0);
};

const BuildChart = ({ data, selectedExperiments }) => {
    const [hoveredLine, setHoveredLine] = useState(null);

    const metricsByName = useMemo(() => {
        const result = {};

        for (const row of data) {
            const { experiment_id, metric_name, step, value } = row;

            if (!selectedExperiments.includes(experiment_id)) continue;

            if (!result[metric_name]) {
                result[metric_name] = {};
            }

            if (!result[metric_name][experiment_id]) {
                result[metric_name][experiment_id] = [];
            }

            result[metric_name][experiment_id].push({
                step: Number(step),
                [`value_${experiment_id}`]: Number(value),
            });
        }

        for (const metric in result) {
            for (const expId in result[metric]) {
                result[metric][expId].sort((a, b) => a.step - b.step);
                result[metric][expId] = downsample(result[metric][expId]);
            }
        }

        return result;
    }, [data, selectedExperiments]);

    return (
        <div className={styles.chartContainer}>
            {Object.entries(metricsByName).map(([metricName, experiments]) => (
                <div key={metricName} className={styles.chart}>
                    <h3>{metricName}</h3>
                    <LineChart
                        width={1000}
                        height={1000}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="step" />
                        <YAxis />
                        <Tooltip />
                        <Legend
                            onMouseEnter={(e) => {
                                if (e && e.dataKey) setHoveredLine(e.dataKey);
                            }}
                            onMouseLeave={() => setHoveredLine(null)}
                        />
                        {Object.entries(experiments).map(([experimentId, values], index) => {
                            const lineKey = `value_${experimentId}`;

                            return (
                                <Line
                                    key={experimentId}
                                    data={values}
                                    dataKey={lineKey}
                                    name={experimentId}
                                    type="monotone"
                                    dot={false}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={1.5}
                                    opacity={hoveredLine && hoveredLine !== lineKey ? 0.2 : 1}
                                    isAnimationActive={false}
                                />
                            );
                        })}
                    </LineChart>
                </div>
            ))}
        </div>
    );
};

export default BuildChart;
