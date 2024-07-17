import React from 'react'

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import Logo from '@/components/ui/logo'

type Props = {}

function TopNav({ }: Props) {
    return (
        <div className='flex items-center justify-between'>
            {/* logo component */}
            <Logo
                src='logo.svg'
                alt='Logo'
            />

            {/* search bar component */}
            <div className='flex items-center justify-between w-1/2'>
                <Input
                    type='search'
                    placeholder='Search products, sales, etc...'
                    className='size-full rounded-full'
                />
            </div>

            <div>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

export default TopNav