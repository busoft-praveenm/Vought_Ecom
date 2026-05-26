'use client'
import { auth } from "@/lib/firebase";
import { fireBaseLogin } from "@/services/auth.service";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useState } from "react";

const LoginClient=()=>{
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    let userCredential;

    try {
      // 1. Try login first
      userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (err: any) {
      // 2. If user doesn't exist → create account
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        throw err;
      }
    }

    // 3. Get Firebase token
    const firebaseToken = await userCredential.user.getIdToken();

    // 4. Call backend
    await fireBaseLogin(firebaseToken);

    router.push("/dashboard");
  } catch (error: any) {
    setError(error.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <Container maxWidth='sm'>
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card
          elevation={6}
          sx={{
            width: '100%',
            borderRadius: 4,
            p: 2
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}
            >
              Login
            </Typography>
            {
              error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                >
                  {error}
                </Alert>
              )
            }

            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
              }}
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                />
              ) : (
                'Login'
              )}
            </Button>

          </CardContent>
        </Card>
      </Box>
    </Container>
  );

}

export default LoginClient;