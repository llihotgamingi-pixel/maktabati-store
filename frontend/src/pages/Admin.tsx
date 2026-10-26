import { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    total: number;
    created_at: string;
}

export default function Admin() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin/orders').then(res => setOrders(res.data));
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-primary">لوحة التحكم - الطلبات</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-borderLight overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-sage text-primary">
                            <tr>
                                <th className="p-4 font-bold">رقم الطلب</th>
                                <th className="p-4 font-bold">الزبون</th>
                                <th className="p-4 font-bold">الهاتف</th>
                                <th className="p-4 font-bold">العنوان</th>
                                <th className="p-4 font-bold">الإجمالي</th>
                                <th className="p-4 font-bold">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-borderLight">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-cream transition">
                                    <td className="p-4 text-textMain font-bold">#{order.id}</td>
                                    <td className="p-4 text-textMain">{order.customer_name}</td>
                                    <td className="p-4 text-textMain" dir="ltr">{order.customer_phone}</td>
                                    <td className="p-4 text-textMuted">{order.customer_address}</td>
                                    <td className="p-4 text-primary font-bold">{order.total.toLocaleString()} د.ع</td>
                                    <td className="p-4 text-textMuted text-sm">{new Date(order.created_at).toLocaleString('ar-IQ')}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-textMuted">لا توجد طلبات بعد.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
