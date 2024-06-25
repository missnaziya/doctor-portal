import * as React from "react";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";

type Props = {
  children: JSX.Element;
  open: boolean;
  onClose(): Function | void;
  onOpen(): Function | void;
};

const SwipeableTemporaryDrawer = ({ children, onClose, open, onOpen }: Props) => {
  return (
    <SwipeableDrawer open={open} onClose={onClose} onOpen={onOpen} anchor="right">
      {children}
    </SwipeableDrawer>
  );
};

export default SwipeableTemporaryDrawer;
