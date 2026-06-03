'use client'
import { Alert, Snackbar } from "@mui/material";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type Severity = 'success' | 'error' | 'warning' | 'info'

interface ToastState {
  open: boolean;
  message: string;
  severity: Severity
}

interface ToasterContextType {
  showToast: (
    message: string,
    severity?: Severity,
  ) => void;
}

const ToasterContext = createContext<ToasterContextType>( {} as ToasterContextType );

export const ToasterProvider =({ children }:{ children: React.ReactNode }) => {

  const [ toast, setToast ] = useState<ToastState>({ 
    open:false,
    message: '',
    severity: 'success'
   });

  const showToast = useCallback(
    (message: string, severity: Severity = 'success') => {
      setToast({ open: true, message, severity });
    },[]
  );

  const handleClose = ()=>{
    () => { setToast((prev, ) => ({ ...prev, open: false})); }
  }

  const value = useMemo( ()=> ({ showToast }), [showToast] );

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={toast.severity} variant="filled" onClose={handleClose} sx={{ width: "100%" }}>{toast.message}</Alert>
      </Snackbar>
    </ToasterContext.Provider>
  )

}

export const useToaster = () => useContext(ToasterContext);