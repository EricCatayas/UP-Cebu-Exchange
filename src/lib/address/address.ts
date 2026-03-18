import provinceData from './provinces.json';
import cityData from './cities.json';

export function getProvinces(): { code: string; name: string }[] {
  return provinceData.map((province) => ({ code: province.key, name: province.name }));
}

export function getCitiesByProvince(code: string): { name: string; value: string }[] {
  return cityData.filter((city) => city.province === code).map((city) => ({ name: city.name, value: city.name }));
}
