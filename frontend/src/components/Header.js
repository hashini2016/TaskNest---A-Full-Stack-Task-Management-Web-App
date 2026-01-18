import React, { useState } from "react";
import { AppBar, Typography, Toolbar, Box, Button, Tabs, Tab,} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";
import { useStyles } from "./utils";
const Header = () => {
  const classes = useStyles();
  const dispath = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const [value, setValue] = useState();
  return (
    <AppBar
      position="sticky"
      sx={{
        background:
          "linear-gradient(90deg, rgb(161, 23, 159) 100%)",
      }}
    >
      <Toolbar>
        <Typography className={classes.font} variant="h4">
          TaskNest
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
