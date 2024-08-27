'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useRef, useEffect } from 'react';

export type ChatWindowOptions = {
    width: string | number,
    height: string | number,
    children?: JSX.Element | JSX.Element[]
}

export default function ChatWindow({
    width, height, children
}: ChatWindowOptions) {
    const ref = useRef<HTMLElement | null>(null);
    
    useEffect(() => {
        if(ref.current !== null) {
            ref.current.scrollIntoView();
        }
    }, [children, ref])

    return (
        <Box 
            width={width} 
            height={height} 
            overflow='auto'
            borderRadius={8}
            border="1px solid #ddd"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            p={2}
            bgcolor="#f9f9f9"
        >
            <Stack direction='column' spacing={2} minHeight='100%'>
                { children }
                <span ref={ref}></span>
            </Stack>
        </Box>
    );
}