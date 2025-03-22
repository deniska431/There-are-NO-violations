const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite:./database.sqlite');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false
    },
    carNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'новая заявка'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    rejectReason: {
        type: DataTypes.STRING
    }
});
// Определяем связи
Request.belongsTo(User, { foreignKey: 'userId' });

// Инициализация моделей и синхронизация с базой данных
const initModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
};

module.exports = { User, Request, initModels };