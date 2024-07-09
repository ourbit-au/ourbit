import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import ConfigOption from "@/types/ConfigOption";

export async function POST(request: Request) {
  const supabase = createClient();

  const config = await request.json();

  const insertConfiguration = async (
    config: ConfigOption & { created_at: string; updated_at: string }
  ) => {
    const mapConfigToDbColumns = (config: Record<string, any>) => {
      const mapping: { [key: string]: string } = {
        where: "location",
        postcode: "postcode",
        distributor: "distributor",
        controlledLoad: "controlledload",
        energyConcession: "energyconcession",
        solarPanels: "solarpanels",
        peopleInHome: "peopleinhome",
        roomsInHome: "roomsinhome",
        gasConnection: "gasconnection",
        heatingHome: "heatinghome",
        coolingHome: "coolinghome",
        dryer: "dryer",
        dryerUsage: "dryerusage",
        hotWaterSystem: "hotwatersystem",
        seaDistance: "seadistance",
        washingMachine: "washingmachine",
        washingMachineUsage: "washingmachineusage",
      };

      return Object.keys(config).reduce((acc: Record<string, any>, key) => {
        const dbColumn = mapping[key] || key.toLowerCase();
        acc[dbColumn] = config[key];
        return acc;
      }, {});
    };

    const dbFriendlyConfig = mapConfigToDbColumns(config);
    dbFriendlyConfig.id = uuidv4();

    console.log(`Inserting configuration:`, dbFriendlyConfig);

    const { data, error } = await supabase
      .from("configurations")
      .insert([dbFriendlyConfig])
      .select();

    if (error) {
      console.error("Error inserting configuration:", error);
      return null;
    }

    return data[0];
  };

  const configEntry = await insertConfiguration({
    ...config,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (!configEntry) {
    console.log("Error inserting configuration");
    return null;
  }

  return NextResponse.json(configEntry);
}
