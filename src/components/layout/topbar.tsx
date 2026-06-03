'use client';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Icon,
  Toolbar,
  Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { fireBaseLogout } from '@/services/auth.service';

const Topbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Firebase logout
      await signOut(auth);

      // Remove token cookie
      // Cookies.remove('firebase_token');
      await fireBaseLogout();

      // Redirect
      router.push('/login');
    } catch (error) {
      console.error(
        'Logout failed:',
        error,
      );
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{ backgroundColor: "#2F4F4F"}}
    >
      <Toolbar>
        
      <Box
        sx={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        }}
      >
        <Image 
          src='/VoughtIntl_Hori.svg' 
          alt="Vought Ecom" 
          width={180} 
          height={60} 
          priority
        />
      </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar />

          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ fontWeight: 'bold', backgroundColor: '#8B0000' }}
          >
            <PowerSettingsNewIcon/>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;