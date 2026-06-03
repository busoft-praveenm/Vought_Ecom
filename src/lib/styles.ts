export const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor:
      'rgba(255,255,255,0.75)',
    borderRadius: '10px',

    // default border
    '& fieldset': {
      borderColor:
        'rgba(0,0,0,0.35)',
    },

    // hover border
    '&:hover fieldset': {
      borderColor:
        'rgba(0,0,0,0.55)',
    },

    // focused border
    '&.Mui-focused fieldset': {
      borderColor: '#000000',
      borderWidth: '2px',
    },

    // ERROR STATES
    '&.Mui-error fieldset': {
      borderColor:
        '#d32f2f !important',
      borderWidth: '2px',
    },

    '&.Mui-error:hover fieldset': {
      borderColor:
        '#d32f2f !important',
    },

    '&.Mui-error.Mui-focused fieldset':
      {
        borderColor:
          '#d32f2f !important',
        borderWidth: '2px',
      },

    // Chrome autofill
    '& input:-webkit-autofill': {
      WebkitBoxShadow:
        '0 0 0 100px rgba(255,255,255,0.75) inset',
      WebkitTextFillColor:
        '#000',
    },
  },

  // default label
  '& .MuiInputLabel-root': {
    color: '#000000',
    fontWeight: 700,
  },

  // focused label
  '& .MuiInputLabel-root.Mui-focused':
    {
      color: '#000000',
      fontWeight: 700,
    },

  // ERROR LABEL
  '& .MuiInputLabel-root.Mui-error':
    {
      color:
        '#d32f2f !important',
      fontWeight: 700,
    },

  // helper text
  '& .MuiFormHelperText-root': {
    fontWeight: 600,
  },

  '& .MuiFormHelperText-root.Mui-error':
    {
      color:
        '#d32f2f',
    },
};