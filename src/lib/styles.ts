export const textFieldStyles = {
  '& .MuiOutlinedInput-root':
    {
      backgroundColor:
        'rgba(255,255,255,0.75)',
      borderRadius:
        '10px',

      '& fieldset': {
        borderColor:
          'rgba(0,0,0,0.35)',
      },

      '&:hover fieldset':
        {
          borderColor:
            'rgba(0,0,0,0.55)',
        },

      '&.Mui-focused fieldset':
        {
          borderColor:
            '#2F4F4F',
          borderWidth:
            '2px',
        },

      '& input:-webkit-autofill':
        {
          WebkitBoxShadow:
            '0 0 0 100px rgba(255,255,255,0.75) inset',
          WebkitTextFillColor:
            '#000',
        },
    },

  '& .MuiInputLabel-root':
    {
      color:
        '#000000',
      fontWeight: 1000,
    },
};