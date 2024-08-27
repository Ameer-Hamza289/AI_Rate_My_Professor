'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Landing() {
  const router = useRouter();
  const [hover, setHover] = useState(false);

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
        width: "100%",
        backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQkkn5bfZEgnyZkxBflQLjyXfS5hl_wwwVOg&s)', // Example background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        p: 3,
        color: 'white',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Typography variant="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '4rem' }, color: '#fbbf24' }}>
          Welcome to Rate My Professor
        </Typography>
        <Typography variant="h6" paragraph sx={{ fontSize: { xs: '1rem', md: '1.5rem' }, maxWidth: '600px', mx: 'auto' }}>
          Engage with our chatbot to get insights, ratings, and real feedback on professors from students like you. Let us help you make informed decisions!
        </Typography>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Button
          variant="contained"
          sx={{
            mt: 4,
            bgcolor: '#1e3a8a',
            '&:hover': { bgcolor: '#2563eb' },
            px: 4,
            py: 1.5,
            fontSize: '1.2rem',
            borderRadius: '30px',
            textTransform: 'none',
          }}
          onClick={handleGetStarted}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover ? 'Let’s Go!' : 'Start Chatting'}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 30,
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        Scroll down to explore more
      </motion.div>
    </Box>
  );
}
