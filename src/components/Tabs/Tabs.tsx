import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSearchParams } from "react-router";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tab-panel-${index}`,
  };
}

interface TabData {
  label: string;
  content: React.ReactNode;
  key: string;
  active?: boolean;
}

interface TabsComponentProps {
  tabs: TabData[];
  queryParamName?: string;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  tabs,
  queryParamName = "tab",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isActive = (tab: TabData) => tab.active !== false;

  const tabKeyFromQuery = searchParams.get(queryParamName);
  const defaultIndex = tabs.findIndex(
    (tab) => tab.key === tabKeyFromQuery && isActive(tab)
  );
  const [value, setValue] = React.useState(
    defaultIndex >= 0 ? defaultIndex : 0
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const selectedTab = tabs[newValue];
    if (!isActive(selectedTab)) return;

    setValue(newValue);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set(queryParamName, selectedTab.key);
      return updated;
    });
  };

  React.useEffect(() => {
    const tabKey = searchParams.get(queryParamName);
    const index = tabs.findIndex((tab) => tab.key === tabKey && isActive(tab));
    if (index >= 0 && index !== value) {
      setValue(index);
    }
  }, [searchParams, queryParamName, tabs, value]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="controlled tabs"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.key}
              label={tab.label}
              {...a11yProps(index)}
              disabled={!isActive(tab)}
            />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <CustomTabPanel key={tab.key} value={value} index={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </>
  );
};

export default TabsComponent;
