import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';

const DashboardPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 4
          }}
        >
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={4}>
              <CardContent>
                <Typography
                  variant="h6"
                >
                  Users
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight:"bold"
                  }}
                >
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={4}>
              <CardContent>
                <Typography
                  variant="h6"
                >
                  Orders
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight:"bold"
                  }}
                >
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={4}>
              <CardContent>
                <Typography
                  variant="h6"
                >
                  Revenue
                </Typography>

                <Typography
                  variant="h3"
                  sx={{fontWeight:"bold"}}
                >
                  ₹0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;