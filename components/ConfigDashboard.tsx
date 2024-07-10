"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import distributionMap from "@/data/distributionMap.json";
import {
  comparisonOptions,
  coolingHomeOptions,
  dryerUsageOptions,
  fridgesOptions,
  heatingHomeOptions,
  hotWaterSystemOptions,
  locationOptions,
  peopleInHomeOptions,
  roomsInHomeOptions,
  seaDistanceOptions,
  washingMachineUsageOptions,
  yesNo,
} from "@/data/options";
import { useState } from "react";

type DistributionMap = {
  [postcode: string]: string[];
};

const ConfigDashboard = () => {
  //new function for a more human readable config id
  //it uses the first letter of each config option to generate a unique id
  //e.g EHB3000CIY4-8GHNED0EY2-3
  function generateConfigId(config) {
    const parts = [
      config.comparison.charAt(0).toUpperCase(), // E or G
      config.where.charAt(0).toUpperCase(), // H or B
      config.postcode,
      config.distributor.substring(0, 2).toUpperCase(),
      config.energyConcession.charAt(0).toUpperCase(), // Y or N
      config.solarPanels.charAt(0).toUpperCase(), // Y or N
      config.peopleInHome,
      config.roomsInHome.replace("-", ""),
      config.fridges.charAt(0),
      config.gasConnection.charAt(0).toUpperCase(), // Y or N
      config.heatingHome.charAt(0).toUpperCase(),
      config.coolingHome.substring(0, 2).toUpperCase(),
      config.dryer.charAt(0).toUpperCase(), // Y or N
      config.dryerUsage.charAt(0),
      config.hotWaterSystem.charAt(0).toUpperCase(),
      config.controlledLoad.charAt(0).toUpperCase(), // Y or N
      config.seaDistance.substring(0, 2).toUpperCase(),
      config.washingMachine.charAt(0).toUpperCase(), // Y or N
      config.washingMachineUsage.charAt(0),
    ];

    return parts.join("");
  }

  const [config, setConfig] = useState({
    comparison: "electricity",
    where: "home",
    postcode: "3000",
    distributor: "Citipower",
    energyConcession: "no",
    solarPanels: "no",
    peopleInHome: "4",
    roomsInHome: "8",
    fridges: "2",
    gasConnection: "yes",
    heatingHome: "None",
    coolingHome: "None",
    dryer: "no",
    dryerUsage: "0",
    hotWaterSystem: "Electric",
    controlledLoad: "no",
    seaDistance: "don't know",
    washingMachine: "yes",
    washingMachineUsage: "2-3",
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const [availableDistributors, setAvailableDistributors] = useState([]);

  const handlePostcodeChange = (e) => {
    const postcode = e.target.value;
    setConfig((prevConfig) => ({
      ...prevConfig,
      postcode: postcode,
    }));

    const distributors = distributionMap[postcode] || [];
    setAvailableDistributors(distributors);

    if (distributors.length === 1) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        distributor: distributors[0],
      }));
    } else {
      setConfig((prevConfig) => ({
        ...prevConfig,
        distributor: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleRadioChange = (name, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus("saving");

    const configId = generateConfigId(config);

    try {
      const response = await fetch("/api/configuration", {
        method: "POST",
        body: JSON.stringify({ ...config, configid: configId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log({ response });
      const data = await response.json();
      console.log({ data });
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving configuration:", error);
      setSaveStatus("error");
    }
  };

  const FormField = ({
    label,
    name,
    type = "text",
    onChange,
    options = [],
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {type === "radio" ? (
        <RadioGroup
          name={name}
          value={config[name]}
          onValueChange={(value) => handleRadioChange(name, value)}
          className="flex flex-col space-y-1"
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${name}-${option.value}`}
              />
              <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={config[name]}
          onChange={onChange || handleInputChange}
          className="w-full"
        />
      )}
    </div>
  );

  return (
    <Card className="w-full max--auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Energy Configuration Dashboard</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Comparison Type"
              name="comparison"
              type="radio"
              options={comparisonOptions}
            />
            <FormField
              label="Location Type"
              name="where"
              type="radio"
              options={locationOptions}
            />
            <FormField
              label="Postcode"
              name="postcode"
              type="text"
              onChange={handlePostcodeChange}
            />
            {availableDistributors.length > 1 && (
              <FormField
                label="Distributor"
                name="distributor"
                type="radio"
                options={availableDistributors.map((dist) => ({
                  value: dist,
                  label: dist,
                }))}
              />
            )}
            <FormField
              label="Energy Concession"
              name="energyConcession"
              type="radio"
              options={yesNo}
            />
            <FormField
              label="Solar Panels"
              name="solarPanels"
              type="radio"
              options={yesNo}
            />
            <FormField
              label="People in Home"
              name="peopleInHome"
              type="radio"
              options={peopleInHomeOptions}
            />
            <FormField
              label="Rooms in Home"
              name="roomsInHome"
              type="radio"
              options={roomsInHomeOptions}
            />
            <FormField
              label="Number of Fridges"
              name="fridges"
              type="radio"
              options={fridgesOptions}
            />
            <FormField
              label="Gas Connection"
              name="gasConnection"
              option
              type="radio"
              options={yesNo}
            />
            <FormField
              label="Home Heating"
              name="heatingHome"
              type="radio"
              options={heatingHomeOptions}
            />
            <FormField
              label="Home Cooling"
              name="coolingHome"
              type="radio"
              options={coolingHomeOptions}
            />
            <FormField
              label="Clothes Dryer"
              name="dryer"
              type="radio"
              options={yesNo}
            />
            <FormField
              label="Dryer Usage (per week)"
              name="dryerUsage"
              type="radio"
              options={dryerUsageOptions}
            />
            <FormField
              label="Hot Water System"
              name="hotWaterSystem"
              type="radio"
              options={hotWaterSystemOptions}
            />
            <FormField
              label="Controlled Load"
              name="controlledLoad"
              type="radio"
              options={yesNo}
            />
            <FormField
              label="Distance from Sea"
              name="seaDistance"
              type="radio"
              options={seaDistanceOptions}
            />
            <FormField
              label="Washing Machine"
              name="washingMachine"
              type="radio"
              options={yesNo}
            />
            <FormField
              label="Washing Machine Usage"
              name="washingMachineUsage"
              type="radio"
              options={washingMachineUsageOptions}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <Button onClick={handleSubmit} className="w-full max-w-md">
          Save Configuration
        </Button>
        {saveStatus && (
          <Alert
            className="w-full max-w-md"
            variant={saveStatus === "error" ? "destructive" : "default"}
          >
            <AlertDescription>
              {saveStatus === "saving" && "Saving configuration..."}
              {saveStatus === "success" && "Configuration saved successfully!"}
              {saveStatus === "error" &&
                "Failed to save configuration. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConfigDashboard;
