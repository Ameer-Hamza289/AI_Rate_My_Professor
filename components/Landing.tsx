'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/chat');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width:"100%",
        bgcolor: '#f3f4f6',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" gutterBottom color="#1e3a8a">
        Welcome to Rate My Professor
      </Typography>
      <Typography variant="h6" paragraph>
        Engage with our chatbot to get insights and feedback on professors.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGetStarted}>
        Start Chatting
      </Button>
    </Box>
  );
}