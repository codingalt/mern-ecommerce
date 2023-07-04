import { Box, useTheme } from '@mui/material'
import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { tokens } from '../../../theme'
import AdminHeader from '../AdminHeader'
import { useSelector } from 'react-redux'

const PieChart = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { loading, productCategories, error } = useSelector((state) => state.summary)
    const data = []
    productCategories && productCategories.forEach((item, index) => {
        data.push({
            id: item._id,
            label: item._id,
            value: item.numOfProducts,
        })
    });
    return (
        <Box m='20px'>
            <AdminHeader title='pai chart' subtitle='Products in each category' />
            <div className='overflow-x-auto'>
                <div className='h-[65vh] min-w-[800px]'>
                    <ResponsivePie
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
                            }
                        }}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        borderWidth={1}
                        borderColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    0.2
                                ]
                            ]
                        }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor={colors.grey[100]}
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    2
                                ]
                            ]
                        }}
                        defs={[
                            {
                                id: 'dots',
                                type: 'patternDots',
                                background: 'inherit',
                                color: 'rgba(255, 255, 255, 0.3)',
                                size: 4,
                                padding: 1,
                                stagger: true
                            },
                            {
                                id: 'lines',
                                type: 'patternLines',
                                background: 'inherit',
                                color: 'rgba(255, 255, 255, 0.3)',
                                rotation: -45,
                                lineWidth: 6,
                                spacing: 10
                            }
                        ]}
                        fill={[
                            {
                                match: {
                                    id: 'ruby'
                                },
                                id: 'dots'
                            },
                            {
                                match: {
                                    id: 'c'
                                },
                                id: 'dots'
                            },
                            {
                                match: {
                                    id: 'go'
                                },
                                id: 'dots'
                            },
                            {
                                match: {
                                    id: 'python'
                                },
                                id: 'dots'
                            },
                            {
                                match: {
                                    id: 'scala'
                                },
                                id: 'lines'
                            },
                            {
                                match: {
                                    id: 'lisp'
                                },
                                id: 'lines'
                            },
                            {
                                match: {
                                    id: 'elixir'
                                },
                                id: 'lines'
                            },
                            {
                                match: {
                                    id: 'javascript'
                                },
                                id: 'lines'
                            }
                        ]}
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 56,
                                itemsSpacing: 0,
                                itemWidth: 100,
                                itemHeight: 18,
                                itemTextColor: '#999',
                                itemDirection: 'left-to-right',
                                itemOpacity: 1,
                                symbolSize: 18,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#000'
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                </div>
            </div>
        </Box>
    )
}

export default PieChart