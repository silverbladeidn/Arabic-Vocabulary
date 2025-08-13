import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function VocabularyList() {
    const [vocabularies, setVocabularies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Fungsi untuk fetch data yang bisa dipanggil ulang
    const fetchVocabularies = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8080/api/v1/vocabulary");
            // Filter out invalid data and ensure required properties exist
            const validVocabularies = res.data.filter(vocab =>
                vocab &&
                typeof vocab.arabicWord === 'string' &&
                typeof vocab.meaning === 'string'
            );
            setVocabularies(validVocabularies);
        } catch (err) {
            console.error("Error fetching vocabularies:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchVocabularies();
    }, [fetchVocabularies]);

    // SOLUSI 1: Polling - Auto refresh setiap 30 detik
    useEffect(() => {
        const interval = setInterval(() => {
            fetchVocabularies();
        }, 30000); // 30 detik

        return () => clearInterval(interval);
    }, [fetchVocabularies]);

    // SOLUSI 2: Fungsi untuk manual refresh (bisa dipanggil dari parent atau event)
    const refreshData = () => {
        fetchVocabularies();
    };

    // SOLUSI 3: Listen ke window focus (refresh saat user kembali ke tab)
    useEffect(() => {
        const handleFocus = () => {
            fetchVocabularies();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchVocabularies]);

    const filteredVocab = vocabularies.filter(
        (vocab) => {
            const arabicMatch = vocab.arabicWord?.toLowerCase().includes(search.toLowerCase()) || false;
            const meaningMatch = vocab.meaning?.toLowerCase().includes(search.toLowerCase()) || false;
            const transliterationMatch = vocab.transliteration?.toLowerCase().includes(search.toLowerCase()) || false;
            return arabicMatch || meaningMatch || transliterationMatch;
        }
    );

    if (loading) return <p className="text-center mt-10">Loading vocabularies...</p>;

    return (
        <div className="min-h-screen bg-green-600">
            <div className="max-w-6xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">📖 Arabic Vocabulary</h2>
                    {/* Tombol manual refresh */}
                    <button
                        onClick={refreshData}
                        className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
                    >
                        🔄 Refresh
                    </button>
                </div>

                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="🔍 Cari berdasarkan Arab, arti, atau transliterasi..."
                        className="border rounded-lg px-4 py-2 w-full max-w-lg shadow-md focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {filteredVocab.length === 0 ? (
                    <p className="text-center text-white">
                        {search ? "Tidak ada kosakata yang cocok." : "Tidak ada data kosakata."}
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredVocab.map((vocab) => (
                            <div
                                key={vocab.id}
                                className="bg-white rounded-xl shadow-lg p-4 hover:scale-105 hover:shadow-2xl transition transform duration-300"
                            >
                                <div className="mb-2">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {vocab.category || 'General'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-blue-600 mb-2 text-right" dir="rtl">
                                    {vocab.arabicWord || 'No Arabic text'}
                                </h3>
                                <p className="text-sm text-gray-500 italic mb-2">
                                    {vocab.transliteration || 'No transliteration'}
                                </p>
                                <p className="text-gray-700 mb-3 font-medium">
                                    {vocab.meaning || 'No meaning'}
                                </p>
                                {vocab.example && (
                                    <p className="text-sm text-gray-600 mb-3 italic border-l-4 border-green-400 pl-3" dir="rtl">
                                        {vocab.example}<span className="font-semibold"> : Contoh </span>
                                    </p>
                                )}
                                {vocab.imageUrl && (
                                    <img
                                        src={vocab.imageUrl}
                                        alt={vocab.meaning || 'Vocabulary image'}
                                        loading="lazy"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}