import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCartStore, Product } from '../store/cartStore';
import { Search, Plus } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState('الكل');
    const [search, setSearch] = useState('');
    const addItem = useCartStore(state => state.addItem);

    useEffect(() => {
        axios.get('http://localhost:5000/api/products').then(res => setProducts(res.data));
    }, []);

    const categories = ['الكل', 'الاستنساخ والطباعة', 'الهدايا', 'القرطاسية'];

    const filtered = products.filter(p => 
        (filter === 'الكل' || p.category === filter) &&
        (p.name.includes(search))
    );

    return (
        <div>
            {/* Hero */}
            <div className="bg-sage rounded-2xl p-8 mb-10 text-center text-primary shadow-sm">
                <h2 className="text-3xl font-bold mb-3">كل اللي تحتاجه، بمكان واحد</h2>
                <p className="text-lg opacity-90">قرطاسية، هدايا، وطباعة بجودة تهتم بيها</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute right-3 top-3 text-textMuted" size={20} />
                    <input 
                        type="text" 
                        placeholder="ابحث عن منتج..." 
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-borderLight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                    {categories.map(c => (
                        <button 
                            key={c}
                            onClick={() => setFilter(c)}
                            className={`whitespace-nowrap px-6 py-2 rounded-xl transition font-semibold text-sm ${filter === c ? 'bg-primary text-white shadow-md' : 'bg-white text-textMuted border border-borderLight hover:bg-sage hover:text-primary'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-borderLight overflow-hidden flex flex-col transition hover:shadow-md">
                        <div className="h-40 bg-gray-100 relative">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs px-2 py-1 rounded-lg text-primary font-bold">
                                {product.category}
                            </span>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-textMain text-sm md:text-base leading-tight mb-2 flex-grow">{product.name}</h3>
                            <div className="flex justify-between items-center mt-3">
                                <span className="font-bold text-primary">{product.price.toLocaleString()} د.ع</span>
                                <button 
                                    onClick={() => addItem(product)}
                                    className="bg-primary text-white p-2 rounded-lg hover:bg-secondary transition active:scale-95"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-10 text-textMuted">
                        لا توجد منتجات مطابقة لبحثك.
                    </div>
                )}
            </div>
        </div>
    );
}
