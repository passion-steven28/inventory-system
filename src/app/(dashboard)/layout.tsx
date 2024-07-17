import NavigationBar from '@/components/shared/header/NavigationBar'
import TopNav from '@/components/shared/header/TopNav'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <header className='grid sticky top-0 z-50 bg-muted/80 backdrop-blur-xl py-2 px-10 mb-4 w-full'>
                <TopNav />
                <Separator className='my-2 w-full h-[0.15rem] bg-gray-600 rounded-full' />
                <NavigationBar />
            </header>
            {children}
        </>
    )
}

export default layout
