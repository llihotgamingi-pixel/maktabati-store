import { Link } from 'react-router-dom';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function Layout({ children }: { children: React.ReactNode }) {
    const items = useCartStore(state => state.items);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <BookOpen size={28} className="text-sage" />
                        <div>
                            <h1 className="text-xl font-bold">مكتبتي</h1>
                            <p className="text-xs text-sage hidden sm:block">كل احتياجاتك بمكان واحد</p>
                        </div>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="text-sm text-sage hover:text-white transition">الإدارة</Link>
                        <Link to="/checkout" className="relative bg-secondary p-2 rounded-full hover:bg-opacity-80 transition">
                            <ShoppingCart size={24} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-warning text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="bg-primary text-white py-6 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">© {new Date().getFullYear()} مكتبتي - جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}
