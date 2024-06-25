import { AppBar, Box, Tab, Tabs } from "@mui/material";

import React from "react";
import { TabPanelProps } from "../interfaces/TabPanelProps";

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const tabProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

export const TabAppBar = (props: {tabs: {label: string}[], value: {setTabValue: (e: string) => void, tabValue: string}}) => {
  const tabs = props.tabs;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    props.value.setTabValue(newValue);
  };

  return (
    <AppBar position="static" className="tabs-bar">
      <Tabs value={props.value.tabValue} onChange={handleChange} style={{ background: "#ffffff" }} indicatorColor="primary" textColor="inherit" variant="fullWidth">
        {tabs.map((tab: {label: string}, index: number) => {
          return <Tab className="tab-btn" key={index} label={tab.label} {...tabProps(index)} />;
        })}
      </Tabs>
    </AppBar>
  );
};
