import DataTable from "@/components/DataTable";
import TestButton from "@/components/TestButton";
import { createClient } from "@/utils/supabase/server";

export type Configuration = {
  comparison: string;
  where: string;
  location: string;
  postcode: string;
  energyConcession: string;
  solarPanels: string;
  peopleInHome: string;
  roomsInHome: string;
  fridges: string;
  gasConnection: string;
  heatingHome: string;
  coolingHome: string;
  dryer: string;
  dryerUsage: string;
  hotWaterSystem: string;
  controlledLoad: string;
  seaDistance: string;
  washingMachine: string;
  washingMachineUsage: string;
};

export default async function Index() {
  const supabase = createClient();

  const query = {
    postcode: "3000",
  };

  let { data, error } = await supabase.from("offers").select("*");

  //how you filter data in supabase
  // let { data, error } = await supabase
  //   .from("offers")
  //   .select("*")
  //   .eq("postcode", query.postcode)
  //   .eq("tariff_type", "Single rate")
  //   .order("total_inc_gst", { ascending: true });

  if (!data) {
    return <div>Loading...</div>;
  }

  //configuring what data to display - can omit this to display all data - columns must be defined in DataTable component
  const offers = data.map((offer: any) => ({
    offerId: offer.offerId,
    retailerName: offer.contract_leng,
    offerName: offer.offer_name,
    tariffType: offer.tariff_type,
    totalIncGst: parseFloat(offer.total_inc_gst),
  }));

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Results</h2>
          <DataTable data={offers} />
          <TestButton />
        </div>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://ourbit.com.au"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Ourbit
          </a>
        </p>
      </footer>
    </div>
  );
}
