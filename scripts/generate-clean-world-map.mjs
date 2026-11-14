import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const worldAtlasPath = require.resolve("world-atlas/countries-110m.json");
const world = JSON.parse(fs.readFileSync(worldAtlasPath, "utf8"));

const width = 800;
const height = 400;
// Natural Earth 1 projection with Sphere fit
const projection = d3.geoNaturalEarth1().fitSize([width, height], { type: "Sphere" });
const pathGenerator = d3.geoPath(projection);

// Project Landmass (zero horizontal antimeridian wrap lines)
const landGeo = topojson.feature(world, world.objects.land);
const rawLandPath = pathGenerator(landGeo) || "";
// Clean path precision to 1 decimal place to save bundle size
function formatPath(p) {
  return p.replace(/(\d+\.\d{2,})/g, (m) => parseFloat(m).toFixed(1));
}

const GLOBAL_LAND_PATH = formatPath(rawLandPath);

// ISO numeric mapping
const ISO_NUM_TO_ALPHA2 = {
  "004": { id: "AF", name: "Afghanistan", continent: "asia" },
  "008": { id: "AL", name: "Albania", continent: "europe" },
  "012": { id: "DZ", name: "Algeria", continent: "mea" },
  "024": { id: "AO", name: "Angola", continent: "mea" },
  "032": { id: "AR", name: "Argentina", continent: "latam" },
  "036": { id: "AU", name: "Australia", continent: "oceania" },
  "040": { id: "AT", name: "Austria", continent: "europe" },
  "031": { id: "AZ", name: "Azerbaijan", continent: "asia" },
  "050": { id: "BD", name: "Bangladesh", continent: "asia" },
  "056": { id: "BE", name: "Belgium", continent: "europe" },
  "204": { id: "BJ", name: "Benin", continent: "mea" },
  "068": { id: "BO", name: "Bolivia", continent: "latam" },
  "070": { id: "BA", name: "Bosnia and Herzegovina", continent: "europe" },
  "072": { id: "BW", name: "Botswana", continent: "mea" },
  "076": { id: "BR", name: "Brazil", continent: "latam" },
  "096": { id: "BN", name: "Brunei", continent: "asia" },
  "100": { id: "BG", name: "Bulgaria", continent: "europe" },
  "854": { id: "BF", name: "Burkina Faso", continent: "mea" },
  "108": { id: "BI", name: "Burundi", continent: "mea" },
  "116": { id: "KH", name: "Cambodia", continent: "asia" },
  "120": { id: "CM", name: "Cameroon", continent: "mea" },
  "124": { id: "CA", name: "Canada", continent: "north-america" },
  "140": { id: "CF", name: "Central African Republic", continent: "mea" },
  "148": { id: "TD", name: "Chad", continent: "mea" },
  "152": { id: "CL", name: "Chile", continent: "latam" },
  "156": { id: "CN", name: "China", continent: "asia" },
  "170": { id: "CO", name: "Colombia", continent: "latam" },
  "178": { id: "CG", name: "Congo", continent: "mea" },
  "180": { id: "CD", name: "Democratic Republic of the Congo", continent: "mea" },
  "188": { id: "CR", name: "Costa Rica", continent: "latam" },
  "384": { id: "CI", name: "Ivory Coast", continent: "mea" },
  "191": { id: "HR", name: "Croatia", continent: "europe" },
  "192": { id: "CU", name: "Cuba", continent: "latam" },
  "196": { id: "CY", name: "Cyprus", continent: "europe" },
  "203": { id: "CZ", name: "Czech Republic", continent: "europe" },
  "208": { id: "DK", name: "Denmark", continent: "europe" },
  "262": { id: "DJ", name: "Djibouti", continent: "mea" },
  "214": { id: "DO", name: "Dominican Republic", continent: "latam" },
  "218": { id: "EC", name: "Ecuador", continent: "latam" },
  "818": { id: "EG", name: "Egypt", continent: "mea" },
  "222": { id: "SV", name: "El Salvador", continent: "latam" },
  "226": { id: "GQ", name: "Equatorial Guinea", continent: "mea" },
  "232": { id: "ER", name: "Eritrea", continent: "mea" },
  "233": { id: "EE", name: "Estonia", continent: "europe" },
  "231": { id: "ET", name: "Ethiopia", continent: "mea" },
  "242": { id: "FJ", name: "Fiji", continent: "oceania" },
  "246": { id: "FI", name: "Finland", continent: "europe" },
  "250": { id: "FR", name: "France", continent: "europe" },
  "266": { id: "GA", name: "Gabon", continent: "mea" },
  "270": { id: "GM", name: "Gambia", continent: "mea" },
  "268": { id: "GE", name: "Georgia", continent: "asia" },
  "276": { id: "DE", name: "Germany", continent: "europe" },
  "288": { id: "GH", name: "Ghana", continent: "mea" },
  "300": { id: "GR", name: "Greece", continent: "europe" },
  "304": { id: "GL", name: "Greenland", continent: "north-america" },
  "320": { id: "GT", name: "Guatemala", continent: "latam" },
  "324": { id: "GN", name: "Guinea", continent: "mea" },
  "624": { id: "GW", name: "Guinea-Bissau", continent: "mea" },
  "328": { id: "GY", name: "Guyana", continent: "latam" },
  "332": { id: "HT", name: "Haiti", continent: "latam" },
  "340": { id: "HN", name: "Honduras", continent: "latam" },
  "348": { id: "HU", name: "Hungary", continent: "europe" },
  "352": { id: "IS", name: "Iceland", continent: "europe" },
  "356": { id: "IN", name: "India", continent: "asia" },
  "360": { id: "ID", name: "Indonesia", continent: "asia" },
  "364": { id: "IR", name: "Iran", continent: "mea" },
  "368": { id: "IQ", name: "Iraq", continent: "mea" },
  "372": { id: "IE", name: "Ireland", continent: "europe" },
  "376": { id: "IL", name: "Israel", continent: "mea" },
  "380": { id: "IT", name: "Italy", continent: "europe" },
  "388": { id: "JM", name: "Jamaica", continent: "latam" },
  "392": { id: "JP", name: "Japan", continent: "asia" },
  "400": { id: "JO", name: "Jordan", continent: "mea" },
  "398": { id: "KZ", name: "Kazakhstan", continent: "asia" },
  "404": { id: "KE", name: "Kenya", continent: "mea" },
  "408": { id: "KP", name: "North Korea", continent: "asia" },
  "410": { id: "KR", name: "South Korea", continent: "asia" },
  "414": { id: "KW", name: "Kuwait", continent: "mea" },
  "417": { id: "KG", name: "Kyrgyzstan", continent: "asia" },
  "418": { id: "LA", name: "Laos", continent: "asia" },
  "428": { id: "LV", name: "Latvia", continent: "europe" },
  "422": { id: "LB", name: "Lebanon", continent: "mea" },
  "426": { id: "LS", name: "Lesotho", continent: "mea" },
  "430": { id: "LR", name: "Liberia", continent: "mea" },
  "434": { id: "LY", name: "Libya", continent: "mea" },
  "440": { id: "LT", name: "Lithuania", continent: "europe" },
  "442": { id: "LU", name: "Luxembourg", continent: "europe" },
  "807": { id: "MK", name: "North Macedonia", continent: "europe" },
  "450": { id: "MG", name: "Madagascar", continent: "mea" },
  "454": { id: "MW", name: "Malawi", continent: "mea" },
  "458": { id: "MY", name: "Malaysia", continent: "asia" },
  "466": { id: "ML", name: "Mali", continent: "mea" },
  "478": { id: "MR", name: "Mauritania", continent: "mea" },
  "484": { id: "MX", name: "Mexico", continent: "north-america" },
  "498": { id: "MD", name: "Moldova", continent: "europe" },
  "496": { id: "MN", name: "Mongolia", continent: "asia" },
  "499": { id: "ME", name: "Montenegro", continent: "europe" },
  "504": { id: "MA", name: "Morocco", continent: "mea" },
  "508": { id: "MZ", name: "Mozambique", continent: "mea" },
  "104": { id: "MM", name: "Myanmar", continent: "asia" },
  "516": { id: "NA", name: "Namibia", continent: "mea" },
  "524": { id: "NP", name: "Nepal", continent: "asia" },
  "528": { id: "NL", name: "Netherlands", continent: "europe" },
  "554": { id: "NZ", name: "New Zealand", continent: "oceania" },
  "558": { id: "NI", name: "Nicaragua", continent: "latam" },
  "562": { id: "NE", name: "Niger", continent: "mea" },
  "566": { id: "NG", name: "Nigeria", continent: "mea" },
  "578": { id: "NO", name: "Norway", continent: "europe" },
  "512": { id: "OM", name: "Oman", continent: "mea" },
  "586": { id: "PK", name: "Pakistan", continent: "asia" },
  "591": { id: "PA", name: "Panama", continent: "latam" },
  "598": { id: "PG", name: "Papua New Guinea", continent: "oceania" },
  "600": { id: "PY", name: "Paraguay", continent: "latam" },
  "604": { id: "PE", name: "Peru", continent: "latam" },
  "608": { id: "PH", name: "Philippines", continent: "asia" },
  "616": { id: "PL", name: "Poland", continent: "europe" },
  "620": { id: "PT", name: "Portugal", continent: "europe" },
  "630": { id: "PR", name: "Puerto Rico", continent: "latam" },
  "634": { id: "QA", name: "Qatar", continent: "mea" },
  "642": { id: "RO", name: "Romania", continent: "europe" },
  "643": { id: "RU", name: "Russia", continent: "europe" },
  "646": { id: "RW", name: "Rwanda", continent: "mea" },
  "682": { id: "SA", name: "Saudi Arabia", continent: "mea" },
  "686": { id: "SN", name: "Senegal", continent: "mea" },
  "688": { id: "RS", name: "Serbia", continent: "europe" },
  "694": { id: "SL", name: "Sierra Leone", continent: "mea" },
  "703": { id: "SK", name: "Slovakia", continent: "europe" },
  "705": { id: "SI", name: "Slovenia", continent: "europe" },
  "706": { id: "SO", name: "Somalia", continent: "mea" },
  "710": { id: "ZA", name: "South Africa", continent: "mea" },
  "728": { id: "SS", name: "South Sudan", continent: "mea" },
  "724": { id: "ES", name: "Spain", continent: "europe" },
  "144": { id: "LK", name: "Sri Lanka", continent: "asia" },
  "736": { id: "SD", name: "Sudan", continent: "mea" },
  "740": { id: "SR", name: "Suriname", continent: "latam" },
  "748": { id: "SZ", name: "Eswatini", continent: "mea" },
  "752": { id: "SE", name: "Sweden", continent: "europe" },
  "756": { id: "CH", name: "Switzerland", continent: "europe" },
  "760": { id: "SY", name: "Syria", continent: "mea" },
  "158": { id: "TW", name: "Taiwan", continent: "asia" },
  "762": { id: "TJ", name: "Tajikistan", continent: "asia" },
  "764": { id: "TH", name: "Thailand", continent: "asia" },
  "626": { id: "TL", name: "Timor-Leste", continent: "asia" },
  "768": { id: "TG", name: "Togo", continent: "mea" },
  "780": { id: "TT", name: "Trinidad and Tobago", continent: "latam" },
  "788": { id: "TN", name: "Tunisia", continent: "mea" },
  "792": { id: "TR", name: "Turkey", continent: "mea" },
  "795": { id: "TM", name: "Turkmenistan", continent: "asia" },
  "800": { id: "UG", name: "Uganda", continent: "mea" },
  "804": { id: "UA", name: "Ukraine", continent: "europe" },
  "784": { id: "AE", name: "United Arab Emirates", continent: "mea" },
  "826": { id: "GB", name: "United Kingdom", continent: "europe" },
  "840": { id: "US", name: "United States", continent: "north-america" },
  "858": { id: "UY", name: "Uruguay", continent: "latam" },
  "860": { id: "UZ", name: "Uzbekistan", continent: "asia" },
  "862": { id: "VE", name: "Venezuela", continent: "latam" },
  "704": { id: "VN", name: "Vietnam", continent: "asia" },
  "732": { id: "EH", name: "Western Sahara", continent: "mea" },
  "887": { id: "YE", name: "Yemen", continent: "mea" },
  "894": { id: "ZM", name: "Zambia", continent: "mea" },
  "716": { id: "ZW", name: "Zimbabwe", continent: "mea" },
};

const countriesGeo = topojson.feature(world, world.objects.countries);

const REAL_WORLD_COUNTRIES = [];

countriesGeo.features.forEach((feature) => {
  const meta = ISO_NUM_TO_ALPHA2[feature.id];
  if (!meta) return;

  const rawPath = pathGenerator(feature);
  if (!rawPath) return;

  const centroid = pathGenerator.centroid(feature);
  const cx = isNaN(centroid[0]) ? 400 : parseFloat(centroid[0].toFixed(1));
  const cy = isNaN(centroid[1]) ? 200 : parseFloat(centroid[1].toFixed(1));

  REAL_WORLD_COUNTRIES.push({
    id: meta.id,
    name: meta.name,
    continent: meta.continent,
    cx,
    cy,
    d: formatPath(rawPath),
  });
});

// Sort alphabetically by name
REAL_WORLD_COUNTRIES.sort((a, b) => a.name.localeCompare(b.name));

const fileContent = `// Autogenerated high-precision Natural Earth 110m vector topography
// Mathematically projected via D3 Natural Earth with strict antimeridian clipping.
// Canvas: 800x400 Natural Earth projection.

export interface CountryShape {
  id: string;
  name: string;
  continent: "north-america" | "europe" | "asia" | "latam" | "mea" | "oceania";
  cx: number;
  cy: number;
  d: string;
}

export const GLOBAL_LAND_PATH: string = "${GLOBAL_LAND_PATH}";

export const REAL_WORLD_COUNTRIES: CountryShape[] = ${JSON.stringify(REAL_WORLD_COUNTRIES, null, 2)};
`;

const outputPath = path.join(rootDir, "src/components/zerolight/molecules/world-map-data.ts");
fs.writeFileSync(outputPath, fileContent, "utf8");
console.log(`Generated world-map-data.ts with ${REAL_WORLD_COUNTRIES.length} countries and clean landmass.`);
