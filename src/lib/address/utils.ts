import provinceData from './provinces.json';
import cityData from './cities.json';
import zipCodeData from './zipCodes.json';

export function getProvinces(): { code: string; name: string }[] {
  return provinceData
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((province) => ({ code: province.key, name: province.name }));
}

export function getCitiesByProvince(code: string): { name: string; value: string }[] {
  return cityData.filter((city) => city.province === code).map((city) => ({ name: city.name, value: city.name })).sort((a, b) => a.name.localeCompare(b.name));
}

export function getZipCodeByCity(cityName: string): string | null {
  if (!cityName) return null;
  const normalized = cityName.trim().toLowerCase();
  const zipCodeEntry = zipCodeData.find(
    (entry) => (entry.area ?? '').trim().toLowerCase() === normalized
  );
  return zipCodeEntry ? zipCodeEntry.zip : null;
}
