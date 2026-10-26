import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { Trash2, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);

    const deliveryFee = 3000;
    const subTotal = getTotal();
    const finalTotal = subTotal + (items.length > 0 ? deliveryFee : 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return alert('السلة فارغة!');
        setLoading(true);

        try {
            // Save to database
            const res = await axios.post('http://localhost:5000/api/orders', {
                ...form,
                items,
                total: finalTotal
            });

            const orderId = res.data.orderId;

            // Generate WhatsApp Message
            let msg = `🛍️ *طلب جديد — مكتبة مكتبتي*\n`;
            msg += `رقم الطلب: #${orderId}\n\n`;
            msg += `👤 *بيانات الزبون:*\n`;
            msg += `الاسم: ${form.name}\nالهاتف: ${form.phone}\nالعنوان: ${form.address}\n\n`;
            msg += `🛒 *تفاصيل الطلب:*\n`;
            items.forEach(i => {
                msg += `- ${i.name} (x${i.quantity}) = ${(i.price * i.quantity).toLocaleString()} د.ع\n`;
            });
            msg += `\nالمجموع الفرعي: ${subTotal.toLocaleString()} د.ع\n`;
            msg += `التوصيل: ${deliveryFee.toLocaleString()} د.ع\n`;
            msg += `*الإجمالي: ${finalTotal.toLocaleString()} د.ع*`;

            const encodedMsg = encodeURIComponent(msg);
            const storePhone = "9647700000000"; // Can be modified
            window.open(`https://wa.me/${storePhone}?text=${encodedMsg}`, '_blank');
            
            clearCart();
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء إرسال الطلب');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return <div className="text-center py-20 text-textMuted font-bold text-xl">السلة فارغة حالياً</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-6 text-primary border-b border-borderLight pb-4">مراجعة الطلب</h2>
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-borderLight shadow-sm">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <h4 className="font-bold text-textMain">{item.name}</h4>
                                    <p className="text-primary text-sm font-semibold">{item.price.toLocaleString()} د.ع</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-cream rounded-lg border border-borderLight">
                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 text-primary hover:bg-sage transition rounded-r-lg">-</button>
                                    <span className="px-3 py-1 font-bold text-sm min-w-[2rem] text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-primary hover:bg-sage transition rounded-l-lg">+</button>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-error hover:bg-red-50 p-2 rounded-lg transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full lg:w-[400px]">
                <div className="bg-white p-6 rounded-2xl border border-borderLight shadow-sm sticky top-24">
                    <h3 className="text-xl font-bold mb-4 text-primary">بيانات الزبون</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-textMain mb-1">الاسم الكامل</label>
                            <input required type="text" className="w-full p-3 rounded-lg border border-borderLight bg-cream focus:outline-none focus:border-primary" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-textMain mb-1">رقم الهاتف</label>
                            <input required type="tel" className="w-full p-3 rounded-lg border border-borderLight bg-cream focus:outline-none focus:border-primary" dir="ltr" placeholder="07XXXXXXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-textMain mb-1">عنوان التوصيل الكامل</label>
                            <textarea required className="w-full p-3 rounded-lg border border-borderLight bg-cream focus:outline-none focus:border-primary" rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
                        </div>
                        
                        <div className="border-t border-borderLight pt-4 mt-6 space-y-2">
                            <div className="flex justify-between text-textMuted">
                                <span>المجموع الفرعي:</span>
                                <span>{subTotal.toLocaleString()} د.ع</span>
                            </div>
                            <div className="flex justify-between text-textMuted">
                                <span>التوصيل:</span>
                                <span>{deliveryFee.toLocaleString()} د.ع</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-borderLight mt-2">
                                <span>الإجمالي:</span>
                                <span>{finalTotal.toLocaleString()} د.ع</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full mt-6 bg-whatsapp text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition active:scale-[0.98]"
                        >
                            <MessageCircle size={20} />
                            إرسال الطلب عبر واتساب
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
