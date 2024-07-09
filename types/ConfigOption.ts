type ConfigOption = {
  [key: string]: any;
  comparison: string;
  where: string;
  location: string;
  postcode: string;
  distributor: string;
  energyConcession: string;
  solarPanels: string;
  peopleInHome: string;
  roomsInHome: string;
  fridges: string;
  gasConnection: string;
  heatingHome: string | string[];
  coolingHome: string | string[];
  dryer: string;
  dryerUsage: string;
  hotWaterSystem: string;
  controlledLoad: string;
  seaDistance: string;
  washingMachine: string;
  washingMachineUsage: string;
};

export default ConfigOption;
