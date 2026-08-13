/**
 * capitals.ts — one capital per EMEA entity. Populated now, rendered in State 3.
 *
 * Nothing in State 1 reads this file beyond the completeness assertion in
 * atlas.ts. It exists so that State 3 is a drop-in: the ions held in the trap
 * are already sited, typed and annotated.
 *
 * Fields are named `lat` and `lon` rather than a positional pair, because
 * d3-geo takes [lon, lat] and every bug in this area comes from the swap.
 * Use `toLonLat()` at the d3 boundary and nowhere else.
 *
 * Coordinates are city-centre to roughly 0.01 degrees, which is well inside a
 * pixel at any zoom this map supports.
 *
 * Where a state has more than one capital, or where the seat of government is
 * not the constitutional capital, the constitutional capital is the `name` and
 * the rest goes in `note`. Where a capital is contested, `contested` is set and
 * `note` states the facts without asserting a position — see the policy in
 * disputed.ts, which applies to this file too.
 */
import type { Alpha3 } from './iso';

export interface Capital {
  readonly iso: Alpha3;
  readonly name: string;
  readonly lat: number;
  readonly lon: number;
  /** Set where sovereignty over the capital, or its status, is contested. */
  readonly contested?: boolean;
  /** Additional seats, alternative capitals, or status facts. */
  readonly note?: string;
}

export const CAPITALS: readonly Capital[] = [
  // --- Northern Europe ---
  { iso: 'ALA', name: 'Mariehamn', lat: 60.1, lon: 19.94 },
  { iso: 'DNK', name: 'Copenhagen', lat: 55.68, lon: 12.57 },
  { iso: 'EST', name: 'Tallinn', lat: 59.44, lon: 24.75 },
  { iso: 'FIN', name: 'Helsinki', lat: 60.17, lon: 24.94 },
  { iso: 'FRO', name: 'Tórshavn', lat: 62.01, lon: -6.77 },
  { iso: 'ISL', name: 'Reykjavík', lat: 64.15, lon: -21.94 },
  { iso: 'LVA', name: 'Riga', lat: 56.95, lon: 24.11 },
  { iso: 'LTU', name: 'Vilnius', lat: 54.69, lon: 25.28 },
  { iso: 'NOR', name: 'Oslo', lat: 59.91, lon: 10.75 },
  { iso: 'SWE', name: 'Stockholm', lat: 59.33, lon: 18.07 },

  // --- Western Europe ---
  { iso: 'AUT', name: 'Vienna', lat: 48.21, lon: 16.37 },
  { iso: 'BEL', name: 'Brussels', lat: 50.85, lon: 4.35 },
  { iso: 'CHE', name: 'Bern', lat: 46.95, lon: 7.45, note: 'Federal city; Switzerland designates no formal capital.' },
  { iso: 'DEU', name: 'Berlin', lat: 52.52, lon: 13.4 },
  { iso: 'FRA', name: 'Paris', lat: 48.86, lon: 2.35 },
  { iso: 'GBR', name: 'London', lat: 51.51, lon: -0.13 },
  { iso: 'GGY', name: 'St Peter Port', lat: 49.46, lon: -2.54 },
  { iso: 'IMN', name: 'Douglas', lat: 54.15, lon: -4.48 },
  { iso: 'IRL', name: 'Dublin', lat: 53.35, lon: -6.26 },
  { iso: 'JEY', name: 'St Helier', lat: 49.19, lon: -2.1 },
  { iso: 'LIE', name: 'Vaduz', lat: 47.14, lon: 9.52 },
  { iso: 'LUX', name: 'Luxembourg', lat: 49.61, lon: 6.13 },
  { iso: 'MCO', name: 'Monaco', lat: 43.73, lon: 7.42 },
  { iso: 'NLD', name: 'Amsterdam', lat: 52.37, lon: 4.9, note: 'Constitutional capital; the seat of government is The Hague.' },

  // --- Southern Europe ---
  { iso: 'AND', name: 'Andorra la Vella', lat: 42.51, lon: 1.52 },
  { iso: 'CYP', name: 'Nicosia', lat: 35.17, lon: 33.36, contested: true, note: 'The city is divided; the Republic of Cyprus administers the southern sector.' },
  { iso: 'ESP', name: 'Madrid', lat: 40.42, lon: -3.7 },
  { iso: 'GRC', name: 'Athens', lat: 37.98, lon: 23.73 },
  { iso: 'ITA', name: 'Rome', lat: 41.9, lon: 12.5 },
  { iso: 'MLT', name: 'Valletta', lat: 35.9, lon: 14.51 },
  { iso: 'PRT', name: 'Lisbon', lat: 38.72, lon: -9.14 },
  { iso: 'SMR', name: 'San Marino', lat: 43.94, lon: 12.45 },
  { iso: 'VAT', name: 'Vatican City', lat: 41.9, lon: 12.45 },
  { iso: 'XNC', name: 'North Nicosia', lat: 35.19, lon: 33.36, contested: true, note: 'Administered from the northern sector of the divided city.' },

  // --- Central & Eastern Europe ---
  { iso: 'ALB', name: 'Tirana', lat: 41.33, lon: 19.82 },
  { iso: 'BGR', name: 'Sofia', lat: 42.7, lon: 23.32 },
  { iso: 'BIH', name: 'Sarajevo', lat: 43.86, lon: 18.41 },
  { iso: 'BLR', name: 'Minsk', lat: 53.9, lon: 27.57 },
  { iso: 'CZE', name: 'Prague', lat: 50.09, lon: 14.42 },
  { iso: 'HRV', name: 'Zagreb', lat: 45.81, lon: 15.98 },
  { iso: 'HUN', name: 'Budapest', lat: 47.5, lon: 19.04 },
  { iso: 'MDA', name: 'Chișinău', lat: 47.01, lon: 28.86 },
  { iso: 'MKD', name: 'Skopje', lat: 42.0, lon: 21.43 },
  { iso: 'MNE', name: 'Podgorica', lat: 42.44, lon: 19.26, note: 'Cetinje is the Old Royal Capital.' },
  { iso: 'POL', name: 'Warsaw', lat: 52.23, lon: 21.01 },
  { iso: 'ROU', name: 'Bucharest', lat: 44.43, lon: 26.1 },
  { iso: 'SRB', name: 'Belgrade', lat: 44.79, lon: 20.45 },
  { iso: 'SVK', name: 'Bratislava', lat: 48.15, lon: 17.11 },
  { iso: 'SVN', name: 'Ljubljana', lat: 46.06, lon: 14.51 },
  { iso: 'UKR', name: 'Kyiv', lat: 50.45, lon: 30.52 },
  { iso: 'XKX', name: 'Pristina', lat: 42.66, lon: 21.16 },

  // --- South Caucasus ---
  { iso: 'ARM', name: 'Yerevan', lat: 40.18, lon: 44.51 },
  { iso: 'AZE', name: 'Baku', lat: 40.41, lon: 49.87 },
  { iso: 'GEO', name: 'Tbilisi', lat: 41.72, lon: 44.79, note: 'The legislature sits in Kutaisi for part of its business.' },

  // --- Middle East ---
  { iso: 'ARE', name: 'Abu Dhabi', lat: 24.45, lon: 54.38 },
  { iso: 'BHR', name: 'Manama', lat: 26.23, lon: 50.59 },
  { iso: 'IRQ', name: 'Baghdad', lat: 33.32, lon: 44.36 },
  {
    iso: 'ISR', name: 'Jerusalem', lat: 31.78, lon: 35.22, contested: true,
    note:
      'Seat of government. Status is reserved for permanent-status negotiations under UNSC ' +
      '478; most states, including the UK, maintain their embassies in Tel Aviv. Listed as a ' +
      'fact about where government sits, not as a recognition claim.',
  },
  { iso: 'JOR', name: 'Amman', lat: 31.95, lon: 35.93 },
  { iso: 'KWT', name: 'Kuwait City', lat: 29.38, lon: 47.99 },
  { iso: 'LBN', name: 'Beirut', lat: 33.89, lon: 35.5 },
  { iso: 'OMN', name: 'Muscat', lat: 23.59, lon: 58.41 },
  {
    iso: 'PSE', name: 'Ramallah', lat: 31.9, lon: 35.2, contested: true,
    note:
      'Administrative seat of the Palestinian Authority. East Jerusalem is the declared ' +
      'capital under the Basic Law; its status is reserved for permanent-status negotiations.',
  },
  { iso: 'QAT', name: 'Doha', lat: 25.29, lon: 51.53 },
  { iso: 'SAU', name: 'Riyadh', lat: 24.71, lon: 46.68 },
  { iso: 'SYR', name: 'Damascus', lat: 33.51, lon: 36.29 },
  { iso: 'TUR', name: 'Ankara', lat: 39.93, lon: 32.86, note: 'Istanbul is the largest city and the commercial centre.' },
  { iso: 'YEM', name: 'Sanaa', lat: 15.37, lon: 44.19, contested: true, note: 'Constitutional capital; the internationally recognised government has operated from Aden.' },

  // --- North Africa ---
  { iso: 'DZA', name: 'Algiers', lat: 36.75, lon: 3.06 },
  { iso: 'EGY', name: 'Cairo', lat: 30.04, lon: 31.24, note: 'Government functions are transferring to the New Administrative Capital east of Cairo.' },
  { iso: 'ESH', name: 'Laayoune', lat: 27.15, lon: -13.2, contested: true, note: 'Largest city and the administrative centre. The Polisario Front designates Tifariti.' },
  { iso: 'LBY', name: 'Tripoli', lat: 32.89, lon: 13.19 },
  { iso: 'MAR', name: 'Rabat', lat: 34.02, lon: -6.84 },
  { iso: 'TUN', name: 'Tunis', lat: 36.81, lon: 10.18 },

  // --- West Africa ---
  { iso: 'BEN', name: 'Porto-Novo', lat: 6.5, lon: 2.63, note: 'Official capital; the seat of government is Cotonou.' },
  { iso: 'BFA', name: 'Ouagadougou', lat: 12.37, lon: -1.52 },
  { iso: 'CIV', name: 'Yamoussoukro', lat: 6.83, lon: -5.29, note: 'Official capital; the seat of government is Abidjan.' },
  { iso: 'CPV', name: 'Praia', lat: 14.93, lon: -23.51 },
  { iso: 'GHA', name: 'Accra', lat: 5.6, lon: -0.19 },
  { iso: 'GIN', name: 'Conakry', lat: 9.64, lon: -13.58 },
  { iso: 'GMB', name: 'Banjul', lat: 13.45, lon: -16.58 },
  { iso: 'GNB', name: 'Bissau', lat: 11.86, lon: -15.6 },
  { iso: 'LBR', name: 'Monrovia', lat: 6.3, lon: -10.8 },
  { iso: 'MLI', name: 'Bamako', lat: 12.64, lon: -8.0 },
  { iso: 'MRT', name: 'Nouakchott', lat: 18.08, lon: -15.98 },
  { iso: 'NER', name: 'Niamey', lat: 13.51, lon: 2.11 },
  { iso: 'NGA', name: 'Abuja', lat: 9.06, lon: 7.49, note: 'Lagos is the largest city and the commercial centre.' },
  { iso: 'SEN', name: 'Dakar', lat: 14.72, lon: -17.47 },
  { iso: 'SLE', name: 'Freetown', lat: 8.48, lon: -13.23 },
  { iso: 'TGO', name: 'Lomé', lat: 6.13, lon: 1.22 },

  // --- Central Africa ---
  { iso: 'AGO', name: 'Luanda', lat: -8.84, lon: 13.23 },
  { iso: 'CAF', name: 'Bangui', lat: 4.36, lon: 18.56 },
  { iso: 'CMR', name: 'Yaoundé', lat: 3.85, lon: 11.5, note: 'Douala is the largest city and the commercial centre.' },
  { iso: 'COD', name: 'Kinshasa', lat: -4.44, lon: 15.27 },
  { iso: 'COG', name: 'Brazzaville', lat: -4.27, lon: 15.27 },
  { iso: 'GAB', name: 'Libreville', lat: 0.39, lon: 9.45 },
  { iso: 'GNQ', name: 'Malabo', lat: 3.75, lon: 8.78, note: 'Ciudad de la Paz on the mainland is designated as the future capital.' },
  { iso: 'STP', name: 'São Tomé', lat: 0.34, lon: 6.73 },
  { iso: 'TCD', name: "N'Djamena", lat: 12.11, lon: 15.05 },

  // --- East Africa ---
  { iso: 'BDI', name: 'Gitega', lat: -3.43, lon: 29.93, note: 'Political capital since 2019; Bujumbura remains the economic capital.' },
  { iso: 'COM', name: 'Moroni', lat: -11.7, lon: 43.26 },
  { iso: 'DJI', name: 'Djibouti', lat: 11.59, lon: 43.15 },
  { iso: 'ERI', name: 'Asmara', lat: 15.34, lon: 38.93 },
  { iso: 'ETH', name: 'Addis Ababa', lat: 9.01, lon: 38.76, note: 'Seat of the African Union Commission.' },
  { iso: 'KEN', name: 'Nairobi', lat: -1.29, lon: 36.82, note: 'Seat of UNEP and UN-Habitat.' },
  { iso: 'MDG', name: 'Antananarivo', lat: -18.88, lon: 47.51 },
  { iso: 'MOZ', name: 'Maputo', lat: -25.97, lon: 32.57 },
  { iso: 'MUS', name: 'Port Louis', lat: -20.16, lon: 57.5 },
  { iso: 'MWI', name: 'Lilongwe', lat: -13.96, lon: 33.79 },
  { iso: 'RWA', name: 'Kigali', lat: -1.94, lon: 30.06 },
  { iso: 'SDN', name: 'Khartoum', lat: 15.5, lon: 32.56, contested: true, note: 'Contested during the conflict that began in 2023; Port Sudan has served as the administrative seat.' },
  { iso: 'SOM', name: 'Mogadishu', lat: 2.05, lon: 45.32 },
  { iso: 'SSD', name: 'Juba', lat: 4.85, lon: 31.58 },
  { iso: 'SYC', name: 'Victoria', lat: -4.62, lon: 55.45 },
  { iso: 'TZA', name: 'Dodoma', lat: -6.16, lon: 35.75, note: 'Official capital; Dar es Salaam remains the largest city and commercial centre.' },
  { iso: 'UGA', name: 'Kampala', lat: 0.35, lon: 32.58 },
  { iso: 'XSO', name: 'Hargeisa', lat: 9.56, lon: 44.07 },
  { iso: 'ZMB', name: 'Lusaka', lat: -15.39, lon: 28.32 },
  { iso: 'ZWE', name: 'Harare', lat: -17.83, lon: 31.05 },

  // --- Southern Africa ---
  { iso: 'BWA', name: 'Gaborone', lat: -24.63, lon: 25.92 },
  { iso: 'LSO', name: 'Maseru', lat: -29.31, lon: 27.48 },
  { iso: 'NAM', name: 'Windhoek', lat: -22.56, lon: 17.08 },
  { iso: 'SWZ', name: 'Mbabane', lat: -26.32, lon: 31.14, note: 'Administrative capital; the legislature sits at Lobamba.' },
  { iso: 'ZAF', name: 'Pretoria', lat: -25.75, lon: 28.19, note: 'Executive capital. Cape Town is the legislative capital and Bloemfontein the judicial capital.' },
];

/** alpha-3 -> capital, for O(1) lookup by the readout and by State 3. */
export const CAPITAL_OF: Readonly<Record<string, Capital>> = Object.fromEntries(
  CAPITALS.map((c) => [c.iso, c]),
);

/** d3-geo wants [lon, lat]. Convert here and nowhere else. */
export function toLonLat(c: Capital): [number, number] {
  return [c.lon, c.lat];
}
