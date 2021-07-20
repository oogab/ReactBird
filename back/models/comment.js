module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', { // MySQL에는 users 테이블 생성
        // id가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // belongsTo의 역할, 아래와 같은 컬럼 생성
        // UserId: 1
        // PostId: 3
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    })

    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User)
        db.Comment.belongsTo(db.Post)
    }

    return Comment
}