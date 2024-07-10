import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const LineChart = ({ data }) => (
    <ResponsiveLine
        data={[
            {
                "id": "Revenue",
                "color": "hsl(29, 70%, 50%)",
                "data": data,
            }
        ]}
        margin={{ top: 20, right: 110, bottom: 50, left: 75 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Month',
            legendOffset: 36,
            legendPosition: 'middle',
            tickColor: '#fff'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Revenue(VND)',
            legendOffset: -70,
            legendPosition: 'middle',
            tickColor: '#fff'
        }}
        pointSize={10}
        pointColor={{ from: 'color' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
);

export default LineChart;
