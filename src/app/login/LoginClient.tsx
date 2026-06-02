'use client'
import { auth } from "@/lib/firebase";
import { textFieldStyles } from "@/lib/styles";
import { loginSchema } from "@/lib/validations";
import { fireBaseLogin } from "@/services/auth.service";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from "react";


// const LoginClient=()=>{
//   const router = useRouter();
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');

//   const handleLogin = async () => {
//   try {
//     setLoading(true);
//     setError("");

//     let userCredential;

//     try {
//       // 1. Try login first
//       userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//     } catch (err: any) {
//       // 2. If user doesn't exist → create account
//       if (
//         err.code === "auth/user-not-found" ||
//         err.code === "auth/invalid-credential"
//       ) {
//         userCredential = await createUserWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );
//       } else {
//         throw err;
//       }
//     }

//     // 3. Get Firebase token
//     const firebaseToken = await userCredential.user.getIdToken();

//     // 4. Call backend
//     await fireBaseLogin(firebaseToken);

//     router.push("/dashboard");
//   } catch (error: any) {
//     setError(error.message || "Login failed");
//   } finally {
//     setLoading(false);
//   }
//   };

//   // return (
//   //   <Box
//   //     sx={{
//   //       width: '100%',
//   //       height: '100vh',
//   //       backgroundImage: 'url("/Vought_Login.png")',
//   //       backgroundSize: 'cover',
//   //       backgroundPosition: 'center',
//   //       backgroundRepeat: 'no-repeat',
//   //       display: 'flex',
//   //       alignItems: 'center',
//   //       justifyContent: 'flex-start',
//   //       overflow: 'hidden',
//   //     }}
//   //   >
//   //     <Box 
//   //       sx={{
//   //         minHeight: '100vh',
//   //         display: 'flex',
//   //         alignItems: 'center',
//   //         justifyContent: 'center',
//   //         color: 'transparent'
//   //       }}
//   //     >
//   //       <Card
//   //         elevation={0}
//   //         sx={{
//   //           width: '100%',
//   //           p: 2,
//   //           background: 'transparent',
//   //           boxShadow: 'none',
//   //           border: 'none',
//   //           outline: 'none',
//   //           borderRadius: 0,
//   //           backdropFilter: 'none',
//   //         }}
//   //       >
//   //         <CardContent>
//   //           <Box
//   //             sx={{
//   //             display: 'flex',
//   //             alignItems: 'center',
//   //             justifyContent: 'center',
//   //             flexGrow: 1,
//   //             width: '100%',
//   //             }}
//   //           >
//   //             <Image 
//   //               src='/VoughtIntl_Hori.svg' 
//   //               alt="Vought Ecom" 
//   //               width={180} 
//   //               height={60} 
//   //               priority
//   //             />
//   //           </Box>
//   //           {
//   //             error && (
//   //               <Alert
//   //                 severity="error"
//   //                 sx={{ mb: 2 }}
//   //               >
//   //                 {error}
//   //               </Alert>
//   //             )
//   //           }

//   //           <TextField
//   //             fullWidth
//   //             label="Email"
//   //             type="email"
//   //             margin="normal"
//   //             value={email}
//   //             onChange={(e) =>
//   //               setEmail(e.target.value)
//   //             }
//   //           />

//   //           <TextField
//   //             fullWidth
//   //             label="Password"
//   //             type="password"
//   //             margin="normal"
//   //             value={password}
//   //             onChange={(e) =>
//   //               setPassword(e.target.value)
//   //             }
//   //           />

//   //           <Button
//   //             fullWidth
//   //             variant="contained"
//   //             size="large"
//   //             sx={{
//   //               mt: 3,
//   //               py: 1.5,
//   //               borderRadius: 2,
//   //             }}
//   //             disabled={loading}
//   //             onClick={handleLogin}
//   //           >
//   //             {loading ? (
//   //               <CircularProgress
//   //                 size={24}
//   //               />
//   //             ) : (
//   //               'Login'
//   //             )}
//   //           </Button>

//   //         </CardContent>
//   //       </Card>
//   //     </Box>
//   //   </Box>
//   // );

// }

const LoginClient=()=>{

  const router = useRouter();
  const [error, setError] = useState<string>('');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async ( values, {setSubmitting}) => {
      try{
        setError('');
        let userCredential;
        try{
          userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        }catch(err: any){
          if(err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential'){
            userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          } else {
            throw err;
          }
        }
        const fireBaseToken = await userCredential.user.getIdToken();
        await fireBaseLogin(fireBaseToken);
        router.push('/dashboard');
      }catch(error: any){
        setError(error.message || 'Login failed');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box sx={{ width: '100%', height: '100vh', backgroundImage: 'url("/Vought_Login.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden', pl: { xs: 3, md: 8, lg: 12 }
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          background: 'transparent',
          boxShadow: 'none'
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Image src='/VoughtIntl_Hori.svg' alt="Vought International" width={180} height={60} priority/>
          </Box>
          { error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit} noValidate>
            <TextField fullWidth name="email" label="Email" margin="normal" autoComplete="email" value={formik.values.email} onChange={formik.handleChange}
              onBlur={formik.handleBlur} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email ? formik.errors.email : ''}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              margin="normal"
              autoComplete="current-password"
              // inputlabelProps={{
              //   shrink: true,
              // }}
              value={
                formik.values
                  .password
              }
              onChange={
                formik.handleChange
              }
              onBlur={
                formik.handleBlur
              }
              error={
                formik
                  .touched
                  .password &&
                Boolean(
                  formik
                    .errors
                    .password
                )
              }
              helperText={
                formik
                  .touched
                  .password
                  ? formik
                      .errors
                      .password
                  : ''
              }
              sx={
                textFieldStyles
              }
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={
                formik.isSubmitting
              }
              sx={{
                mt: 3,
                py: 1.6,
                borderRadius:
                  2,
                fontWeight:
                  700,
                letterSpacing:
                  '0.08em',
                backgroundColor:
                  '#2F4F4F',

                '&:hover':
                  {
                    backgroundColor:
                      '#3F6666',
                  },
              }}
            >
              {formik.isSubmitting ? (
                <CircularProgress
                  size={
                    24
                  }
                  sx={{
                    color:
                      'white',
                  }}
                />
              ) : (
                'LOGIN'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )

}

export default LoginClient;