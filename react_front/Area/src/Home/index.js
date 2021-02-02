import React, { Component } from "react";
import MyApps from "./MyApps.js";
import CreateArea from "../CreateArea/index.js";
import MyArea from "../MyArea/index.js";
import SideBar from "../SideBar/SideBar.js";
import { DrawerNavigator } from "react-navigation";

const HomeScreenRouter = DrawerNavigator(
  {
    "My Apps": { screen: MyApps },
    "Create a new Area": { screen: CreateArea },
    "My Area": { screen: MyArea }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);
export default HomeScreenRouter;