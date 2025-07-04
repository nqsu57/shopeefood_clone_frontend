import { useEffect, useState } from "react";
import axios from "axios";
import { Province, District, Ward } from "../types/address";


const API_BASE = "http://localhost:8000/api";

interface ProvinceDistrictWardSelectorProps {
    value?: {
        province_id: number | null;
        district_id: number | null;
        ward_id: number | null;
    };
    onChange: (
        province: Province | null,
        district: District | null,
        ward: Ward | null
    ) => void;
    provinces: Province[];
    districts: District[];
    wards: Ward[];
}


const ProvinceDistrictWardSelector = ({
    value,
    onChange,
    provinces,
    districts,
    wards,
}: ProvinceDistrictWardSelectorProps) => {
    // const [localProvinces, setLocalProvinces] = useState<Province[]>([]);
    const [localDistricts, setLocalDistricts] = useState<District[]>([]);
    const [localWards, setLocalWards] = useState<Ward[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);



    // Load provinces
    // useEffect(() => {
    //     axios.get("http://localhost:8000/api/provinces").then((res) => {
    //         setProvinces(res.data);
    //     });
    // }, []);

    // useEffect(() => {
    //     const p = provinces.find((p) => p.id === value?.province_id) || null;
    //     const d = districts.find((d) => d.id === value?.district_id) || null;
    //     const w = wards.find((w) => w.id === value?.ward_id) || null;

    //     setSelectedProvince(p);
    //     setSelectedDistrict(d);
    //     setSelectedWard(w);

    //     setLocalDistricts(districts);
    //     setLocalWards(wards);
    // }, [value, provinces, districts, wards]);
    useEffect(() => {
        const p = provinces.find((p) => p.id === value?.province_id) || null;

        setSelectedProvince(p);

        if (value?.district_id && districts.length) {
            const d = districts.find((d) => d.id === value.district_id) || null;
            setSelectedDistrict(d);
            setLocalDistricts(districts);
        }

        if (value?.ward_id && wards.length) {
            const w = wards.find((w) => w.id === value.ward_id) || null;
            setSelectedWard(w);
            setLocalWards(wards);
        }
    }, [value, provinces, districts, wards]);


    // When province changes
    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = parseInt(e.target.value);
        const province = provinces.find((p) => p.id === provinceId) || null;

        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setLocalDistricts([]);
        setLocalWards([]);

        if (province) {
            axios
                .get(`${API_BASE}/provinces/${province.id}/districts`).then((res) => {
                    setLocalDistricts(res.data);
                    setSelectedProvince(province);
                    onChange(province, null, null);
                })
                .catch((err) => {
                    console.error(err);
                    onChange(province, null, null); // fallback
                });
        } else {
            onChange(null, null, null);
        }
    };

    // When district changes
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = parseInt(e.target.value);
        const district = localDistricts.find((d) => d.id === districtId) || null;

        setSelectedDistrict(district);
        setSelectedWard(null);
        setLocalWards([]);

        if (district) {
            axios
                .get(`${API_BASE}/districts/${district.id}/wards`)
                .then((res) => {
                    setLocalWards(res.data);
                    setSelectedDistrict(district);
                    onChange(selectedProvince, district, null);
                })
                .catch((err) => {
                    console.error(err);
                    onChange(selectedProvince, district, null);
                });
        } else {
            onChange(selectedProvince, null, null);
        }
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardId = parseInt(e.target.value);
        const ward = localWards.find((w) => w.id === wardId) || null;

        setSelectedWard(ward);
        onChange(selectedProvince, selectedDistrict, ward);
    };

    return (
        <div>
            <div>
                {/* <label>Province: </label> */}
                {/* <select onChange={handleProvinceChange} defaultValue="">
                    <option value="" disabled>
                        Select Province
                    </option>
                    {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                            {prov.name}
                        </option>
                    ))}
                </select> */}
                <select
                    value={selectedProvince?.id || ""}
                    onChange={handleProvinceChange}
                >
                    <option value="" disabled>
                        Select Province
                    </option>
                    {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                            {prov.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                {/* <label>District: </label> */}
                {/* <select
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince}
                    defaultValue=""
                >
                    <option value="" disabled>
                        {selectedProvince ? "Select District" : "Select Province First"}
                    </option>
                    {districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                            {dist.name}
                        </option>
                    ))}
                </select> */}
                <select
                    value={selectedDistrict?.id || ""}
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince}
                >
                    <option value="" disabled>
                        {selectedProvince ? "Select District" : "Select Province First"}
                    </option>
                    {localDistricts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                            {dist.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                {/* <label>Ward: </label> */}
                {/* <select onChange={handleWardChange} disabled={!selectedDistrict} defaultValue="">
                    <option value="" disabled>
                        {selectedDistrict ? "Select Ward" : "Select District First"}
                    </option>
                    {wards.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                            {ward.name}
                        </option>
                    ))}
                </select> */}
                <select
                    value={selectedWard?.id || ""}
                    onChange={handleWardChange}
                    disabled={!selectedDistrict}
                >
                    <option value="" disabled>
                        {selectedDistrict ? "Select Ward" : "Select District First"}
                    </option>
                    {localWards.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                            {ward.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ProvinceDistrictWardSelector;
