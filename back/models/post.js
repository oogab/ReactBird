module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { // MySQL에는 users 테이블 생성
        // id가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // RetweetId
    }, {
        charset: 'utf8mb4', // 이모티콘 까지
        collate: 'utf8mb4_general_ci' // 이모티콘 저장
    })

    Post.associate = (db) => {
        db.Post.belongsTo(db.User)  // post.addUser, post.getUser, post.setUser
        db.Post.hasMany(db.Comment) // post.addComments, post.getComments
        db.Post.hasMany(db.Image)   // post.addImages, post.getImages
        db.Post.belongsToMany(db.Hashtag, { // post.addHashtags
            through: 'PostHashtag'
        })
        db.Post.belongsToMany(db.User, {    // post.addLikers, post.removeLikers
            through: 'Like',
            // as로 위의 Post, User 관계와 구별!
            as: 'Likers'
        })
        db.Post.belongsTo(db.Post, {    // post.addRetweet
            as: 'Retweet'
        })
    }

    return Post
}