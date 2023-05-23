import { styled } from "@mui/system";
import { IconButton as MuiIconButton } from "@mui/material";

export const centeredContainer = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "15px"
};

export const IconButton = styled(MuiIconButton)({
  position: 'absolute',
  top: '0.25rem',
  right: '0.25rem',
  backgroundColor: "white",
});

export const additionalImageWrapper = {
  position: "relative",
  maxWidth: "30%",
  margin: "0.5rem",
};

export const formControl = {
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  marginBottom: "1rem"
};

export const categoryButton = {
  width: "27%",
  flexShrink: 0,
};

export const textField = {
  marginBottom: "1rem",
};

export const mainImageStyle = {
  maxWidth: "30%",
  marginBottom: "1rem",
  borderRadius: "0.25rem",
};

export const additionalImage = {
  maxWidth: "100%",
  marginBottom: "1rem",
  borderRadius: "0.25rem",
};

export const deleteIconButton = {
  position: "absolute",
  top: "0.25rem",
  right: "0.25rem",
  backgroundColor: "white",
};

export const submitButton = {
  marginBottom: '1rem',
  py: '0.8rem',
  mt: 2,
  width: '100%',
  marginInline: 'auto',
  backgroundColor: '#7E52A0',
  "&:hover": {
    backgroundColor: '#6d3398',
  },
  "&:focus": {
    outline: "none",
  },
  marginTop: '50px'
}

export const buttonStyles = {
  padding: "12px 24px",
  backgroundColor: '#7E52A0',
  color: "white",
  marginTop: "10px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
  transition: "background-color 0.2s ease-out",
  "&:hover": {
   backgroundColor: '#6d3398',
  },
  "&:focus": {
    outline: "none",
  }
};

export const buttonBack = {
  backgroundColor: '#ece8f5',
  color: '#7E52A0',
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
  transition: "background-color 0.2s ease-out",
  "&:hover": {
    backgroundColor: '#d1c4e1',
    border: "none",
  },
  "&:focus": {
    outline: "none",
  }
}

export const input = {
  display: 'none',
};

export const inputFileBox = {
  width: '100%',
  display: "flex",
  flexWrap: "wrap",
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '1rem'
}

export const additionalImagesList = {
  display: "flex",
  flexWrap: "wrap",
}