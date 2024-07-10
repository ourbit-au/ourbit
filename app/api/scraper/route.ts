import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import ConfigOption from "@/types/ConfigOption";

const formatDate = (dateString: string | undefined): string | null => {
  if (!dateString) return null;

  const [day, month, year] = dateString.split("/");

  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Check if the date object is valid because sometimes we get an issue with the date format
  if (isNaN(dateObj.getTime())) {
    // console.warn(`Invalid date format for input: ${dateString}`);
    return null; // Return null for invalid dates
  }

  return dateObj.toISOString();
};

const sleep = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function forceClick(page: any, selector: string) {
  const elementHandle = await page.$(selector);
  if (!elementHandle) {
    console.error(`${selector} not found in the DOM`);
    return;
  }

  const isVisible = await page.evaluate((selector: string) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return (
      style &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    );
  }, selector);

  if (!isVisible) {
    await page.evaluate((selector: string) => {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).click();
      }
    }, selector);
  } else {
    await page.evaluate((selector: string) => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView();
        (element as HTMLElement).click();
      }
    }, selector);
  }
}


//every 12 hours
// cron(0 */12 * * *)
export async function GET(request: Request) {
  const supabase = createClient();

  const configs = await supabase.from("configurations").select("*");

  const options: ConfigOption[] = configs.data || [];

  async function getServerCacheId(config: ConfigOption) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 800 });

    let serverCacheId: string | null = null;
    let offersData: any = null;

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      request.continue();
    });

    page.on("response", async (response) => {
      const request = response.request();
      if (
        request.url().includes("/api/get-psb-details") &&
        response.status() === 200
      ) {
        const responseBody = await response.json();
        if (responseBody && responseBody.serverCacheId) {
          serverCacheId = responseBody.serverCacheId;
        }
      }

      if (
        request.url().includes("/api/get-offers") &&
        response.status() === 200
      ) {
        offersData = await response.json();
        const offers = offersData.offers.Electricity.offersList;
        console.log("offers length:", offers.length);
      }
    });

    await page.goto("https://compare.energy.vic.gov.au/", {
      waitUntil: "networkidle2",
    });

    try {
      await forceClick(page, `#${config.comparison}`);
      await forceClick(page, `input#customer_${config.location}`);
      await forceClick(page, "input#moving");

      await page.waitForSelector("input#postcode", {
        visible: true,
      });
      await page.type("input#postcode", config.postcode);

      await page.waitForSelector('input[value="Submit postcode"]', {
        visible: true,
      });

      await forceClick(page, 'input[value="Submit postcode"]');

      await sleep(2000);

      /* new code to account for distributors remvoe when understodd */
      const distributorListSelector = "ul.distributor-list";

      const distributorListPresent =
        (await page.$(distributorListSelector)) !== null;

      if (distributorListPresent) {
        const distributorMap: { [key: string]: string } = {
          Citipower: "radio-Citipower-All",
          Jemena: "radio-Jemena-All",
        };

        if (distributorMap[config.distributor]) {
          await forceClick(page, `#${distributorMap[config.distributor]}`);
        } else {
          console.warn(
            "Specified distributor not found, selecting the first option"
          );
          await page.click(`${distributorListSelector} input[type="radio"]`);
        }
      } else {
        console.log(
          "Distributor list not found, skipping distributor selection"
        );
      }
      /* new code to account for distributors remvoe when understodd */

      await sleep(2000);

      await forceClick(
        page,
        `#concession${config.energyconcession === "yes" ? "Yes" : "No"}`
      );

      await forceClick(
        page,
        `input#solar${config.solarpanels === "yes" ? "Yes" : "No"}`
      );

      await forceClick(page, "input#disclaimer");
      await forceClick(page, 'button[name="next"]');

      await page.waitForSelector('select[formcontrolname="hhSize"]', {
        visible: true,
      });

      await page.select(
        'select[formcontrolname="hhSize"]',
        config.peopleinhome
      );

      await page.select(
        'select[formcontrolname="totalRooms"]',
        config.roomsinhome
      );

      await page.select(
        'select[formcontrolname="fridgeCount"]',
        config.fridges
      );

      await page.select(
        'select[formcontrolname="gasConnection"]',
        config.gasconnection === "yes" ? "1" : "4"
      );

      if (config.heatinghome === "None") {
        await forceClick(page, "input#spaceHeatingNone");
      } else {
        for (const heatingType of config.heatinghme) {
          await forceClick(page, `input#${heatingType.replace(/ /g, "")}`);
        }
      }

      if (config.coolinghome === "None") {
        await forceClick(page, "input#spaceCoolingNone");
      } else {
        for (const coolingType of config.coolinghome) {
          await forceClick(page, `input#${coolingType.replace(/ /g, "")}`);
        }
      }

      await forceClick(
        page,
        `input#clothesDryer${config.dryer === "yes" ? "Yes" : "No"}`
      );
      if (config.dryer === "yes") {
        await page.select(
          'select[formcontrolname="dryerUsage"]',
          config.dryerusage
        );
      }

      await forceClick(
        page,
        `input#waterHeating${config.hotwatersystem.replace(/ /g, "")}`
      );
      await forceClick(
        page,
        `input#controlledLoad${config.controlledload === "yes" ? "Yes" : "No"}`
      );
      await forceClick(page, 'button[type="submit"]');

      await page.waitForNavigation();

      const closeModalButton = await page.$('button[aria-label="Close"]');
      if (closeModalButton) {
        await closeModalButton.click();
      }

      let attempts = 0;
      const maxAttempts = 30;
      const interval = 2000;

      while (attempts < maxAttempts && !offersData) {
        await sleep(interval);
        attempts++;
      }

      if (!offersData) {
        throw new Error("Offers data not found");
      }

      const offerEntries: any[] = [];

      offersData.offers.Electricity.offersList.forEach((offer: any) => {
        const details = offer.offerDetails[0];

        const offerEntry = {
          //all of the fields from the offer object
          id: uuidv4(),
          offer_id: details.offerId,
          config_id: config.id,
          price: details.basePrice,
          retailer_name: details.retailerName,
          offer_name: details.offerName,
          tariff_type: details.tariffType,
          distributor: details.distributor,
          release_date: formatDate(details.releaseDate),
          contract_length: details.contractLength,
          green_power: details.greenPower,
          solar: details.solar,
          fees: details.fees,
          discounts: details.discounts,
          eligibility_criteria: details.eligibilityCriteria,
          is_residential: details.isResidential,
          retailer_license_name: details.retailerLicenseName,
          retailer_fueltype: details.retailerFueltype,
          retailer_url: details.retailerUrl,
          retailer_image_url: details.retailerImageUrl,
          retailer_phone: details.retailerPhone,
          retailer_description: details.retailerDescription,
          base_price: details.basePrice,
          total_conditional: details.totalConditional,
          total_unconditional: details.totalUnconditional,
          total_inc_gst: details.totalIncGst,
          total_exc_gst: details.totalExcGst,
          includes_demand_tariff: details.includesDemandTariff,
          annual_fee_count: details.annualFeeCount,
          contract: details.contract,
          solar_credit: details.solarCredit,
          greenpower_amount: details.greenpowerAmount,
          is_generally_available: details.isGenerallyAvailable,
          greenpower_charge_type: details.greenpowerChargeType,
          intrinsic_greenpower_percentage:
            details.intrinsicGreenpowerPercentage,
          parent_offer_has_greenpower_options:
            details.parentOfferHasGreenpowerOptions,
          is_control_load: details.isControlLoad,
          is_tou_offer: details.isTouOffer,
          base_offer_type: details.baseOfferType,
          is_innovative_offer: details.isInnovativeOffer,
          is_victorian_default_offer: details.isVictorianDefaultOffer,
          is_direct_debit_only: details.isDirectDebitOnly,
          has_pay_on_time_discount: details.hasPayOnTimeDiscount,
          has_incentive: details.hasIncentive,
          is_contingent_offer: details.isContingentOffer,
          contract_length_count: details.contractLengthCount,
          exit_fee: details.exitFee,
          exit_fee_count: details.exitFeeCount,
          is_gas_offer: details.isGasOffer,
          is_sme: details.isSme,
          estimated_solar_credit: details.estimatedSolarCredit,
          incentives: details.incentives,
          additional_fee_information: details.additionalFeeInformation,
          solar_type: details.solarType,
          cool_off_period: formatDate(details.coolOffPeriod),
          is_available_for_solar: details.isAvailableForSolar,
          is_custom_eligibility_offer: details.isCustomEligibilityOffer,
          time_definition: details.timeDefinition,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        offerEntries.push(offerEntry);
      });

      //changed to bulk insert because of the number of offers
      const { data, error } = await supabase
        .from("offers")
        .insert(offerEntries)
        .select();

      if (error) {
        console.error("Error inserting offer:", error);

        return null;
      }

      await browser.close();
      return offersData;
    } catch (error) {
      console.error("Errorhere :", error);
      await browser.close();
      return null;
    }
  }

  try {
    const results = [];
    for (const config of options) {
      const offersData = await getServerCacheId(config);
      if (offersData === null) {
        console.log("Failed to get offersData for config:", config);
        continue;
      }

      results.push(offersData);
    }
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("Error in API handler:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
