const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

// Mount routes
const mountRoutes = (app) => {
    app.use('/api/v1/categories' , categoryRoutes);
    app.use('/api/v1/products' , productRoutes);
    app.use('/api/v1/users' , userRoutes);
    app.use('/api/v1/auth' , authRoutes);
};

module.exports = mountRoutes;