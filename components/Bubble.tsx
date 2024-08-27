import Box from '@mui/material/Box';
import Markdown from 'react-markdown';

export type BubbleOptions = {
    content: string,
    bgcolor: string,
    color?: string,
    flushLeft?: boolean
}

export default function Bubble({
    content, color, bgcolor, flushLeft
}: BubbleOptions) {
    return (
        <Box 
            display='flex' 
            justifyContent={flushLeft ? 'flex-start' : 'flex-end'}
            mb={1}
        >
            <Box 
                color={color || '#333'} 
                bgcolor={bgcolor}
                borderRadius={10}
                p={4}
                maxWidth='80%'
                boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                sx={{
                    '&:last-child': {
                        mb: 0
                    }
                }}
            >
                <Markdown>{ content }</Markdown>
            </Box>
        </Box>
    );
}
