import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import FoodCard from '../FoodCard/FoodCard';
import { Food } from "../../types/food";
import styles from './Search.module.css';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState<Food[]>([]);
    const query = searchParams.get("q");

    useEffect(() => {
        if (query) {
            axios
                .get(`http://localhost:8000/api/search?q=${query}`)
                .then((res) => setResults(res.data))
                .catch((err) => console.error(err));
        }
    }, [query]);

    return (
        <div className={styles.searchContainer}>
            <h2 className={styles.searchTitle}>Kết quả tìm kiếm cho "{query}"</h2>
            <div className={styles.resultGrid}>
                {results.length > 0 ? (
                    results.map((food) => (
                        <FoodCard key={food.id} food={food} />
                    ))
                ) : (
                    <p>Không tìm thấy kết quả.</p>
                )}
            </div>
        </div>
    );
}

export default SearchPage;