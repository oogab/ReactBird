module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { // MySQL에는 users 테이블 생성
        // id가 기본적으로 들어있다.
        email: {
            type: DataTypes.STRING(35), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            allowNull: false, // 필수!
            unique: true, // 고유한 값
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100), // 비밀번호 암호화 시 길이가 길어지기 때문에!
            allowNull: false,
        },
        // hasMany에서는 이런 방식으로 여러개의 값을 가질 수 없다!, 원자성
        // PostId: 1, 2, 4, 6...
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci' // 한글 저장
    })

    User.associate = (db) => {
        db.User.hasMany(db.Post)
        db.User.hasMany(db.Comment)
        db.User.belongsToMany(db.Post, {
            // 중간 테이블 발생! 중간 테이블의 이름을 Like로 정할 수 있다.
            through: 'Like',
            as: 'Liked'
        })
        db.User.belongsToMany(db.User, {
            // 테이블의 이름을 바꿔준다!
            through: 'Follow',
            // 팔로워를 찾으려면! -> 팔로잉 하는 Id를 먼저 찾아야한다!
            as: 'Followers',
            // 같은 테이블의 어떤 Id인지 이름을 바꿔준다!
            foreignKey: 'FollowingId'
        })
        db.User.belongsToMany(db.User, {
            through: 'Follow',
            as: 'Followings',
            foreignKey: 'FollowerId'
        })
    }

    return User
}