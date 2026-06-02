import Topbar from "@/components/layout/topbar";
import { Box } from "@mui/material";


const ProtectedLayout=({children}:{children: React.ReactNode})=>{
  return (
    <>
      <Topbar/>
      <Box
        sx={{
          minHeight: 'calc(1000vh-64px)',
          backgroundColor: '#f5f5f5'
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default ProtectedLayout;