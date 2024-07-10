import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import ConfigOption from "@/types/ConfigOption";

export async function POST(request: Request) {
  const supabase = createClient();
  const config = await request.json();

  const upsertConfiguration = async (
    config: ConfigOption & {
      created_at: string;
      updated_at: string;
      configid: string;
    }
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


    console.log(`Upserting configuration:`, dbFriendlyConfig);

    const { data, error } = await supabase
      .from("configurations")
      .upsert(dbFriendlyConfig, { onConflict: "configid" })
      .select();

    if (error) {
      console.error("Error upserting configuration:", error);
      return null;
    }

    return data[0];
  };

  const configEntry = await upsertConfiguration({
    ...config,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (!configEntry) {
    console.log("Error upserting configuration");
    return NextResponse.json(
      { error: "Failed to upsert configuration" },
      { status: 500 }
    );
  }

  return NextResponse.json(configEntry);
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const configId = searchParams.get("configid");

  if (!configId) {
    return NextResponse.json(
      { error: "Missing configid parameter" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("configurations")
    .select("*")
    .eq("configid", configId)
    .single();

  if (error) {
    console.error("Error fetching configuration:", error);
    return NextResponse.json(
      { error: "Configuration not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
