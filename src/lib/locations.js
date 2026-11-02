// Gujarat cities for /digital-marketing-agency pages. Each note must stay specific to that place; do not add offices or clients here.
const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const gujaratCities = [
  ['Surat', 'South Gujarat', 'Surat is Gujarat’s textile and diamond capital, with exporters, traders, jewellers and fast-growing retail brands.'],
  ['Vadodara', 'Central Gujarat', 'Vadodara combines heavy engineering, chemicals and pharmaceuticals with education, healthcare and strong retail.'],
  ['Rajkot', 'Saurashtra', 'Rajkot is known for engineering, machine tools, auto parts, castings and imitation jewellery.'],
  ['Gandhinagar', 'North Gujarat', 'Gandhinagar is the state capital, with GIFT City, financial firms, IT companies, colleges and growing housing.'],
  ['Bhavnagar', 'Saurashtra', 'Bhavnagar is known for diamond cutting, salt, plastics and the nearby Alang ship-recycling yard.'],
  ['Jamnagar', 'Saurashtra', 'Jamnagar is known for brass parts manufacturing and the large refinery complex nearby.'],
  ['Junagadh', 'Saurashtra', 'Junagadh is a historic city near Girnar, with tourism, agriculture and education businesses.'],
  ['Anand', 'Central Gujarat', 'Anand is known for Amul and the dairy sector, with Vallabh Vidyanagar’s colleges nearby.'],
  ['Nadiad', 'Central Gujarat', 'Nadiad is a major Kheda district city known for healthcare and education, with traders and small manufacturers.'],
  ['Mehsana', 'North Gujarat', 'Mehsana is known for Dudhsagar Dairy, oil and gas activity and nearby industrial estates.'],
  ['Morbi', 'Saurashtra', 'Morbi is India’s ceramic tile capital, and it is also known for wall clocks and sanitaryware.'],
  ['Surendranagar', 'Saurashtra', 'Surendranagar and Wadhwan are known for cotton, ginning, ceramics and textile trade.'],
  ['Bharuch', 'South Gujarat', 'Bharuch is close to the Dahej industrial region and is linked to chemicals, ports and textiles.'],
  ['Ankleshwar', 'South Gujarat', 'Ankleshwar is one of Gujarat’s largest GIDC estates, known for chemicals, dyes and pharmaceuticals.'],
  ['Vapi', 'South Gujarat', 'Vapi is a major GIDC hub for chemicals, paper and pharmaceuticals on the Mumbai–Ahmedabad corridor.'],
  ['Valsad', 'South Gujarat', 'Valsad is known for Alphonso mangoes and is close to the Vapi and Umbergaon industrial areas.'],
  ['Navsari', 'South Gujarat', 'Navsari is linked to diamond work, farming and a strong community of overseas families.'],
  ['Gandhidham', 'Kutch', 'Gandhidham is the commercial centre for Kandla Port, with logistics, timber and trading businesses.'],
  ['Bhuj', 'Kutch', 'Bhuj is the gateway to Kutch, with tourism, handicrafts and growing industrial activity nearby.'],
  ['Palanpur', 'North Gujarat', 'Palanpur is the Banaskantha district centre, with strong links to diamond trading, dairy and agriculture.'],
  ['Himatnagar', 'North Gujarat', 'Himatnagar is the Sabarkantha district centre, known for ceramics, dairy and regional trade.'],
  ['Patan', 'North Gujarat', 'Patan is a historic city known for Patola textiles and the Rani ki Vav heritage site.'],
  ['Godhra', 'Central Gujarat', 'Godhra is the Panchmahal district centre, with traders and links to the Halol industrial belt.'],
  ['Dahod', 'Central Gujarat', 'Dahod is a tribal-region commercial centre near the Madhya Pradesh border, with railway and trading links.'],
  ['Porbandar', 'Saurashtra', 'Porbandar is a coastal city with fisheries, cement and tourism linked to its Gandhi heritage.'],
  ['Amreli', 'Saurashtra', 'Amreli is a Saurashtra district centre with agriculture, diamond work and regional trade.'],
  ['Veraval', 'Saurashtra', 'Veraval is a major fishing port near Somnath, with seafood exporters and pilgrimage tourism.'],
  ['Botad', 'Saurashtra', 'Botad is a Saurashtra district town linked to cotton, diamond work and regional trade.'],
  ['Kalol', 'North Gujarat', 'Kalol is an industrial town near Gandhinagar, with engineering units and oil-sector activity nearby.'],
  ['Mundra', 'Kutch', 'Mundra is home to one of India’s largest private ports, with logistics and port-linked businesses.'],
];

const toCity = ([name, zone, note]) => ({ slug: toSlug(name), name, zone, note });

export const locations = gujaratCities.map(toCity);
export const getLocation = (slug) => locations.find(location => location.slug === slug);
export const locationGroups = [...new Set(locations.map(location => location.zone))].map(zone => ({ zone, items: locations.filter(location => location.zone === zone) }));

export function nearbyLocations(location, count = 6) {
  const peers = locations.filter(item => item.zone === location.zone);
  const start = peers.findIndex(item => item.slug === location.slug);
  return Array.from({ length: Math.min(count, peers.length - 1) }, (_, i) => peers[(start + i + 1) % peers.length]);
}
