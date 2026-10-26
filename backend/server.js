const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// JSON Database Setup
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}
const dbPath = path.join(dbDir, 'db.json');

// Initial seed data
const initialData = {
    products: [
        { id: 1, name: "طباعة ملازم جامعية (جامعة البصرة)", category: "الاستنساخ والطباعة", price: 5000, stock: 1000, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80" },
        { id: 2, name: "بوكس هدية تخرج - تغليف مميز", category: "الهدايا", price: 25000, stock: 20, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80" },
        { id: 3, name: "طقم أقلام كلاسيك", category: "القرطاسية", price: 8000, stock: 50, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=400&q=80" },
        { id: 4, name: "ساعة رجالية أنيقة", category: "الهدايا", price: 35000, stock: 15, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80" },
        { id: 5, name: "أقلام تلوين 24 لون", category: "القرطاسية", price: 4500, stock: 100, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80" },
        { id: 6, name: "طباعة صور A4 ملون", category: "الاستنساخ والطباعة", price: 1000, stock: 500, image: "https://images.unsplash.com/photo-1621510464295-8140db590130?auto=format&fit=crop&w=400&q=80" }
    ],
    orders: []
};

// Initialize DB file if not exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

// Helper functions
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// API Routes
app.get('/api/products', (req, res) => {
    try {
        const db = readDB();
        res.json(db.products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read database' });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const { name, phone, address, items, total } = req.body;
        const db = readDB();
        
        const newOrder = {
            id: Date.now(),
            customer_name: name,
            customer_phone: phone,
            customer_address: address,
            items: items,
            total: total,
            created_at: new Date().toISOString()
        };
        
        db.orders.push(newOrder);
        writeDB(db);
        
        res.json({ orderId: newOrder.id, success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save order' });
    }
});

app.get('/api/admin/orders', (req, res) => {
    try {
        const db = readDB();
        const sortedOrders = db.orders.sort((a, b) => b.id - a.id);
        res.json(sortedOrders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
