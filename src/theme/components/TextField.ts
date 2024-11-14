const TextFieldTheme = {
  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: '15px',
        width: '100%',
        '& .MuiInputBase-root': {
          borderRadius: '15px',
          // Target the multiline input specifically
          '&.MuiInputBase-multiline': {
            padding: '0px !important',
          },
          // For non-multiline input fields
          '& .MuiOutlinedInput-input': {
            padding: '14px',
          },
        },
        '& .MuiOutlinedInput-root': {
          boxShadow: 'none',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          marginLeft: '10px',
        },
        // Styling the gap on the border when Label is displayed on the border
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          legend: {
            marginLeft: '10px',
            maxWidth: 'fit-content',
          },
        },
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        '&.Mui-focused': {
          marginLeft: '10px',
        },
      },
    },
  },
};

export default TextFieldTheme;
