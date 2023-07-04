import { Box, useTheme } from '@mui/material'
import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { tokens } from '../../../theme'
import AdminHeader from '../AdminHeader'
import { useSelector } from 'react-redux'

const LineChart = ({ isDashboard = false }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { loading, salesLast12Months, error } = useSelector((state) => state.summary)
    console.log(salesLast12Months)
    const data = [
        {
            id: 'Sales',
            data: [

            ]
        }
    ]
    salesLast12Months && salesLast12Months.forEach((item, index) => {
        data[0].data.push({
            x: item._id,
            y: item.totalSalesAmount,
        })
    });
    return (
        <Box m='20px'>
            <AdminHeader title='line chart' subtitle='Sales of last 12 months' />
            {/* <Box height='65vh' minWidth='800px'> */}
            <div className='overflow-x-auto'>
                <div className='h-[65vh] min-w-[800px]'>
                    <ResponsiveLine
                        data={data}
                        theme={{
                            axis: {
                                domain: {
                                    line: {
                                        stroke: colors.grey[100]
                                    }
                                },
                                legend: {
                                    text: {
                                        fill: colors.grey[100]
                                    }
                                },
                                ticks: {
                                    line: {
                                        stroke: colors.grey[100],
                                        strokeWidth: 1
                                    },
                                    text: {
                                        fill: colors.grey[100]
                                    }
                                }
                            },
                            legends: {
                                text: {
                                    fill: colors.grey[100]
                                }
                            },
                            tooltip: {
                                container: {
                                    color: colors.primary[500]
                                }
                            }
                        }}
                        colors={isDashboard ? { datum: 'color' } : { scheme: 'nivo' }}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: true,
                            reverse: false
                        }}
                        yFormat=" >-.2f"
                        curve="catmullRom"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: isDashboard ? undefined : 'Months',
                            legendOffset: 36,
                            legendPosition: 'middle'
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickValues: 5,
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: isDashboard ? undefined : 'Sales',
                            legendOffset: -40,
                            legendPosition: 'middle'
                        }}
                        enableGridX={false}
                        enableGridY={false}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
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
                </div>
            </div>
            {/* </Box> */}
        </Box>
    )
}

export default LineChart