'use client'

import { useToaster } from "@/components/toaster/ToasterProvider";
import { ProductApiResponse } from "@/services/product.service";
import { Box, Card, CardContent, Chip, Container, Grid, Pagination, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  productsData: ProductApiResponse
}

const DashboardClient =({ productsData }: Props)=>{

  const router = useRouter();
  const { showToast } = useToaster();

  useEffect(() => {
    if ( 'success' in productsData && productsData.success === false ) {
      showToast( productsData.error, 'error');
    }
  }, [ productsData, showToast]);

  // prevent crash
  if ( 'success' in productsData && productsData.success === false ) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5">
          Could not load products
        </Typography>
      </Container>
    );
  }

  const { results: products, pagination } = productsData;

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>Welcome!</Typography>
      <Grid container sx={{ mb: 4, justifyContent: 'space-evenly' }} >

        <Grid sx={{ xs: 12, md: 4 }} >
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>{pagination.total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, md: 4 }}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Categories</Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>5</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, md: 4 }} >
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Brands</Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>10</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {
          products.map((product)=>(
            <Grid key={product.id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
              <Card elevation={5} sx={{ borderRadius: 4, overflow: 'hidden', cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <Box sx={{ position: 'relative', width: '100%', height: 220 }}>
                  <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover'}}/>
                </Box>
                <CardContent>
                  <Stack
                    direction="row"
                    sx={{
                      mb: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Chip
                      label={
                        product.category
                      }
                      color="primary"
                      size="small"
                    />

                    <Typography
                      variant="body2"
                    >
                      {
                        product.brand
                      }
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight:
                        'bold',
                    }}
                  >
                    {
                      product.name
                    }
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                    }}
                  >
                    SKU:
                    {
                      product.sku
                    }
                  </Typography>

                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight:
                          'bold',
                      }}
                    >
                      ₹
                      {
                        product.price
                      }
                    </Typography>

                    <Chip
                      label={`Stock: ${product.stock}`}
                      color={
                        parseInt(product.stock) >
                        10
                          ? 'success'
                          : 'warning'
                      }
                    />
                  </Stack>
                </CardContent>

              </Card>
            </Grid>
          )) 
        }
      </Grid>

      <Box
        sx={{
          mt: 5,
          display: 'flex',
          justifyContent:
            'center',
        }}
      >
        <Pagination
          page={
            pagination.page
          }
          count={
            pagination.totalPages
          }
          color="primary"
          onChange={(
            _,
            value,
          ) => {
            router.push(
              `/dashboard?page=${value}`,
            );
          }}
        />
      </Box>

    </Container>
  );
}

export default DashboardClient;