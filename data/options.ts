const yesNo = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const comparisonOptions = [
  { value: "electricity", label: "Electricity" },
  { value: "gas", label: "Gas" },
];

const locationOptions = [
  { value: "home", label: "Home" },
  { value: "business", label: "Business" },
];

const distributorOptions = [
  { value: "Citipower", label: "Citipower" },
  { value: "Jemena", label: "Jemena" },
  { value: "AusNet Services", label: "AusNet Services" },
  { value: "Powercor", label: "Powercor" },
  { value: "United Energy", label: "United Energy" },
];

const peopleInHomeOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5+", label: "5 or more" },
];

const roomsInHomeOptions = [
  { value: "1-3", label: "1-3" },
  { value: "4-6", label: "4-6" },
  { value: "7-9", label: "7-9" },
  { value: "10+", label: "10 or more" },
];

const fridgesOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3+", label: "3 or more" },
];

const heatingHomeOptions = [
  { value: "None", label: "None" },
  { value: "Electric", label: "Electric" },
  { value: "Gas", label: "Gas" },
  { value: "Other", label: "Other" },
];

const coolingHomeOptions = [
  { value: "None", label: "None" },
  { value: "Air Conditioning", label: "Air Conditioning" },
  { value: "Fans", label: "Fans" },
  { value: "Other", label: "Other" },
];

const dryerUsageOptions = [
  { value: "0", label: "0 times" },
  { value: "1-2", label: "1-2 times" },
  { value: "3-4", label: "3-4 times" },
  { value: "5+", label: "5 or more times" },
];

const hotWaterSystemOptions = [
  { value: "Electric", label: "Electric" },
  { value: "Gas", label: "Gas" },
  { value: "Solar", label: "Solar" },
  { value: "Heat Pump", label: "Heat Pump" },
];

const seaDistanceOptions = [
  { value: "don't know", label: "Don't know" },
  { value: "less than 1km", label: "Less than 1km" },
  { value: "1-10km", label: "1-10km" },
  { value: "more than 10km", label: "More than 10km" },
];

const washingMachineUsageOptions = [
  { value: "0-1", label: "0-1 times per week" },
  { value: "2-3", label: "2-3 times per week" },
  { value: "4-5", label: "4-5 times per week" },
  { value: "6+", label: "6+ times per week" },
];

export {
  comparisonOptions,
  locationOptions,
  peopleInHomeOptions,
  roomsInHomeOptions,
  fridgesOptions,
  heatingHomeOptions,
  coolingHomeOptions,
  dryerUsageOptions,
  hotWaterSystemOptions,
  seaDistanceOptions,
  washingMachineUsageOptions,
  yesNo,
};
