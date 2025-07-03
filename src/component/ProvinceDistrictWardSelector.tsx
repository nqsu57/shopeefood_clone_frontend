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
}


const ProvinceDistrictWardSelector = ({
    value,
    onChange,
}: ProvinceDistrictWardSelectorProps) => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);



    // Load provinces
    useEffect(() => {
        axios.get("http://localhost:8000/api/provinces").then((res) => {
            setProvinces(res.data);
        });
    }, []);

    // When province changes
    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = parseInt(e.target.value);
        const province = provinces.find((p) => p.id === provinceId) || null;

        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);

        if (province) {
            axios.get(`${API_BASE}/provinces/${provinceId}/districts`).then((res) => {
                setDistricts(res.data);
            });
        }

        onChange(province, null, null);
    };

    // When district changes
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = parseInt(e.target.value);
        const district = districts.find((d) => d.id === districtId) || null;

        setSelectedDistrict(district);
        setSelectedWard(null);
        setWards([]);

        if (district) {
            axios.get(`${API_BASE}/districts/${districtId}/wards`).then((res) => {
                setWards(res.data);
            });
        }

        onChange(selectedProvince, district, null);
    };
    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardId = parseInt(e.target.value);
        const ward = wards.find((w) => w.id === wardId) || null;

        setSelectedWard(ward);
        onChange(selectedProvince, selectedDistrict, ward);
    };

    return (
        <div>
            <div>
                {/* <label>Province: </label> */}
                <select onChange={handleProvinceChange} defaultValue="">
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
                <select
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
                </select>
            </div>

            <div>
                {/* <label>Ward: </label> */}
                <select onChange={handleWardChange} disabled={!selectedDistrict} defaultValue="">
                    <option value="" disabled>
                        {selectedDistrict ? "Select Ward" : "Select District First"}
                    </option>
                    {wards.map((ward) => (
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
