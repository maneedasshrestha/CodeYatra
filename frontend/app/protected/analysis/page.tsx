import CsvAnalysis from '@/components/CsvAnalysis'
import React from 'react'

const page = () => {
    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
            <CsvAnalysis />
        </div>
        </>
    )
}

export default page